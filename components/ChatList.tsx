import React from 'react';
import { MessageCircle } from 'lucide-react';

export function ChatList() {
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