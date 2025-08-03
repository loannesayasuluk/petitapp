# 🏪 구글 플레이 스토어 배포 가이드

Petit PWA를 구글 플레이 스토어에 등록하는 방법들을 정리했습니다.

## 📋 준비사항

### 1. 구글 플레이 콘솔 계정
- [Google Play Console](https://play.google.com/console) 계정 생성
- 등록비 $25 (일회성) 결제
- 개발자 계정 인증 완료

### 2. 필수 파일들
- ✅ App Bundle (.aab) 또는 APK 파일
- ✅ 앱 아이콘 (다양한 크기)
- ✅ 스크린샷 (폰, 태블릿용)
- ✅ 앱 설명 및 메타데이터

## 🛠️ 방법 1: TWA (Trusted Web Activity) - **추천**

### 장점
- ✅ 가장 간단하고 빠름
- ✅ PWA를 그대로 활용
- ✅ 자동 업데이트 지원
- ✅ Google 공식 지원

### 단점
- ❌ 일부 네이티브 기능 제한
- ❌ 웹뷰 기반

### 설치 및 설정

```bash
# 1. PWA Builder CLI 설치
npm install -g @pwabuilder/cli

# 2. 프로젝트에서 실행
cd your-petit-project
pwabuilder https://your-petit-app.vercel.app

# 3. Android 옵션 선택
# 4. TWA 선택
# 5. 설정 완료 후 APK/AAB 생성
```

### PWA Builder 웹 인터페이스 사용
1. [PWABuilder.com](https://www.pwabuilder.com/) 방문
2. Petit 앱 URL 입력: `https://your-app.vercel.app`
3. "Start" 클릭
4. "Android" 탭 선택
5. "TWA" 옵션 선택
6. 설정 구성:
   ```json
   {
     "name": "Petit",
     "shortName": "Petit",
     "startUrl": "/",
     "display": "standalone",
     "themeColor": "#E5B876",
     "backgroundColor": "#FAF8F1"
   }
   ```
7. "Generate Package" 클릭
8. AAB 파일 다운로드

## 🛠️ 방법 2: Capacitor - 고급 기능 필요시

### 장점
- ✅ 완전한 네이티브 기능 접근
- ✅ 플러그인 생태계
- ✅ 커스터마이징 가능

### 단점
- ❌ 복잡한 설정
- ❌ 개발 환경 필요

### 설치 및 설정

```bash
# 1. Capacitor 설치
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# 2. Capacitor 초기화
npx cap init "Petit" "com.petit.app" --web-dir=dist

# 3. Android 플랫폼 추가
npx cap add android

# 4. 앱 빌드
npm run build
npx cap sync

# 5. Android Studio에서 열기
npx cap open android

# 6. Android Studio에서 APK/AAB 생성
```

### Capacitor 설정 파일 수정

```typescript
// capacitor.config.ts
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
    }
  }
};

export default config;
```

## 🛠️ 방법 3: Bubblewrap (Google 공식)

### 설치 및 사용

```bash
# 1. Bubblewrap 설치
npm i -g @bubblewrap/cli

# 2. 프로젝트 초기화
bubblewrap init --manifest https://your-app.vercel.app/manifest.json

# 3. 키스토어 생성 (처음만)
bubblewrap fingerprint

# 4. APK 빌드
bubblewrap build

# 5. AAB 빌드 (플레이 스토어용)
bubblewrap build --mode=release
```

## 📱 필수 준비물

### 1. 앱 아이콘 생성
다음 크기의 PNG 파일이 필요합니다:

```
📁 play-store-assets/
├── 📁 icons/
│   ├── icon-48x48.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-144x144.png
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── feature-graphic-1024x500.png
```

### 2. 스크린샷 촬영
- **폰용**: 최소 2개, 최대 8개 (1080x1920 권장)
- **태블릿용**: 최소 1개 (2048x1536 권장)
- **크기**: 16:9 또는 9:16 비율

### 3. 앱 스토어 리스팅 정보

```markdown
# 앱 제목 (최대 50자)
Petit - 반려동물 커뮤니티

# 짧은 설명 (최대 80자)
모든 반려동물과 예비 반려인을 위한 따뜻한 커뮤니티

# 전체 설명 (최대 4000자)
🐾 Petit(쁘띠)은 모든 종류의 반려동물 소유자와 예비 소유자들을 위한 
정보 공유 및 소셜 네트워킹 플랫폼입니다.

주요 기능:
✨ 카테고리별 커뮤니티 (일상자랑, 궁금해요, 지식위키 등)
📝 게시물 작성 및 댓글
💝 좋아요 및 북마크
🎉 포토 콘테스트 및 그룹 챌린지
🔍 반려동물 용품 리뷰
📍 펫플레이스 정보 공유

Natural Luxury 디자인으로 따뜻하고 신뢰할 수 있는 
반려동물 커뮤니티를 경험해보세요!
```

## 🚀 배포 단계별 가이드

### 1단계: 앱 패키지 생성
```bash
# PWA Builder 사용 (추천)
pwabuilder https://your-app.vercel.app --platform android
```

### 2단계: 구글 플레이 콘솔 설정
1. [Google Play Console](https://play.google.com/console) 로그인
2. "앱 만들기" 클릭
3. 앱 정보 입력:
   - 앱 이름: **Petit**
   - 기본 언어: **한국어**
   - 앱 또는 게임: **앱**
   - 무료 또는 유료: **무료**

### 3단계: 앱 콘텐츠 등급
1. "앱 콘텐츠" 메뉴
2. "콘텐츠 등급" 설정
3. 설문조사 완료 (소셜/커뮤니티 앱으로 분류)

### 4단계: 대상 고객 및 콘텐츠
1. "대상 고객" 설정 (13세 이상)
2. "앱 액세스 권한" 설정
3. "광고" 설정 (광고 포함 여부)
4. "콘텐츠 정책" 확인

### 5단계: 앱 업로드
1. "릴리스" → "프로덕션"
2. "새 릴리스 만들기"
3. AAB 파일 업로드
4. 릴리스 노트 작성:
   ```
   🎉 Petit 첫 번째 릴리스!
   
   ✨ 새로운 기능:
   - 반려동물 커뮤니티 기능
   - 카테고리별 게시판
   - 포토 콘테스트 및 챌린지
   - 사용자 프로필 및 로그인
   
   🐾 모든 반려동물과 함께하는 따뜻한 커뮤니티를 만나보세요!
   ```

### 6단계: 스토어 등록정보
1. "앱 세부정보" 입력
2. 그래픽 에셋 업로드
3. 스크린샷 업로드
4. 연락처 정보 입력

### 7단계: 검토 제출
1. 모든 필수 항목 완료 확인
2. "검토용으로 릴리스 보내기" 클릭
3. Google 검토 대기 (보통 1-3일)

## ⚠️ 주의사항

### 앱 서명
- **Play App Signing** 사용 권장
- Google이 키 관리를 담당
- 더 안전하고 편리함

### 권한 설정
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### 네트워크 보안 설정
```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">your-app.vercel.app</domain>
    </domain-config>
</network-security-config>
```

## 🔍 테스트

### 내부 테스트
1. "내부 테스트" 트랙 생성
2. 테스터 이메일 추가
3. AAB 업로드 및 테스트

### 사전 등록 (선택사항)
1. 앱 출시 전 사전 등록 활성화
2. 마케팅 효과 극대화

## 💡 팁

1. **첫 업로드는 PWA Builder 사용**이 가장 간단
2. **AAB 형식**이 APK보다 권장됨
3. **앱 번들 크기** 최적화 필요 (150MB 이하)
4. **개인정보 처리방침** 필수 (웹사이트에 게시)
5. **연령 등급** 정확히 설정

## 🆘 문제 해결

### 자주 발생하는 오류
1. **Missing MainActivity**: Capacitor 설정 확인
2. **Invalid APK**: 서명 확인
3. **Policy Violation**: 콘텐츠 정책 재검토
4. **Permission Issues**: 필요한 권한만 요청

### 지원 연락처
- Google Play Developer Support
- PWA Builder GitHub Issues
- Capacitor Community Forums

---

**🎯 권장 순서:**
1. PWA Builder로 첫 번째 앱 생성
2. 플레이 스토어 등록 및 검토 통과
3. 필요시 Capacitor로 고도화

이 가이드를 따라하면 Petit 앱을 성공적으로 구글 플레이 스토어에 등록할 수 있습니다! 🚀