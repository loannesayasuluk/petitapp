#!/usr/bin/env node

/**
 * PWA Builder 호환성 테스트 스크립트
 * manifest.json 인식 문제 진단 및 해결
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// 색상 출력
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function colorLog(color, message) {
  console.log(colors[color] + message + colors.reset);
}

// HTTP 요청 함수
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    
    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('요청 시간 초과'));
    });
    
    req.end();
  });
}

// manifest.json 테스트
async function testManifest(baseUrl) {
  const manifestUrl = new URL('/manifest.json', baseUrl).href;
  
  colorLog('blue', `📱 Manifest 테스트: ${manifestUrl}`);
  
  try {
    // 기본 요청
    const response = await makeRequest(manifestUrl);
    
    console.log(`   상태 코드: ${response.statusCode}`);
    console.log(`   Content-Type: ${response.headers['content-type'] || '없음'}`);
    console.log(`   Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || '없음'}`);
    console.log(`   Cache-Control: ${response.headers['cache-control'] || '없음'}`);
    
    if (response.statusCode === 200) {
      try {
        const manifest = JSON.parse(response.data);
        colorLog('green', '   ✅ Manifest JSON 파싱 성공');
        
        // 필수 필드 확인
        const requiredFields = ['name', 'start_url', 'display', 'icons'];
        const missingFields = requiredFields.filter(field => !manifest[field]);
        
        if (missingFields.length === 0) {
          colorLog('green', '   ✅ 필수 필드 모두 존재');
        } else {
          colorLog('yellow', `   ⚠️  누락된 필드: ${missingFields.join(', ')}`);
        }
        
        console.log(`   앱 이름: ${manifest.name}`);
        console.log(`   시작 URL: ${manifest.start_url}`);
        console.log(`   표시 모드: ${manifest.display}`);
        console.log(`   아이콘 수: ${manifest.icons?.length || 0}개`);
        
      } catch (error) {
        colorLog('red', '   ❌ Manifest JSON 파싱 실패');
        console.log(`   오류: ${error.message}`);
      }
    } else {
      colorLog('red', `   ❌ HTTP ${response.statusCode} 오류`);
    }
    
  } catch (error) {
    colorLog('red', '   ❌ 네트워크 오류');
    console.log(`   오류: ${error.message}`);
  }
}

// CORS 테스트
async function testCORS(baseUrl) {
  const manifestUrl = new URL('/manifest.json', baseUrl).href;
  
  colorLog('blue', `🌐 CORS 테스트: PWA Builder 접근`);
  
  try {
    const response = await makeRequest(manifestUrl, {
      headers: {
        'Origin': 'https://www.pwabuilder.com',
        'User-Agent': 'PWABuilder/1.0'
      }
    });
    
    const corsOrigin = response.headers['access-control-allow-origin'];
    const corsAllowed = corsOrigin === '*' || corsOrigin === 'https://www.pwabuilder.com';
    
    if (corsAllowed) {
      colorLog('green', '   ✅ CORS 허용됨');
    } else {
      colorLog('red', '   ❌ CORS 차단됨');
      console.log(`   허용된 Origin: ${corsOrigin || '없음'}`);
    }
    
  } catch (error) {
    colorLog('red', '   ❌ CORS 테스트 실패');
    console.log(`   오류: ${error.message}`);
  }
}

// Service Worker 테스트
async function testServiceWorker(baseUrl) {
  const swUrl = new URL('/sw.js', baseUrl).href;
  
  colorLog('blue', `⚙️  Service Worker 테스트: ${swUrl}`);
  
  try {
    const response = await makeRequest(swUrl);
    
    if (response.statusCode === 200) {
      colorLog('green', '   ✅ Service Worker 접근 가능');
      console.log(`   Content-Type: ${response.headers['content-type'] || '없음'}`);
    } else {
      colorLog('red', `   ❌ HTTP ${response.statusCode} 오류`);
    }
    
  } catch (error) {
    colorLog('red', '   ❌ Service Worker 접근 실패');
    console.log(`   오류: ${error.message}`);
  }
}

// 아이콘 테스트
async function testIcons(baseUrl) {
  colorLog('blue', `🎨 아이콘 테스트`);
  
  const iconSizes = ['192x192', '512x512'];
  
  for (const size of iconSizes) {
    const iconUrl = new URL(`/icons/icon-${size}.png`, baseUrl).href;
    
    try {
      const response = await makeRequest(iconUrl);
      
      if (response.statusCode === 200) {
        colorLog('green', `   ✅ icon-${size}.png 접근 가능`);
      } else {
        colorLog('yellow', `   ⚠️  icon-${size}.png 접근 불가 (HTTP ${response.statusCode})`);
      }
      
    } catch (error) {
      colorLog('yellow', `   ⚠️  icon-${size}.png 테스트 실패`);
    }
  }
}

// PWA 준비상태 점검
async function checkPWAReadiness(baseUrl) {
  colorLog('cyan', '\n🔍 PWA 준비상태 종합 점검\n');
  
  await testManifest(baseUrl);
  console.log();
  
  await testCORS(baseUrl);
  console.log();
  
  await testServiceWorker(baseUrl);
  console.log();
  
  await testIcons(baseUrl);
  console.log();
}

// PWA Builder 테스트 안내
function showPWABuilderGuide(baseUrl) {
  colorLog('cyan', '\n📋 PWA Builder 테스트 가이드\n');
  
  console.log('1. PWA Builder 방문: https://www.pwabuilder.com/');
  console.log(`2. URL 입력: ${baseUrl}`);
  console.log('3. "Start" 버튼 클릭');
  console.log('4. Manifest 인식 확인');
  console.log('5. Android 탭에서 TWA 생성');
  
  console.log('\n🔧 문제가 발생하면:');
  console.log('- 브라우저에서 manifest.json 직접 접속');
  console.log('- 새로운 도메인(Vercel)에 재배포');
  console.log('- GitHub Pages로 대안 배포');
  
  console.log('\n🚀 빠른 해결책:');
  colorLog('green', 'npm run deploy:vercel');
}

// 메인 함수
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    colorLog('red', '❌ URL을 입력해주세요');
    console.log('\n사용법:');
    console.log('  node scripts/test-pwa-builder.js <URL>');
    console.log('\n예시:');
    console.log('  node scripts/test-pwa-builder.js https://render-cream-56937028.figma.site');
    console.log('  node scripts/test-pwa-builder.js https://petitapp.vercel.app');
    process.exit(1);
  }
  
  const baseUrl = args[0];
  
  try {
    new URL(baseUrl); // URL 유효성 검사
  } catch (error) {
    colorLog('red', '❌ 유효하지 않은 URL입니다');
    process.exit(1);
  }
  
  colorLog('green', '🐾 Petit PWA Builder 호환성 테스트\n');
  colorLog('blue', `🌐 테스트 대상: ${baseUrl}\n`);
  
  await checkPWAReadiness(baseUrl);
  
  showPWABuilderGuide(baseUrl);
  
  colorLog('green', '\n✨ 테스트 완료!\n');
}

// CLI에서 실행된 경우
if (require.main === module) {
  main().catch(error => {
    colorLog('red', `❌ 오류 발생: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { checkPWAReadiness, testManifest, testCORS };