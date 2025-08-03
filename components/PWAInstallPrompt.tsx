import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface PWAInstallPromptProps {
  isVisible: boolean;
  onInstall: () => void;
  onClose: () => void;
}

export function PWAInstallPrompt({ isVisible, onInstall, onClose }: PWAInstallPromptProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 프롬프트 카드 */}
      <div className="relative w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-card rounded-2xl p-6 shadow-2xl border border-border">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* 아이콘 */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* 제목과 설명 */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Petit을 홈 화면에 추가하세요
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              앱처럼 빠르고 편리하게 이용할 수 있습니다.<br />
              오프라인에서도 일부 기능을 사용할 수 있어요.
            </p>
          </div>

          {/* 장점 목록 */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <span>빠른 앱 실행</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <span>오프라인 지원</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full mr-3" />
              <span>푸시 알림 (곧 지원 예정)</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-3">
            <button
              onClick={onInstall}
              className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>홈 화면에 추가</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-muted-foreground py-2 text-sm hover:text-foreground transition-colors"
            >
              나중에 하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}