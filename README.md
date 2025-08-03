# 쁘띠 (Petit) - 반려동물 커뮤니티 앱

한국의 반려동물 소유자들을 위한 종합 커뮤니티 플랫폼입니다. 모든 종류의 반려동물과 예비 반려인을 위한 정보 공유 및 소셜 네트워킹을 제공합니다.

## 🎨 디자인 컨셉
- **Natural Luxury** 컨셉
- **메인 액센트 컬러**: Golden Ochre (#E5B876)
- **폰트**: Pretendard (전체 앱 적용)
- **컬러 시스템**: 밝고, 친근하며, 따뜻하고 신뢰감 있는 웜-뉴트럴 컬러

## 🚀 주요 기능

### 📱 핵심 기능
- **소셜 로그인**: Google, Naver 지원
- **개인화된 홈 피드**: 맞춤형 콘텐츠 제공
- **커뮤니티**: 필터링 및 게시글 작성 기능
- **사용자 프로필**: 개별 반려동물 프로필 포함
- **유연한 CMS**: 관리자용 콘텐츠 관리 시스템

### 🗂️ 카테고리별 페이지
- **궁금해요 QA**: 질문과 답변 커뮤니티
- **일상 자랑**: 반려동물 일상 공유
- **지식 위키**: 반려동물 정보 데이터베이스
- **제품 후기**: 제품 리뷰 및 평가
- **전문가 콘텐츠**: 수의사 및 전문가 정보
- **펫 플레이스**: 반려동물 친화적 장소 정보

### 🔧 기술적 특징
- **Tab 메뉴**: 5개 콘텐츠 탐색 탭
- **아이콘 메뉴**: 8개 핵심 앱 기능
- **인증 제어**: 알림/북마크 버튼 접근 권한 관리
- **Firebase 백엔드**: 실시간 데이터베이스 및 인증

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS
- **Backend**: Firebase (Firestore, Authentication)
- **Icons**: Lucide React
- **UI Components**: Radix UI
- **Font**: Pretendard

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🚀 배포

### Vercel 배포
1. Vercel에 GitHub 저장소 연결
2. 환경변수 설정 (Firebase 설정)
3. 자동 배포 실행

### 환경변수 설정
Firebase 설정을 위한 환경변수를 Vercel 대시보드에서 설정해주세요:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 프로젝트 구조

```
├── components/              # React 컴포넌트
│   ├── ui/                 # UI 컴포넌트
│   └── ...                 # 페이지별 컴포넌트
├── contexts/               # React Context
├── lib/                    # 유틸리티 및 설정
├── styles/                 # 스타일 파일
├── .github/workflows/      # GitHub Actions
├── App.tsx                 # 메인 앱 컴포넌트
├── main.tsx               # 앱 진입점
└── index.html             # HTML 템플릿
```

## 🔧 개발 가이드

### 컴포넌트 생성 규칙
- 모든 컴포넌트는 TypeScript로 작성
- Pretendard 폰트 사용
- Golden Ochre (#E5B876) 액센트 컬러 활용
- 반응형 디자인 적용

### 스타일링 가이드라인
- TailwindCSS 클래스 사용
- 커스텀 컬러 시스템 활용
- 모바일 우선 반응형 디자인

## 📱 주요 페이지

- **홈**: 개인화된 피드 및 핵심 기능 접근
- **커뮤니티**: 카테고리별 게시글 탐색
- **프로필**: 사용자 및 반려동물 정보
- **채팅**: 1:1 및 그룹 채팅 (개발 예정)
- **검색**: 통합 검색 기능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 연락처

프로젝트 관련 문의: [GitHub Repository](https://github.com/loannesayasuluk/petitapp)

---
Made with ❤️ for pet lovers in South Korea