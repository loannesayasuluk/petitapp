#!/bin/bash

# Petit 앱 Android 빌드 스크립트
# PWA Builder를 사용한 TWA 생성

echo "🐾 Petit Android 앱 빌드 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 필수 도구 확인
check_dependencies() {
    echo -e "${BLUE}📋 필수 도구 확인 중...${NC}"
    
    # Node.js 확인
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js가 설치되지 않았습니다.${NC}"
        echo "https://nodejs.org 에서 설치해주세요."
        exit 1
    fi
    
    # npm 확인
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm이 설치되지 않았습니다.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 모든 필수 도구가 설치되어 있습니다.${NC}"
}

# PWA Builder CLI 설치
install_pwabuilder() {
    echo -e "${BLUE}📦 PWA Builder CLI 설치 중...${NC}"
    
    if ! command -v pwabuilder &> /dev/null; then
        npm install -g @pwabuilder/cli
        echo -e "${GREEN}✅ PWA Builder CLI 설치 완료${NC}"
    else
        echo -e "${YELLOW}💡 PWA Builder CLI가 이미 설치되어 있습니다.${NC}"
    fi
}

# 앱 URL 설정
setup_app_url() {
    echo -e "${BLUE}🌐 앱 URL 설정${NC}"
    
    # 기본 URL (사용자가 수정 가능)
    DEFAULT_URL="https://your-petit-app.vercel.app"
    
    echo "현재 Petit 앱의 URL을 입력해주세요:"
    echo "예: https://petit-app.vercel.app"
    read -p "URL: " APP_URL
    
    if [ -z "$APP_URL" ]; then
        APP_URL=$DEFAULT_URL
        echo -e "${YELLOW}⚠️  기본 URL을 사용합니다: ${APP_URL}${NC}"
    fi
    
    echo -e "${GREEN}✅ 앱 URL 설정 완료: ${APP_URL}${NC}"
}

