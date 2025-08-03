import React from 'react';
import { Home, Users, Edit3, MessageSquare, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { currentUser, isAdmin } = useAuth();
  
  const baseTabs = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'community', icon: Users, label: '커뮤니티' },
    { id: 'write', icon: Edit3, label: '글쓰기' },
    { id: 'chat', icon: MessageSquare, label: '채팅' },
    { id: 'profile', icon: User, label: '프로필' },
  ];

  // 관리자인 경우 관리자 탭 추가
  const tabs = isAdmin 
    ? [...baseTabs.slice(0, -1), { id: 'admin', icon: Shield, label: '관리자' }, baseTabs[baseTabs.length - 1]]
    : baseTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center py-1 px-2"
            >
              <IconComponent
                className={`w-6 h-6 mb-1 ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-primary font-medium' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}