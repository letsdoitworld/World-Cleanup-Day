package com.teeme.ldi;

import com.reactnativenavigation.controllers.SplashActivity;
import io.branch.rnbranch.*; // <-- add this
import android.content.Intent; // <-- and this
public class MainActivity extends SplashActivity {

      protected String getMainComponentName() {
          return "base";
      }

      // Override onStart, onNewIntent:
      @Override
      protected void onStart() {
          super.onStart();
          RNBranchModule.initSession(getIntent().getData(), this);
      }

      @Override
      public void onNewIntent(Intent intent) {
          setIntent(intent);
      }

//    @Override
//    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
//    }
}
