import axios from 'axios/index';
import { ImageStore } from 'react-native';
import Api from '../services/Api';
import { convertToByteArray } from '../shared/helpers';
import { API_ENDPOINTS, TRASHPOINT_IMAGE_TYPES } from '../shared/constants';

async function uploadPhotosOnAzure(photo) {
  return Promise.all(
    photo.map(({ url, blob }) => {
      return axios
        .put(url, blob, {
          headers: {
            'x-ms-blob-type': 'BlockBlob',
          },
        })
        .catch(() => {
          return axios
            .put(url, blob, {
              headers: {
                'x-ms-blob-type': 'BlockBlob',
              },
            }).catch(() => {
              return axios
                .put(url, blob, {
                  headers: {
                    'x-ms-blob-type': 'BlockBlob',
                  },
                }).catch((res) => {
                  return res;
                });
            });
        });
    }),
  );
}

async function getUploadURIsForPhotos(photos, eventId) {
  return Api.put(API_ENDPOINTS.FETCH_EVENT_IMAGES(eventId), {
    count: photos.length,
  });
}

async function confirmUploadedPhotos(eventId, uploadedPhotos) {
  const url = API_ENDPOINTS.FETCH_EVENT_IMAGES(eventId);
  const promise = Api.post(url, uploadedPhotos);
  return promise;
}

async function handleEventImageUpload({ photos, eventId }) {
  if ((photos || []).length === 0) {
    return true;
  }
  const photosResponse = await getUploadURIsForPhotos(photos, eventId);

  const uploadedPhotosIds = {
    confirmed: [],
    failed: [],
    backendConfirmed: false,
  };

  if (photosResponse) {
    const thumbnailsPhotos = photosResponse.data
      .filter(pr => pr.type === TRASHPOINT_IMAGE_TYPES.THUMBNAIL)
      .map(({ permission: { token, resourceId } }, index) => {
        const { thumbnail: { base64 } } = photos[index];
        return {
          url: token,
          id: resourceId,
          blob: convertToByteArray(base64),
        };
      });

    const mediumPhotos = photosResponse.data
      .filter(pr => pr.type === TRASHPOINT_IMAGE_TYPES.MEDIUM)
      .map(({ permission: { token, resourceId } }, index) => {
        const { base64 } = photos[index];
        return {
          url: token,
          id: resourceId,
          blob: convertToByteArray(base64),
        };
      });

    const handledPhotos = [...thumbnailsPhotos, ...mediumPhotos];

    const uploadedPhotosResponses = await uploadPhotosOnAzure(handledPhotos);

    if (uploadedPhotosResponses) {
      uploadedPhotosResponses.forEach(({ status }, index) => {
        const state = status === 201 ? 'confirmed' : 'failed';
        uploadedPhotosIds[state].push(handledPhotos[index].id);
      });
      const upRes = await confirmUploadedPhotos(eventId, uploadedPhotosIds);

      if (upRes && upRes.status === 200) {
        uploadedPhotosIds.backendConfirmed = true;
      }
    }
    (thumbnailsPhotos || []).forEach((photo) => {
      if (photo && photo.uri) {
        ImageStore.removeImageForTag(photo.uri);
      }
    });
  }
}

async function createEvent(event) {
  try {
    const newEvent = {
      datasetId: event.datasetId,
      name: event.name,
      address: event.address,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
      whatToBring: event.whatToBring,
      email: event.email,
      coordinatorName: event.coordinatorName,
      phonenumber: event.phonenumber,
      maxPeopleAmount: event.maxPeopleAmount,
      trashpoints: event.trashpoints,
      offlineAttendeesAmount: event.offlineAttendeesAmount,
      attendeesAmount: event.attendeesAmount,
    };
    const photos = event.photos;
    const createEventResponse = await Api.put(API_ENDPOINTS.EVENT, newEvent)
      .catch((err) => { throw err; });
    const uploadStatus = photos && photos !== []
      ? await handleEventImageUpload({
        photos,
        eventId: createEventResponse.data.id,
      }) : undefined;
    return {
      ...createEventResponse.data,
      photoStatus: uploadStatus,
    };
  } catch (ex) {
    throw ex;
  }
}

export default {
  createEvent,
};