# TWA 설정 생성
create_twa_config() {
    echo -e "${BLUE}⚙️  TWA 설정 파일 생성 중...${NC}"
    
    # twa-manifest.json 생성
    cat > twa-manifest.json << EOF
{
  "packageId": "com.petit.app",
  "host": "${APP_URL}",
  "name": "Petit",
  "launcherName": "Petit",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#E5B876",
  "background_color": "#FAF8F1",
  "start_url": "/",
  "iconUrl": "${APP_URL}/icons/icon-512x512.png",
  "maskableIconUrl": "${APP_URL}/icons/icon-512x512.png",
  "monochrome_iconUrl": "${APP_URL}/icons/icon-192x192.png",
  "shortcuts": [
    {
      "name": "글쓰기",
      "short_name": "글쓰기",
      "url": "/?action=write",
      "icons": [
        {
          "src": "/icons/write-shortcut.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "커뮤니티",
      "short_name": "커뮤니티",
      "url": "/?tab=community",
      "icons": [
        {
          "src": "/icons/community-shortcut.png",
          "sizes": "96x96"
        }
      ]
    }
  ],
  "appVersion": "1.0.0",
  "appVersionCode": 1,
  "enableNotifications": true,
  "navigationColor": "#FAF8F1",
  "navigationColorDark": "#2A2520",
  "navigationDividerColor": "#E5B876",
  "navigationDividerColorDark": "#E5B876",
  "signingKey": {
    "path": "./android.keystore",
    "alias": "petit-key"
  },
  "generationTool": "PWABuilder"
}
EOF
    
    echo -e "${GREEN}✅ TWA 설정 파일 생성 완료${NC}"
}

# 키스토어 생성
create_keystore() {
    echo -e "${BLUE}🔐 키스토어 생성 중...${NC}"
    
    if [ ! -f "android.keystore" ]; then
        echo "키스토어 생성을 위한 정보를 입력해주세요:"
        read -p "조직 이름 (예: Petit Team): " ORG_NAME
        read -p "조직 단위 (예: Development): " ORG_UNIT
        read -p "도시 (예: Seoul): " CITY
        read -p "국가 코드 (예: KR): " COUNTRY
        
        # 기본값 설정
        ORG_NAME=${ORG_NAME:-"Petit Team"}
        ORG_UNIT=${ORG_UNIT:-"Development"}
        CITY=${CITY:-"Seoul"}
        COUNTRY=${COUNTRY:-"KR"}
        
        keytool -genkey -v -keystore android.keystore -alias petit-key -keyalg RSA -keysize 2048 -validity 10000 \
            -dname "CN=Petit, OU=${ORG_UNIT}, O=${ORG_NAME}, L=${CITY}, C=${COUNTRY}" \
            -storepass petit123 -keypass petit123
            
        echo -e "${GREEN}✅ 키스토어 생성 완료${NC}"
        echo -e "${YELLOW}⚠️  키스토어 파일(android.keystore)을 안전하게 보관하세요!${NC}"
    else
        echo -e "${YELLOW}💡 기존 키스토어를 사용합니다.${NC}"
    fi
}

# TWA 프로젝트 생성
build_twa() {
    echo -e "${BLUE}🏗️  TWA 프로젝트 빌드 중...${NC}"
    
    # 출력 디렉토리 생성
    mkdir -p android-build
    cd android-build
    
    # Bubblewrap 사용 (더 안정적)
    if command -v bubblewrap &> /dev/null; then
        echo -e "${BLUE}🫧 Bubblewrap을 사용하여 빌드합니다...${NC}"
        
        # Manifest에서 초기화
        bubblewrap init --manifest "${APP_URL}/manifest.json"
        
        # 빌드
        bubblewrap build --mode=release
        
    else
        echo -e "${BLUE}📱 PWA Builder를 사용하여 빌드합니다...${NC}"
        
        # PWA Builder로 빌드
        pwabuilder "${APP_URL}" --platform android --publish false
    fi
    
    cd ..
    echo -e "${GREEN}✅ TWA 프로젝트 빌드 완료${NC}"
}

# Capacitor 설정 (고급 사용자용)
setup_capacitor() {
    echo -e "${BLUE}⚡ Capacitor 설정 (선택사항)${NC}"
    
    read -p "Capacitor로 고급 네이티브 기능을 추가하시겠습니까? (y/N): " USE_CAPACITOR
    
    if [[ $USE_CAPACITOR =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}📦 Capacitor 설치 중...${NC}"
        
        # Capacitor 설치
        npm install @capacitor/core @capacitor/cli @capacitor/android
        
        # Capacitor 초기화
        npx cap init "Petit" "com.petit.app" --web-dir=dist
        
        # Android 플랫폼 추가
        npx cap add android
        
        # 설정 파일 생성
        cat > capacitor.config.ts << EOF
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.petit.app',
  appName: 'Petit',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FAF8F1",
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
EOF
        
        # 앱 빌드 및 동기화
        npm run build
        npx cap sync
        
        echo -e "${GREEN}✅ Capacitor 설정 완료${NC}"
        echo -e "${YELLOW}💡 Android Studio에서 프로젝트를 열려면: npx cap open android${NC}"
        
    else
        echo -e "${YELLOW}📱 TWA만 사용합니다.${NC}"
    fi
}

# 결과 요약
show_results() {
    echo ""
    echo -e "${GREEN}🎉 Petit Android 앱 빌드 완료!${NC}"
    echo ""
    echo -e "${BLUE}📁 생성된 파일들:${NC}"
    echo "  - twa-manifest.json (TWA 설정)"
    echo "  - android.keystore (키스토어 파일)"
    echo "  - android-build/ (빌드 결과)"
    echo ""
    echo -e "${BLUE}📱 다음 단계:${NC}"
    echo "  1. android-build/ 폴더에서 AAB 파일 확인"
    echo "  2. Google Play Console에 AAB 파일 업로드"
    echo "  3. 앱 스토어 정보 입력"
    echo "  4. 검토 제출"
    echo ""
    echo -e "${YELLOW}⚠️  중요:${NC}"
    echo "  - android.keystore 파일을 안전하게 보관하세요"
    echo "  - 앱 업데이트 시 같은 키스토어를 사용해야 합니다"
    echo ""
    echo -e "${BLUE}🔗 유용한 링크:${NC}"
    echo "  - Google Play Console: https://play.google.com/console"
    echo "  - PWA Builder: https://www.pwabuilder.com"
    echo "  - Android 개발자 가이드: https://developer.android.com"
}

# 메인 실행
main() {
    echo -e "${GREEN}🐾 Petit Android 앱 빌드 도구${NC}"
    echo -e "${BLUE}반려동물 커뮤니티 앱을 구글 플레이 스토어용으로 빌드합니다.${NC}"
    echo ""
    
    check_dependencies
    install_pwabuilder
    setup_app_url
    create_twa_config
    create_keystore
    build_twa
    setup_capacitor
    show_results
    
    echo -e "${GREEN}✨ 빌드 프로세스가 완료되었습니다!${NC}"
}

# 스크립트 실행
main "$@"