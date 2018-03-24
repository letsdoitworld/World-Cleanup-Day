import Api from '../services/Api';

async function loadEvent(id) {
  try {
    const response = await Api.get(`/event/${id}`,
      {
        withToken: true,
      });
    if (!response || !response.data) {
      throw { error: 'Could not load my events' };
    }
    return response.data;
  } catch (ex) {
    throw ex;
  }
}


export function searchEventsRequest(query, page, pageSize, location) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        {
          status: true,
          events: [
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c',
                organization_name: 'Worked Event',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: true,
                title: 'Worked Event',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c1',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c2',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c3',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c4',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c5',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c6',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c7',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c8',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c9',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c10',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c11',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c12',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c13',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c14',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c15',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c16',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c17',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c18',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c19',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
              {
                id: 'fcc9713a-2c7b-4f87-86ce-871bd5f9383c20',
                organization_name: 'dsdsdsd',
                date: '11.02.2018',
                cover_picture: 'https://www.rbc.ua/static/img/u/k/ukraine_hotel_kiev_01_650x410_1_650x410.jpg',
                available: 3,
                all: 20,
                place: {
                    location: {
                        longitude: 49,
                        lantitude: 35,
                      },
                    distance: 4,
                    city: 'Dnipro',
                    country: 'Ukraine',
                  },
                participant: false,
                title: 'fdfdffdjkkjdfjdkjkdfjkfdjdfjkdfjdfdfjjkdfjkdfjkdfjkdfjkdfjkdfjjkdffd',
              },
            ]
                        .filter(trashPoint => query === undefined || query === null || trashPoint.title.startsWith(query))
                        .slice(page * pageSize, page * pageSize + pageSize),
        },
            );
    }, 3000);
  }).then((response) => {
    return response;
  }).catch((error) => {
    console.log(error);
  });
}

export default {
  searchEventsRequest,
  loadEvent,
};
