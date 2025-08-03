# PWA 아이콘 가이드

이 폴더에는 PWA(Progressive Web App)를 위한 다양한 크기의 아이콘들이 필요합니다.

## 필요한 아이콘 크기들

### Android/일반 PWA 아이콘
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### iOS 아이콘 (Apple Touch Icon)
- icon-57x57.png
- icon-60x60.png
- icon-76x76.png
- icon-114x114.png
- icon-120x120.png
- icon-180x180.png

### Windows 타일 아이콘
- icon-70x70.png
- icon-150x150.png
- icon-310x150.png (와이드 타일)
- icon-310x310.png

### 추가 아이콘
- write-shortcut.png (96x96) - 글쓰기 바로가기
- community-shortcut.png (96x96) - 커뮤니티 바로가기

## 아이콘 디자인 가이드라인

### 컬러 시스템
- 주 색상: #E5B876 (Golden Ochre)
- 배경색: #FAF8F1 (Cream White)
- 텍스트: #212529 (Charcoal Black)

### 디자인 원칙
1. **단순하고 명확한 디자인**: 작은 크기에서도 잘 보이도록
2. **브랜드 일관성**: Petit의 Natural Luxury 컨셉 유지
3. **가독성**: 다양한 배경에서도 잘 보이도록
4. **확장성**: 다양한 크기에서 품질 유지

### 아이콘 요소
- Petit 로고 또는 브랜드명
- 반려동물 관련 심볼 (발바닥, 하트 등)
- 둥근 모서리 (iOS 가이드라인 준수)

## 생성 방법

1. **디자인 툴**: Figma, Sketch, Adobe Illustrator 등 사용
2. **벡터 기반**: SVG로 먼저 제작 후 각 크기로 내보내기
3. **최적화**: PNG 최적화 도구 사용 (TinyPNG 등)

## 테스트

아이콘 생성 후 다음 환경에서 테스트:
- Chrome (Android 시뮬레이션)
- Safari (iOS 시뮬레이션)  
- Edge (Windows PWA)
- 실제 모바일 기기

## 참고 자료

- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)