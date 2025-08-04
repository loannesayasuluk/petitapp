import React, { useState } from 'react';
import { MessageCircle, Users, Heart, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UnifiedLoginPrompt } from './UnifiedLoginPrompt';

export function ChatList() {
  const { currentUser } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // 로그인하지 않은 경우 로그인 유도 페이지 표시
  if (!currentUser) {
    return (
      <>
        <div className="pb-20 pt-4">
          <div className="px-4">
            <h2 className="text-lg font-semibold mb-4">💬 채팅</h2>
            
            {/* 로그인 유도 카드 */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  로그인하고 채팅을 시작하세요
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  다른 반려인들과 실시간으로 소통하고<br />
                  유용한 정보를 나누어보세요!
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-primary" />
                    <span>1:1 개인 채팅</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>실시간 메시지</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-primary" />
                    <span>안전한 소통</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowLoginPrompt(true)}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  로그인하기
                </button>
              </div>
            </div>
            
            {/* 샘플 채팅 미리보기 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">채팅 미리보기</h4>
              <div className="space-y-2 opacity-60">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900">뽀둥이맘</h3>
                        <span className="text-xs text-gray-500">2분 전</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">안녕하세요! 강아지 훈련 관련해서 질문드리고 싶어요</p>
                    </div>
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">2</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900">냥냥집사</h3>
                        <span className="text-xs text-gray-500">1시간 전</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">사료 추천 감사해요!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 로그인 모달 */}
        {showLoginPrompt && (
          <UnifiedLoginPrompt
            onClose={() => setShowLoginPrompt(false)}
            trigger="chat"
            isFullScreen={true}
          />
        )}
      </>
    );
  }

  // 로그인한 경우 기존 채팅 목록 표시
  const chats = [
    {
      id: 1,
      name: '뽀둥이맘',
      lastMessage: '안녕하세요! 강아지 훈련 관련해서 질문드리고 싶어요',
      time: '2분 전',
      unread: 2,
    },
    {
      id: 2,
      name: '냥냥집사',
      lastMessage: '사료 추천 감사해요!',
      time: '1시간 전',
      unread: 0,
    },
    {
      id: 3,
      name: '댕댕이아빠',
      lastMessage: '산책 모임 언제 하나요?',
      time: '3시간 전',
      unread: 1,
    },
  ];

  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-4">💬 채팅</h2>
        
        <div className="space-y-2">
          {chats.map((chat) => (
            <div key={chat.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{chat.unread}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {chats.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">아직 채팅이 없어요</p>
            <p className="text-sm text-gray-500">다른 집사들과 대화를 시작해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}