# 🚀 Petit PWA 빠른 시작 가이드

## 📋 3단계로 PWA 배포하기

### 1단계: 아이콘 생성 🎨
```bash
# 아이콘 생성기 열기
open public/icons/icon-generator.html
# 또는 브라우저에서 직접 열기
```
1. "모든 아이콘 생성" 클릭
2. 각 아이콘 파일 다운로드
3. `/public/icons/` 폴더에 저장

### 2단계: 로컬 PWA 테스트 🧪
```bash
# PWA 테스트 서버 실행
npm run pwa:build

# 또는 단계별로
npm run build
npm run pwa:test
```
- Chrome에서 `https://localhost:3000` 접속
- "고급" → "localhost로 이동" (인증서 경고 무시)
- F12 → Application → Manifest 확인
- 주소창 "설치" 버튼 확인

### 3단계: Vercel 배포 🌐
```bash
# Vercel CLI 설치 (한번만)
npm install -g vercel

# 배포
npm run deploy:vercel
```
- Vercel 계정 로그인
- 프로젝트 설정 확인
- 배포 완료 URL 확인

## ✅ 배포 체크리스트

### 필수 파일 확인
- [x] `/public/manifest.json` ✅
- [x] `/public/sw.js` ✅  
- [x] `/index.html` (PWA 메타태그) ✅
- [ ] `/public/icons/icon-*.png` (8개 파일)

### PWA 기능 테스트
- [ ] Chrome "설치" 버튼 표시
- [ ] 홈 화면 아이콘 정상 표시  
- [ ] 독립실행 앱으로 실행
- [ ] 오프라인에서 기본 페이지 로드
- [ ] 자동 업데이트 알림

### 모바일 테스트
- [ ] Android: "홈 화면에 추가"
- [ ] iOS: "홈 화면에 추가"
- [ ] 스플래시 화면 표시
- [ ] 상태바 컬러 적용

## 🛠️ 유용한 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# PWA 테스트
npm run pwa:test

# 아이콘 안내
npm run pwa:icons

# 전체 PWA 빌드 & 테스트
npm run pwa:build

# Vercel 배포
npm run deploy:vercel

# 빌드 정리
npm run clean
```

## 🔍 PWA 검증 도구

### Chrome DevTools
1. F12 → Application 탭
2. Manifest 섹션 확인
3. Service Workers 상태 확인
4. Storage 사용량 확인

### Lighthouse 점수
1. F12 → Lighthouse 탭
2. PWA 카테고리 선택
3. 90점 이상 목표
4. 개선 사항 확인

### 온라인 도구
- [PWA Builder](https://www.pwabuilder.com/) - PWA 검증 및 패키지 생성
- [Manifest Generator](https://app-manifest.firebaseapp.com/) - Manifest 생성 도구
- [PWA Test](https://pwatest.com/) - PWA 기능 테스트

## ❓ 자주 묻는 질문

### Q: PWA 설치 버튼이 안 보여요
A: HTTPS 연결과 올바른 Manifest, Service Worker가 필요합니다.
```bash
# 로컬 HTTPS 테스트
npm run pwa:test
```

### Q: 아이콘이 깨져 보여요
A: 아이콘 크기와 형식을 확인하세요.
```bash
# 아이콘 재생성
npm run pwa:icons
```

### Q: 오프라인에서 작동하지 않아요
A: Service Worker 등록과 캐싱 전략을 확인하세요.

### Q: 모바일에서 설치가 안 돼요
A: 
- **Android**: Chrome 메뉴 → "홈 화면에 추가"
- **iOS**: Safari 공유 버튼 → "홈 화면에 추가"

## 🏪 앱 스토어 배포 (고급)

### PWA Builder로 네이티브 앱 생성
1. [PWABuilder.com](https://www.pwabuilder.com/) 방문
2. 배포된 PWA URL 입력
3. Android/iOS 패키지 다운로드
4. 각 앱 스토어에 제출

### 필요한 준비물
- 앱 스토어 개발자 계정
- 앱 아이콘 (다양한 크기)
- 스크린샷 (폰/태블릿)
- 앱 설명 및 키워드

---

## 🎉 완료!

이제 Petit이 완전한 PWA로 실행됩니다!

**테스트 순서:**
1. `npm run pwa:icons` - 아이콘 생성
2. `npm run pwa:build` - 빌드 & 테스트
3. `npm run deploy:vercel` - 배포
4. 모바일에서 "홈 화면에 추가" 테스트

**문제가 있으면 `PWA_DEPLOYMENT_CHECKLIST.md` 파일을 참고하세요!** 🚀