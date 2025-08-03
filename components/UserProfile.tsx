import React, { useState } from 'react';
import { User, Edit, Settings, Heart, Bookmark, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';

export function UserProfile() {
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 비로그인 상태 - 회원가입 유도 화면
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* 감성 비주얼 영역 */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="text-center mb-8">
            {/* 반려동물 일러스트 영역 */}
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            
            {/* 핵심 메시지 */}
            <div className="mb-8">
              <h1 className="text-2xl mb-2 text-gray-900">
                로그인하고, 당신과 반려동물을 위한
              </h1>
              <p className="text-lg text-gray-600">
                특별한 공간을 만들어보세요.
              </p>
            </div>
          </div>

          {/* 핵심 혜택 요약 영역 */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">나만의 프로필</h3>
                <p className="text-sm text-gray-600">반려동물과 함께한 추억을 기록하고 공유해보세요</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">체계적인 건강 기록</h3>
                <p className="text-sm text-gray-600">반려동물의 건강 관리를 더욱 체계적으로</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">유용한 꿀팁 스크랩</h3>
                <p className="text-sm text-gray-600">전문가들의 조언과 유용한 정보를 저장</p>
              </div>
            </div>
          </div>

          {/* 2단계 행동 유도 영역 */}
          <div className="space-y-4">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              내 반려동물 기록 시작하기
            </button>
            
            <div className="text-center">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                이미 계정이 있으신가요? <span className="font-medium underline">로그인</span>
              </button>
            </div>
          </div>
        </div>

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>
    );
  }

  // 로그인 상태 - 기존 프로필 화면
  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="프로필" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {currentUser?.displayName || '펫띠 유저'}
              </h2>
              <p className="text-gray-600">반려동물과 함께하는 행복한 일상</p>
            </div>
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold">12</p>
              <p className="text-sm text-gray-600">게시물</p>
            </div>
            <div>
              <p className="text-lg font-semibold">148</p>
              <p className="text-sm text-gray-600">팔로워</p>
            </div>
            <div>
              <p className="text-lg font-semibold">89</p>
              <p className="text-sm text-gray-600">팔로잉</p>
            </div>
          </div>
        </div>

        {/* 메뉴 항목들 */}
        <div className="space-y-4">
          <button className="w-full bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-gray-600" />
              <span>좋아요한 게시물</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <button className="w-full bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <Bookmark className="w-5 h-5 text-gray-600" />
              <span>북마크한 글</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-3">
                              <Heart className="w-5 h-5 text-gray-600" />
              <span>내 반려동물</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <button className="w-full bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>설정</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}