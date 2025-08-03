/**
 * PWA Builder 호환성을 위한 Fallback 스크립트
 * Figma 배포 환경에서 manifest.json 인식 문제 해결
 */

(function() {
  'use strict';
  
  console.log('🔧 PWA Fallback 스크립트 시작');
  
  // Manifest 데이터 정의
  const manifestData = {
    "name": "Petit - 반려동물 커뮤니티",
    "short_name": "Petit",
    "description": "모든 종류의 반려동물 소유자와 예비 소유자들을 위한 정보 공유 및 소셜 네트워킹 플랫폼",
    "start_url": "/",
    "id": "/",
    "scope": "/",
    "display": "standalone",
    "display_override": ["window-controls-overlay", "standalone"],
    "background_color": "#FAF8F1",
    "theme_color": "#E5B876",
    "orientation": "portrait-primary",
    "lang": "ko",
    "dir": "ltr",
    "categories": ["lifestyle", "social", "pets"],
    "screenshots": [
      {
        "src": "/screenshots/home.png",
        "sizes": "390x844",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "홈 화면"
      },
      {
        "src": "/screenshots/community.png", 
        "sizes": "390x844",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "커뮤니티"
      }
    ],
    "icons": [
      {
        "src": "/icons/icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-96x96.png",
        "sizes": "96x96",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-128x128.png",
        "sizes": "128x128",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-144x144.png",
        "sizes": "144x144",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-152x152.png",
        "sizes": "152x152",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "shortcuts": [
      {
        "name": "글쓰기",
        "short_name": "글쓰기",
        "description": "새 게시물 작성",
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
        "description": "커뮤니티 둘러보기",
        "url": "/?tab=community",
        "icons": [
          {
            "src": "/icons/community-shortcut.png",
            "sizes": "96x96"
          }
        ]
      }
    ],
    "related_applications": [],
    "prefer_related_applications": false,
    "launch_handler": {
      "client_mode": "navigate-existing"
    },
    "edge_side_panel": {
      "preferred_width": 400
    }
  };
  
  // 기존 manifest 링크 확인
  function checkExistingManifest() {
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      console.log('✅ 기존 manifest 링크 발견:', existingManifest.href);
      
      // manifest 파일 접근 가능성 테스트
      fetch(existingManifest.href)
        .then(response => {
          if (response.ok) {
            console.log('✅ Manifest 파일 접근 가능');
            return response.json();
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        })
        .then(manifest => {
          console.log('✅ Manifest 내용 확인됨:', manifest);
        })
        .catch(error => {
          console.warn('⚠️ Manifest 접근 실패:', error);
          createFallbackManifest();
        });
    } else {
      console.warn('⚠️ Manifest 링크 없음, Fallback 생성');
      createFallbackManifest();
    }
  }
  
  // Fallback manifest 생성
  function createFallbackManifest() {
    try {
      // Blob으로 manifest JSON 생성
      const manifestBlob = new Blob([JSON.stringify(manifestData, null, 2)], {
        type: 'application/json'
      });
      
      // Object URL 생성
      const manifestURL = URL.createObjectURL(manifestBlob);
      
      // 기존 manifest 링크 제거
      const existingManifest = document.querySelector('link[rel="manifest"]');
      if (existingManifest) {
        existingManifest.remove();
      }
      
      // 새로운 manifest 링크 생성
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = manifestURL;
      manifestLink.crossOrigin = 'anonymous';
      
      // head에 추가
      document.head.appendChild(manifestLink);
      
      console.log('✅ Fallback manifest 생성 완료:', manifestURL);
      
      // PWA Builder가 접근할 수 있도록 전역 객체에 저장
      window.petitManifest = manifestData;
      
      // 디버깅을 위한 정보 출력
      console.log('🐾 Petit PWA Manifest:', manifestData);
      
    } catch (error) {
      console.error('❌ Fallback manifest 생성 실패:', error);
    }
  }
  
  // 추가 PWA 메타태그 생성
  function ensurePWAMetaTags() {
    const metaTags = [
      { name: 'theme-color', content: '#E5B876' },
      { name: 'application-name', content: 'Petit' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'Petit' },
      { name: 'msapplication-TileColor', content: '#E5B876' },
      { name: 'msapplication-starturl', content: '/' }
    ];
    
    metaTags.forEach(tag => {
      let existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!existingTag) {
        const metaElement = document.createElement('meta');
        metaElement.name = tag.name;
        metaElement.content = tag.content;
        document.head.appendChild(metaElement);
        console.log(`✅ 메타태그 추가: ${tag.name}`);
      }
    });
  }
  
  // PWA 설치 가능성 확인
  function checkPWAReadiness() {
    const checks = {
      'Service Worker': 'serviceWorker' in navigator,
      'Manifest': !!document.querySelector('link[rel="manifest"]'),
      'HTTPS': location.protocol === 'https:' || location.hostname === 'localhost',
      'Icons': manifestData.icons.length > 0
    };
    
    console.log('🔍 PWA 준비상태 점검:');
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${check}: ${passed}`);
    });
    
    return Object.values(checks).every(Boolean);
  }
  
  // 메인 실행 함수
  function initializePWAFallback() {
    console.log('🚀 PWA Fallback 초기화 시작');
    
    // 1. 기존 manifest 확인
    checkExistingManifest();
    
    // 2. 추가 메타태그 보장
    ensurePWAMetaTags();
    
    // 3. PWA 준비상태 확인
    const isReady = checkPWAReadiness();
    
    if (isReady) {
      console.log('🎉 PWA 준비 완료!');
    } else {
      console.warn('⚠️ PWA 설정에 문제가 있습니다.');
    }
    
    // 4. PWA Builder 테스트용 정보 출력
    console.log('🔗 PWA Builder 테스트 URL:', window.location.origin);
    console.log('📱 Manifest URL:', window.location.origin + '/manifest.json');
  }
  
  // DOM 로드 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePWAFallback);
  } else {
    initializePWAFallback();
  }
  
  // 디버깅을 위한 전역 함수
  window.debugPWA = function() {
    console.log('🐾 Petit PWA 디버그 정보:');
    console.log('- Manifest 데이터:', window.petitManifest || '없음');
    console.log('- Service Worker:', navigator.serviceWorker?.controller ? '등록됨' : '없음');
    console.log('- 현재 URL:', window.location.href);
    checkPWAReadiness();
  };
  
})();