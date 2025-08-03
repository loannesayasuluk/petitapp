// 이 파일은 더 이상 사용되지 않습니다.
// LoginModal 대신 UnifiedLoginPrompt 컴포넌트를 사용합니다.

import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // 더 이상 사용되지 않는 컴포넌트입니다.
  // UnifiedLoginPrompt를 사용하세요.
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="text-center">
          <p className="text-gray-600 mb-4">이 컴포넌트는 더 이상 사용되지 않습니다.</p>
          <p className="text-gray-600 mb-4">UnifiedLoginPrompt를 사용하세요.</p>
          <button 
            onClick={onClose}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}