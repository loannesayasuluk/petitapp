package com.petit.app;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.splashscreen.SplashScreen;
import com.google.androidbrowserhelper.trusted.TwaLauncher;

public class MainActivity extends AppCompatActivity {
    
    private static final String TWA_URL = "https://your-petit-app.vercel.app";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 스플래시 스크린 설정
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        
        super.onCreate(savedInstanceState);
        
        // TWA 실행
        TwaLauncher twaLauncher = new TwaLauncher(this);
        twaLauncher.launch(
            getIntent().getData() != null ? getIntent().getData() : android.net.Uri.parse(TWA_URL),
            null,
            null,
            new TwaLauncher.LaunchCallback() {
                @Override
                public void onLaunchFinished() {
                    // TWA가 시작된 후 액티비티 종료
                    finish();
                }
            }
        );
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        
        // 앱이 다시 포커스를 받으면 TWA로 리다이렉트
        if (!isTaskRoot()) {
            finish();
        }
    }
}