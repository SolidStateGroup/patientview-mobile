package org.patientview.mobile;

import android.app.Activity;
import android.app.Application;
import android.util.Log;
import android.support.annotation.Nullable;
import java.util.Arrays;
import java.util.List;
import com.brentvatne.react.ReactVideoPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnative.photoview.PhotoViewPackage;

import com.facebook.react.ReactApplication;
import me.jhen.devsettings.DevSettingsPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.keychain.KeychainPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // <-- Add this line
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // <-- Add this line
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.clipsub.rnbottomsheet.RNBottomSheetPackage;
import com.wog.videoplayer.VideoPlayerPackage; // <-- add this import

import cl.json.RNSharePackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativenavigation.NavigationApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;


import java.lang.reflect.Method;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.ReadableNativeMap;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import com.smixx.fabric.FabricPackage;

import rnpbkdf2.PBKDF2Package;

public class MainApplication extends NavigationApplication {
    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Override
    public boolean clearHostOnActivityDestroy(Activity activity) {
        return false;
    }

    @Nullable
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
         return Arrays.<ReactPackage>asList(
             new DevSettingsPackage(),
             new ImageResizerPackage(),
             new ReanimatedPackage(),
             new RNGestureHandlerPackage(),
             new PBKDF2Package(),
             new KeychainPackage(),
             new FabricPackage(),
             new RNBottomSheetPackage(),
             new RNFirebasePackage(),
             new RNFirebaseAnalyticsPackage(), // <-- Add this line
             new RNFirebaseMessagingPackage(),
             new RNFirebaseNotificationsPackage(),
             new SvgPackage(),
             new LinearGradientPackage(),
             new LottiePackage(),
             new MPAndroidChartPackage(),
             new RNDeviceInfo(),
             new RNFetchBlobPackage(),
             new RNFSPackage(),
             new RNSharePackage(),
             new VectorIconsPackage(),
             new PickerPackage(),
             new ReactVideoPackage(),
             new PhotoViewPackage(), // add this manager
             new VideoPlayerPackage() // <-- add this line
         );
    }

     @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        // call for react native >= 0.54.0
        // ReadableNativeArray.setUseNativeAccessor(true);
        // ReadableNativeMap.setUseNativeAccessor(true);
        try {
            Method arrayUseNativeAccessor = ReadableNativeArray.class.getDeclaredMethod("setUseNativeAccessor", boolean.class);
            if (arrayUseNativeAccessor != null) {
                arrayUseNativeAccessor.invoke(null, true);
            }

            Method mapUseNativeAccessor = ReadableNativeMap.class.getDeclaredMethod("setUseNativeAccessor", boolean.class);
            if (mapUseNativeAccessor != null) {
                mapUseNativeAccessor.invoke(null, true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


       Fabric.with(this, new Crashlytics());
      }
}


