#!/usr/bin/env node

/**
 * Petit PWA 테스트 서버
 * PWA 기능을 로컬에서 테스트하기 위한 HTTPS 서버
 */

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;
const DIST_DIR = path.join(__dirname, '..', 'dist');

// 색상 출력을 위한 함수
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

// 빌드 디렉토리 확인
function checkBuildDirectory() {
  if (!fs.existsSync(DIST_DIR)) {
    colorLog('red', '❌ 빌드 디렉토리가 없습니다!');
    colorLog('yellow', '📦 빌드를 시작합니다...');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      colorLog('green', '✅ 빌드 완료!');
    } catch (error) {
      colorLog('red', '❌ 빌드 실패!');
      process.exit(1);
    }
  }
}

// 자체 서명 인증서 생성 (개발용)
function generateCertificate() {
  const certDir = path.join(__dirname, '..', 'certs');
  const keyPath = path.join(certDir, 'server.key');
  const certPath = path.join(certDir, 'server.cert');
  
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }
  
  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    colorLog('yellow', '🔐 HTTPS 인증서를 생성합니다...');
    
    try {
      // OpenSSL을 사용해 자체 서명 인증서 생성
      execSync(`openssl req -x509 -newkey rsa:2048 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=KR/ST=Seoul/L=Seoul/O=Petit/CN=localhost"`, { stdio: 'inherit' });
      colorLog('green', '✅ 인증서 생성 완료!');
    } catch (error) {
      colorLog('yellow', '⚠️  OpenSSL이 없습니다. HTTP 서버로 실행합니다.');
      return null;
    }
  }
  
  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
}

// PWA 검증 미들웨어
function pwaValidationMiddleware(req, res, next) {
  // Manifest.json 검증
  if (req.path === '/manifest.json') {
    const manifestPath = path.join(DIST_DIR, 'manifest.json');
    
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // 필수 필드 검증
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
      const missingFields = requiredFields.filter(field => !manifest[field]);
      
      if (missingFields.length > 0) {
        colorLog('red', `❌ Manifest 필수 필드 누락: ${missingFields.join(', ')}`);
      } else {
        colorLog('green', '✅ Manifest 검증 통과');
      }
    }
  }
  
  // Service Worker 검증
  if (req.path === '/sw.js') {
    const swPath = path.join(DIST_DIR, 'sw.js');
    
    if (fs.existsSync(swPath)) {
      colorLog('green', '✅ Service Worker 파일 존재');
    } else {
      colorLog('red', '❌ Service Worker 파일 없음');
    }
  }
  
  next();
}

// 서버 설정
function setupServer() {
  // 정적 파일 제공
  app.use(express.static(DIST_DIR));
  
  // PWA 검증 미들웨어
  app.use(pwaValidationMiddleware);
  
  // SPA 라우팅 지원
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
  
  // 에러 핸들러
  app.use((err, req, res, next) => {
    colorLog('red', `❌ 서버 오류: ${err.message}`);
    res.status(500).send('서버 오류가 발생했습니다.');
  });
}

// PWA 기능 테스트 함수
function testPWAFeatures() {
  colorLog('cyan', '\n🧪 PWA 기능 테스트 중...\n');
  
  // Manifest 테스트
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    colorLog('green', '✅ Manifest.json 존재');
    colorLog('blue', `   앱 이름: ${manifest.name}`);
    colorLog('blue', `   시작 URL: ${manifest.start_url}`);
    colorLog('blue', `   아이콘 개수: ${manifest.icons?.length || 0}개`);
  } else {
    colorLog('red', '❌ Manifest.json 없음');
  }
  
  // Service Worker 테스트
  const swPath = path.join(DIST_DIR, 'sw.js');
  if (fs.existsSync(swPath)) {
    colorLog('green', '✅ Service Worker 존재');
  } else {
    colorLog('red', '❌ Service Worker 없음');
  }
  
  // 아이콘 테스트
  const iconDir = path.join(DIST_DIR, 'icons');
  if (fs.existsSync(iconDir)) {
    const icons = fs.readdirSync(iconDir).filter(file => file.endsWith('.png'));
    colorLog('green', `✅ 아이콘 ${icons.length}개 발견`);
    icons.forEach(icon => {
      colorLog('blue', `   ${icon}`);
    });
  } else {
    colorLog('yellow', '⚠️  아이콘 폴더 없음');
  }
  
  console.log();
}

// 서버 시작
function startServer() {
  checkBuildDirectory();
  setupServer();
  testPWAFeatures();
  
  const credentials = generateCertificate();
  
  if (credentials) {
    // HTTPS 서버 시작
    https.createServer(credentials, app).listen(PORT, () => {
      colorLog('green', '🚀 Petit PWA 테스트 서버 시작!');
      colorLog('cyan', `📱 HTTPS: https://localhost:${PORT}`);
      colorLog('yellow', '\n🔧 PWA 테스트 방법:');
      colorLog('white', '1. Chrome에서 https://localhost:' + PORT + ' 접속');
      colorLog('white', '2. F12 → Application → Manifest 확인');
      colorLog('white', '3. 주소창의 "설치" 버튼 확인');
      colorLog('white', '4. 설치 후 독립실행 확인');
      colorLog('white', '5. 네트워크 끊고 오프라인 테스트\n');
      
      colorLog('magenta', '⚠️  자체 서명 인증서 경고는 "고급" → "localhost로 이동" 클릭');
      colorLog('blue', '🛑 서버 중지: Ctrl+C');
    });
  } else {
    // HTTP 서버 시작 (PWA 기능 제한적)
    app.listen(PORT, () => {
      colorLog('yellow', '⚠️  HTTP 서버로 실행 중 (PWA 기능 제한적)');
      colorLog('cyan', `📱 HTTP: http://localhost:${PORT}`);
      colorLog('red', '❌ PWA 설치 기능을 테스트하려면 HTTPS가 필요합니다');
      colorLog('white', '💡 OpenSSL을 설치하거나 Vercel에 배포해서 테스트하세요');
    });
  }
}

// 도움말 표시
function showHelp() {
  colorLog('cyan', '\n🐾 Petit PWA 테스트 도구\n');
  colorLog('white', '사용법:');
  colorLog('white', '  node scripts/test-pwa.js        # PWA 테스트 서버 시작');
  colorLog('white', '  node scripts/test-pwa.js --help # 도움말 표시');
  colorLog('white', '\n기능:');
  colorLog('white', '  • 자동 빌드 (dist 폴더 없을 때)');
  colorLog('white', '  • HTTPS 서버 (PWA 테스트용)');
  colorLog('white', '  • Manifest 검증');
  colorLog('white', '  • Service Worker 검증');
  colorLog('white', '  • 아이콘 검증');
  colorLog('white', '\n요구사항:');
  colorLog('white', '  • Node.js 16+');
  colorLog('white', '  • npm run build 가능');
  colorLog('white', '  • OpenSSL (HTTPS용, 선택사항)');
  console.log();
}

// CLI 인터페이스
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  try {
    startServer();
  } catch (error) {
    colorLog('red', `❌ 서버 시작 실패: ${error.message}`);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { startServer, testPWAFeatures };