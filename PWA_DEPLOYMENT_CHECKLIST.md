# 🚀 PWA 배포 체크리스트

## ✅ 1. PWA 필수 요소 점검

### 📱 Manifest.json
- [x] `/public/manifest.json` 존재 ✅
- [x] 앱 이름 및 설명 설정 ✅
- [x] 아이콘 경로 설정 ✅
- [x] 시작 URL 설정 ✅
- [x] 디스플레이 모드 설정 ✅
- [x] 테마 컬러 설정 ✅

### 🛠️ Service Worker
- [x] `/public/sw.js` 존재 ✅
- [x] 캐싱 로직 구현 ✅
- [x] 오프라인 지원 ✅
- [x] 자동 업데이트 감지 ✅

### 🔗 HTML 메타태그
- [x] Manifest 링크 추가 ✅
- [x] 모바일 웹앱 설정 ✅
- [x] 아이콘 링크 추가 ✅

## 🎨 2. 아이콘 생성

### 필요한 아이콘 크기
- [ ] icon-72x72.png
- [ ] icon-96x96.png
- [ ] icon-128x128.png
- [ ] icon-144x144.png
- [ ] icon-152x152.png
- [ ] icon-192x192.png
- [ ] icon-384x384.png
- [ ] icon-512x512.png

### 추가 아이콘
- [ ] write-shortcut.png (96x96)
- [ ] community-shortcut.png (96x96)

### 아이콘 생성 방법
1. `/public/icons/icon-generator.html` 열기
2. "모든 아이콘 생성" 클릭
3. 각 아이콘 다운로드
4. `/public/icons/` 폴더에 저장

## 🧪 3. PWA 테스트

### 로컬 테스트
```bash
# 프로덕션 빌드
npm run build

# 로컬 서버 실행 (HTTPS 필요)
npx serve -s dist -l 3000

# 또는 Python 서버
python -m http.server 3000
```

### 브라우저 테스트
1. **Chrome DevTools**
   - F12 → Application → Manifest
   - Service Workers 탭 확인
   - Lighthouse PWA 점수 확인

2. **PWA 설치 테스트**
   - 주소창의 "설치" 버튼 확인
   - 설치 후 독립실행 확인

3. **오프라인 테스트**
   - 네트워크 끊고 앱 실행
   - 기본 기능 동작 확인

## 🌐 4. 배포 준비

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 도메인 연결
- 커스텀 도메인 설정 (선택사항)
- HTTPS 인증서 자동 적용

### 배포 후 확인사항
- [ ] PWA 설치 프롬프트 표시
- [ ] 홈 화면 아이콘 정상 표시
- [ ] 오프라인 기능 정상 동작
- [ ] 푸시 알림 권한 요청 (향후)

## 📱 5. 모바일 테스트

### Android (Chrome)
1. 앱 URL 접속
2. 메뉴 → "홈 화면에 추가"
3. 독립실행 앱으로 설치 확인

### iOS (Safari)
1. 앱 URL 접속
2. 공유 → "홈 화면에 추가"
3. 독립실행 앱으로 설치 확인

## 🏪 6. 앱 스토어 배포 (선택사항)

### PWA Builder 사용
1. [PWABuilder.com](https://www.pwabuilder.com/) 방문
2. 앱 URL 입력
3. Android/iOS 패키지 생성
4. 각 스토어에 제출

### 준비 사항
- [ ] 앱 아이콘 (다양한 크기)
- [ ] 스크린샷 (폰/태블릿)
- [ ] 앱 설명 및 키워드
- [ ] 개인정보 처리방침
- [ ] 개발자 계정 ($25 Google Play)

## 🔧 7. 성능 최적화

### Lighthouse 점수 목표
- Performance: 90+ 점
- Accessibility: 90+ 점
- Best Practices: 90+ 점
- SEO: 90+ 점
- PWA: 90+ 점

### 최적화 방법
- [ ] 이미지 최적화 (WebP 사용)
- [ ] 코드 스플리팅
- [ ] 캐싱 전략 개선
- [ ] 번들 크기 최소화

## 🚨 8. 문제 해결

### 일반적인 문제
1. **PWA 설치 버튼이 나타나지 않음**
   - HTTPS 연결 확인
   - Manifest.json 유효성 확인
   - Service Worker 등록 확인

2. **오프라인에서 작동하지 않음**
   - Service Worker 캐싱 로직 확인
   - 네트워크 첫 전략 vs 캐시 첫 전략

3. **아이콘이 표시되지 않음**
   - 아이콘 파일 경로 확인
   - 아이콘 크기 및 형식 확인

### 디버깅 도구
- Chrome DevTools → Application
- Lighthouse PWA 감사
- PWA Builder 검증 도구

## 📊 9. 배포 후 모니터링

### 분석 도구
- Google Analytics (웹앱 추적)
- Firebase Analytics (모바일 앱 추적)
- Vercel Analytics (성능 모니터링)

### 주요 지표
- 설치율 (Installation Rate)
- 재방문율 (Return Visit Rate)
- 오프라인 사용률
- 페이지 로드 시간

## 🎯 10. 다음 단계

### 고급 PWA 기능
- [ ] 푸시 알림 구현
- [ ] 백그라운드 동기화
- [ ] 웹 공유 API
- [ ] 파일 시스템 액세스

### 네이티브 기능 추가
- [ ] 카메라 접근
- [ ] 위치 정보 사용
- [ ] 연락처 접근
- [ ] 생체 인증

---

**🎉 축하합니다!** 
이 체크리스트를 모두 완료하면 Petit 앱이 완전한 PWA로 배포됩니다!

**빠른 시작:**
1. 아이콘 생성 (`/public/icons/icon-generator.html`)
2. 로컬 테스트 (`npm run build && npx serve -s dist`)
3. Vercel 배포 (`vercel --prod`)
4. 모바일에서 "홈 화면에 추가" 테스트

**문제가 있으면 이 파일을 참고해서 단계별로 해결하세요!** 🚀