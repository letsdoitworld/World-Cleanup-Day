package com.teeme.ldi.location;
import com.google.android.gms.common.api.GoogleApiClient;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.LocationSettingsStatusCodes;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("WeakerAccess")
public class CurrentLocationModule extends ReactContextBaseJavaModule implements
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, ResultCallback<LocationSettingsResult> {
    private static final String MODULE_NAME = "RNCurrentLocation";

    private static final String LATITUDE = "latitude";
    private static final String LONGITUDE = "longitude";
    private static final String REJECT_CODE_LOCATION = "Location";
    private static final String REJECT_MESSAGE_LOCATION_NOT_DETECTED = "location not detected";
    private static final int REQUEST_CHECK_SETTINGS = 1;

    private GoogleApiClient googleApiClient;
    private List<Promise> promisesList = new ArrayList<>();
    private Handler timeOutHandler = new Handler(Looper.getMainLooper());

    private final long TIME_OUT_IN_MILLIS = 10_000L;

    private final ReactApplicationContext reactApplicationContext;

    @SuppressWarnings("WeakerAccess")
    public CurrentLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        buildGoogleApiClient(reactContext);
        reactApplicationContext = reactContext;
        reactContext.addActivityEventListener(new ActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                handleOnActivityResult(requestCode, resultCode, data);
            }

            @Override
            public void onNewIntent(Intent intent) {
                // ignore
            }
        });
    }

    @SuppressWarnings("WeakerAccess")
    void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CHECK_SETTINGS && data !=null) {
            final LocationSettingsStates states = LocationSettingsStates.fromIntent(data);
            switch (resultCode) {
                case Activity.RESULT_OK:
                    requestCurrentLocationCoordinates();
                    break;
                case Activity.RESULT_CANCELED:
                    rejectPromises(REJECT_CODE_LOCATION, states.toString());
                    break;
                default:
                    break;
            }
        }
    }

    @SuppressWarnings("WeakerAccess")
    protected synchronized void buildGoogleApiClient(Context context) {
        googleApiClient = new GoogleApiClient.Builder(context)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void getCurrentLocation(Promise promise) {
        timeOutHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                rejectPromises(REJECT_CODE_LOCATION, "Location Timeout");
            }
        }, TIME_OUT_IN_MILLIS);
        promisesList.add(promise);
        googleApiClient.connect();
    }

    @Override
    public void onConnected(Bundle connectionHint) {
        if (promisesList == null || promisesList.isEmpty()) {
            return;
        }

        requestCurrentLocationCoordinates();
    }

    private LocationRequest createLocationRequest() {
        LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setPriority(LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY);
        locationRequest.setInterval(30_000);
        locationRequest.setFastestInterval(5_000);
        return locationRequest;
    }

    @SuppressWarnings({"MissingPermission", "WeakerAccess"})
    void requestCurrentLocationCoordinates() {
        Location lastLocation = LocationServices.FusedLocationApi.getLastLocation(googleApiClient);

        if (lastLocation != null) {
            resolvePromises(buildCurrentLocationInfo(lastLocation));
        } else {
            getLocationByLocationsManager();
        }
    }

    @SuppressWarnings("MissingPermission")
    private void getLocationByLocationsManager() {
        final LocationManager locationManager = getLocationManager(reactApplicationContext.getApplicationContext());

        LocationListener locationListener = new LocationListener() {
            public void onLocationChanged(Location location) {
                resolvePromises(buildCurrentLocationInfo(location));
                locationManager.removeUpdates(this);
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {
                // ignore
            }

            public void onProviderEnabled(String provider) {
                // ignore
            }

            public void onProviderDisabled(String provider) {
                rejectPromises(REJECT_CODE_LOCATION, REJECT_MESSAGE_LOCATION_NOT_DETECTED);
            }
        };

        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);
    }

    @SuppressWarnings("WeakerAccess")
    LocationManager getLocationManager(Context context) {
        return (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
    }

    @SuppressWarnings("WeakerAccess")
    WritableMap buildCurrentLocationInfo(Location lastLocation) {
        WritableMap data = Arguments.createMap();
        data.putDouble(LATITUDE, lastLocation.getLatitude());
        data.putDouble(LONGITUDE, lastLocation.getLongitude());
        return data;
    }

    @SuppressWarnings("WeakerAccess")
    void resolvePromises(WritableMap data) {
        timeOutHandler.removeCallbacksAndMessages(null);
        try {
            for (Promise promise : promisesList) {
                promise.resolve(data);
            }
            clearTempData();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    @SuppressWarnings("WeakerAccess")
    void rejectPromises(String code, String message) {
        timeOutHandler.removeCallbacksAndMessages(null);
        try {
            for (Promise promise : promisesList) {
                promise.reject(code, message);
            }
            clearTempData();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult result) {
        rejectPromises(REJECT_CODE_LOCATION, "Connection failed: ConnectionResult.getErrorCode() = "
                + result.getErrorCode());
        clearTempData();
    }

    private void clearTempData() {
        promisesList.clear();
        if (googleApiClient.isConnected()) {
            googleApiClient.disconnect();
        }
    }

    @Override
    public void onConnectionSuspended(int cause) {
        googleApiClient.connect();
    }

    @Override
    public void onResult(@NonNull LocationSettingsResult locationSettingsResult) {
        final Status status = locationSettingsResult.getStatus();
        switch (status.getStatusCode()) {
            case LocationSettingsStatusCodes.SUCCESS:
                requestCurrentLocationCoordinates();
                break;
            case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                try {
                    status.startResolutionForResult(getCurrentActivity(), REQUEST_CHECK_SETTINGS);
                } catch (IntentSender.SendIntentException exception) {
                    exception.printStackTrace();
                    rejectPromises(REJECT_CODE_LOCATION, exception.getMessage());
                }
                break;
            default:
                break;
        }
    }
}
