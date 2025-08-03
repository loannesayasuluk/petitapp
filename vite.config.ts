import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/contexts': path.resolve(__dirname, './contexts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000, // 청크 크기 경고 임계값을 1MB로 증가
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Firebase 관련 모듈들을 별도 청크로 분리
          if (id.includes('firebase')) {
            return 'firebase'
          }
          // React 관련 모듈들
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor'
          }
          // 기타 라이브러리들
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0'  // 네트워크 접속 허용
  },
  preview: {
    port: 4173,
    open: true
  },
  define: {
    // Make env vars available to the client code
    __DEV__: mode === 'development'
  }
}
})