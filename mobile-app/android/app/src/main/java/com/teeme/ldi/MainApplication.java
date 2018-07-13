package com.teeme.ldi;

import android.content.Context;
import android.content.Intent;
import android.support.multidex.MultiDex;

import com.airbnb.android.react.maps.MapsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.crashlytics.android.Crashlytics;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.rjblopes.opensettings.OpenSettingsPackage;
import java.util.Arrays;
import java.util.List;
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;
import com.teeme.ldi.location.CurrentLocationReactPackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.fabric.sdk.android.Fabric;

public class MainApplication extends NavigationApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    // protected static CallbackManager getCallbackManager() { return mCallbackManager; }

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new ReactNativeLocalizationPackage(),
                new MapsPackage(),
                new FBSDKPackage(mCallbackManager),
                new RNGoogleSigninPackage(),
                new PickerPackage(),
                new ReactNativeExceptionHandlerPackage(),
                new RNBranchPackage(),
                new OpenSettingsPackage(),
                new CurrentLocationReactPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Fabric.with(this, new Crashlytics());
        Branch.getAutoInstance(this);
        setActivityCallbacks(new ActivityCallbacks() {

            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                mCallbackManager.onActivityResult(requestCode, resultCode, data);
            }
        });

        AppEventsLogger.activateApp(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }


}
