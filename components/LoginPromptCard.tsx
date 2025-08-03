import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, MessageCircle, User } from 'lucide-react';
import { motion, PanInfo } from 'framer-motion';

interface LoginPromptCardProps {
  isVisible: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  actionType: 'like' | 'comment' | 'general';
}

export function LoginPromptCard({ isVisible, onClose, onLoginClick, actionType }: LoginPromptCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 액션 타입별 메시지와 아이콘
  const getActionInfo = () => {
    switch (actionType) {
      case 'like':
        return {
          icon: <Heart className="w-5 h-5 text-red-500" />,
          title: '좋아요를 누르려면 로그인해주세요',
          subtitle: '마음에 드는 게시물에 좋아요를 표시해보세요'
        };
      case 'comment':
        return {
          icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
          title: '댓글을 작성하려면 로그인해주세요',
          subtitle: '다른 사용자들과 소통해보세요'
        };
      default:
        return {
          icon: <User className="w-5 h-5 text-primary" />,
          title: '로그인이 필요한 기능입니다',
          subtitle: 'Petit의 모든 기능을 이용해보세요'
        };
    }
  };

  const actionInfo = getActionInfo();

  // 드래그 핸들러
  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    // 위쪽으로 50px 이상 드래그하면 카드 닫기
    if (info.offset.y < -50) {
      onClose();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <motion.div
        className="fixed inset-0 bg-black/20 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      
      {/* 로그인 유도 카드 */}
      <motion.div
        ref={cardRef}
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 500,
          duration: 0.4 
        }}
        drag="y"
        dragConstraints={{ top: -100, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 0.98 }}
      >
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* 드래그 인디케이터 */}
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          
          {/* 카드 내용 */}
          <div className="px-6 pb-6">
            {/* 닫기 버튼 */}
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex items-start space-x-4">
              {/* 아이콘 */}
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                {actionInfo.icon}
              </div>
              
              {/* 텍스트 콘텐츠 */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {actionInfo.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {actionInfo.subtitle}
                </p>
                
                {/* 액션 버튼들 */}
                <div className="flex space-x-3">
                  <button
                    onClick={onLoginClick}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex-1 font-medium"
                  >
                    로그인하기
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    나중에
                  </button>
                </div>
              </div>
            </div>

            {/* 부가 정보 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Petit 계정이 없으신가요?{' '}
                <button
                  onClick={onLoginClick}
                  className="text-primary font-medium hover:underline"
                >
                  회원가입하기
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}