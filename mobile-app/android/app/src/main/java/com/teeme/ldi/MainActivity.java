package com.teeme.ldi;

import android.content.Intent;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

}
