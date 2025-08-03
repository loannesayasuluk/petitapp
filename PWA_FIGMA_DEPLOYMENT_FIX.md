# 🔧 Figma PWA Builder 인식 문제 해결 가이드

## 📋 문제 상황
- PWA Builder에서 `https://render-cream-56937028.figma.site` 도메인 입력
- Manifest.json을 인식하지 못하는 문제 발생

## 🔍 원인 분석

### 1. Figma 배포 환경의 제약사항
- **CORS 정책**: Figma 도메인에서 외부 도구 접근 제한
- **파일 경로**: 정적 파일 서빙 방식의 차이
- **캐싱**: Figma CDN의 캐싱으로 인한 업데이트 지연
- **헤더 설정**: Content-Type 헤더 누락

### 2. PWA Builder의 요구사항
- Manifest.json 파일에 직접 접근 가능해야 함
- CORS 헤더가 허용되어야 함
- 올바른 Content-Type 헤더 필요

## 🛠️ 해결 방법

### 방법 1: 직접 URL 확인 (즉시 가능)

```bash
# 1. 브라우저에서 직접 확인
https://render-cream-56937028.figma.site/manifest.json

# 2. 개발자 도구에서 확인
# F12 → Console에서 실행
fetch('/manifest.json').then(r => r.json()).then(console.log)
```

**✅ 성공 시**: manifest.json 내용이 표시됨
**❌ 실패 시**: 404 또는 CORS 에러 발생

### 방법 2: Vercel로 재배포 (권장)

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 프로젝트에서 배포
npm run build
vercel --prod

# 3. 새로운 도메인으로 PWA Builder 테스트
```

### 방법 3: GitHub Pages 배포

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 방법 4: Figma 배포에서 강제 새로고침

1. **Figma에서 다시 배포**
   - Share → Publish → Update
   - 캐시 클리어 대기 (5-10분)

2. **브라우저 캐시 클리어**
   ```
   Ctrl+Shift+R (강제 새로고침)
   또는
   F12 → Network → Disable cache 체크
   ```

3. **새 브라우저/시크릿 모드에서 테스트**

## 🔧 임시 해결 방법

### manifest.json 인라인 삽입

현재 `index.html` 파일을 수정하여 manifest를 인라인으로 삽입합니다:

```html
<!-- 기존 -->
<link rel="manifest" href="/manifest.json" />

<!-- 임시 해결 -->
<script>
  // Manifest를 인라인으로 정의
  const manifestData = {
    "name": "Petit - 반려동물 커뮤니티",
    "short_name": "Petit",
    "description": "모든 종류의 반려동물 소유자와 예비 소유자들을 위한 정보 공유 및 소셜 네트워킹 플랫폼",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FAF8F1",
    "theme_color": "#E5B876",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "ko",
    "dir": "ltr",
    "categories": ["lifestyle", "social", "pets"],
    "icons": [
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ]
  };

  // Blob으로 manifest 생성
  const manifestBlob = new Blob([JSON.stringify(manifestData)], {
    type: 'application/json'
  });
  const manifestURL = URL.createObjectURL(manifestBlob);

  // Link 요소 생성 및 추가
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = manifestURL;
  document.head.appendChild(link);
</script>
```

## ✅ 검증 방법

### 1. 브라우저에서 직접 확인
```
https://your-domain.com/manifest.json
```

### 2. PWA Builder 재시도
1. [PWABuilder.com](https://www.pwabuilder.com/) 접속
2. 새로운 URL 입력
3. "Start" 클릭
4. Manifest 인식 확인

### 3. Chrome DevTools로 확인
```
F12 → Application → Manifest
```

### 4. Lighthouse PWA 점수 확인
```
F12 → Lighthouse → PWA 카테고리 실행
```

## 🎯 우선 순위별 해결 방법

### 🚨 긴급 (지금 당장)
1. Vercel에 재배포
2. 새 도메인으로 PWA Builder 시도

### ⚡ 단기 (오늘 내)
1. GitHub Pages 설정
2. 커스텀 도메인 연결

### 📈 중기 (이번 주)
1. CDN 설정 최적화
2. 자동 배포 파이프라인 구축

## 🔍 문제 진단 체크리스트

```bash
# 1. Manifest 파일 접근 확인
curl -I https://render-cream-56937028.figma.site/manifest.json

# 2. Content-Type 헤더 확인
curl -H "Accept: application/json" https://render-cream-56937028.figma.site/manifest.json

# 3. CORS 헤더 확인
curl -H "Origin: https://www.pwabuilder.com" -I https://render-cream-56937028.figma.site/manifest.json
```

**✅ 정상 응답 예시:**
```
HTTP/2 200
content-type: application/json
access-control-allow-origin: *
cache-control: max-age=3600
```

**❌ 문제 응답 예시:**
```
HTTP/2 404
또는
HTTP/2 200
content-type: text/html (잘못된 타입)
```

## 💡 예방 방법

### 1. 배포 전 PWA 검증
```bash
# 로컬에서 PWA 검증
npm run pwa:test
```

### 2. 자동화된 PWA 점수 체크
```yaml
# GitHub Actions에 추가
- name: PWA Audit
  run: |
    npx lighthouse --only-categories=pwa --output=json --output-path=./pwa-report.json ${{ steps.deploy.outputs.url }}
```

### 3. manifest.json 유효성 검사
```bash
# 배포 후 자동 검증
curl -f $DEPLOY_URL/manifest.json | jq .
```

## 🆘 추가 도움

### PWA Builder 대안 도구
1. **PWA Test**: https://pwatest.com/
2. **Lighthouse CLI**: `npx lighthouse --only-categories=pwa`
3. **Web.dev Measure**: https://web.dev/measure/

### 커뮤니티 지원
- PWA Builder GitHub: https://github.com/pwa-builder/PWABuilder
- PWA 개발자 커뮤니티: https://dev.to/t/pwa
- Vercel 커뮤니티: https://vercel.com/community

---

**🎯 권장 해결 순서:**
1. Vercel로 즉시 재배포 (`vercel --prod`)
2. 새 URL로 PWA Builder 재시도
3. 성공하면 해당 도메인 사용
4. 실패하면 GitHub Pages로 배포

**대부분의 경우 Vercel 재배포로 해결됩니다!** 🚀