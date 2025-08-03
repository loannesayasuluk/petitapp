# 쁘띠 앱 배포 가이드

## 🚀 GitHub & Vercel 배포 단계별 가이드

### 1. GitHub 저장소 푸시

```bash
# Git 초기화 (처음 한 번만)
git init

# 모든 파일 추가
git add .

# 첫 번째 커밋
git commit -m "Initial commit - Petit app ready for deployment"

# 원격 저장소 연결
git remote add origin https://github.com/loannesayasuluk/petitapp.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

### 2. Vercel 배포 설정

#### 방법 1: 자동 배포 (추천)
1. [Vercel](https://vercel.com)에 로그인
2. "Import Project" 클릭
3. GitHub 저장소 `loannesayasuluk/petitapp` 선택
4. Framework: **Vite** 자동 감지됨
5. Environment Variables 설정:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyABxP-1BNS1koh3U0XQBnkxcnBUD0YNKk4
   VITE_FIREBASE_AUTH_DOMAIN=petit-app-16877.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=petit-app-16877
   VITE_FIREBASE_STORAGE_BUCKET=petit-app-16877.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=482477402300
   VITE_FIREBASE_APP_ID=1:482477402300:web:0ca4cf3bfe5019a8aa88b9
   VITE_FIREBASE_MEASUREMENT_ID=G-1KR3718KEQ
   NODE_ENV=production
   ```
6. "Deploy" 클릭

#### 방법 2: Vercel CLI 사용
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

### 3. GitHub Actions 자동 배포 설정 (선택사항)

GitHub Secrets에 다음 값들을 추가:
- `VERCEL_TOKEN`: Vercel 개인 액세스 토큰
- `ORG_ID`: Vercel 조직 ID
- `PROJECT_ID`: Vercel 프로젝트 ID

### 4. 배포 확인 사항

✅ **배포 전 체크리스트:**
- [ ] 모든 환경변수가 올바르게 설정됨
- [ ] Firebase 프로젝트가 활성화됨
- [ ] 빌드 오류가 없음 (`npm run build` 테스트)
- [ ] 모든 파일이 Git에 커밋됨

✅ **배포 후 확인사항:**
- [ ] 앱이 정상적으로 로드됨
- [ ] Firebase 연결 확인
- [ ] Google 로그인 작동 확인
- [ ] 게시글 작성/조회 기능 확인

### 5. 도메인 설정 (선택사항)

Vercel 대시보드에서 커스텀 도메인 연결 가능:
1. Project Settings → Domains
2. 원하는 도메인 입력
3. DNS 설정 완료

### 6. 성능 최적화

현재 설정된 최적화:
- **Code Splitting**: vendor, firebase 청크 분리
- **Image Optimization**: Vercel 자동 이미지 최적화
- **Caching**: 정적 자산 캐싱
- **Compression**: Gzip/Brotli 압축

### 7. 모니터링 및 분석

- **Vercel Analytics**: 자동 활성화
- **Firebase Analytics**: 코드에 이미 구현됨
- **Console Logs**: Vercel Function Logs에서 확인 가능

### 8. 업데이트 배포

```bash
# 코드 수정 후
git add .
git commit -m "Update: [설명]"
git push origin main

# Vercel이 자동으로 재배포함
```

### 9. 트러블슈팅

**빌드 실패 시:**
```bash
# 로컬에서 빌드 테스트
npm run build
npm run preview
```

**환경변수 문제 시:**
- Vercel 대시보드에서 Environment Variables 재확인
- 변수명이 `VITE_` 접두사로 시작하는지 확인

**Firebase 연결 문제 시:**
- Firebase Console에서 도메인이 허용 목록에 있는지 확인
- API 키 권한 확인

### 10. 지원 및 문의

- **Vercel 문서**: https://vercel.com/docs
- **Firebase 문서**: https://firebase.google.com/docs
- **이슈 리포트**: GitHub Issues 탭 활용

---

🎉 **축하합니다!** 쁘띠 앱이 성공적으로 배포되었습니다!

배포된 앱 URL: `https://petitapp.vercel.app`