import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  Heart, 
  HelpCircle, 
  BookOpen, 
  Star, 
  MapPin, 
  Camera, 
  Gift, 
  Target,
  Bell,
  Bookmark
} from 'lucide-react';

interface HeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onMenuClick: () => void;
  onCategoryButtonClick: (categoryId: string) => void;
  onMainTabChange: (tabId: string) => void;
  activeTab: string;
  activeMainTab: string;
  onNotificationClick?: () => void;
  onBookmarkClick?: () => void;
  currentUser?: any; // 현재 로그인된 사용자
}

export function Header({ 
  activeCategory, 
  onCategoryChange, 
  onMenuClick, 
  onCategoryButtonClick,
  onMainTabChange,
  activeTab,
  activeMainTab,
  onNotificationClick,
  onBookmarkClick,
  currentUser
}: HeaderProps) {
  // 메인 탭 데이터
  const mainTabs = [
    { id: 'home', label: '홈' },
    { id: 'latest', label: '최신' },
    { id: 'popular', label: '인기' },
    { id: 'video', label: '영상' },
    { id: 'expert', label: '전문가' },
  ];

  // 카테고리 버튼 데이터
  const categoryButtons = [
    { id: 'daily-boast', label: '일상 자랑', icon: Heart },
    { id: 'curious-qa', label: '궁금 Q&A', icon: HelpCircle },
    { id: 'knowledge-wiki', label: '지식백과', icon: BookOpen },
    { id: 'product-review', label: '용품 리뷰', icon: Star },
    { id: 'pet-places', label: '펫 플레이스', icon: MapPin },
    { id: 'photo-contest', label: '포토 콘테스트', icon: Camera },
    { id: 'sharing-adoption', label: '나눔/분양', icon: Gift },
    { id: 'group-challenge', label: '그룹 챌린지', icon: Target },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* 상단 헤더 - 햄버거메뉴, 검색창, 알림, 북마크 */}
      <div className="px-4 py-3 flex items-center gap-3">
        {/* 햄버거 메뉴 */}
        <button
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* 검색바 */}
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="반려동물 정보를 검색해보세요"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-30 focus:border-primary focus:bg-white placeholder:text-gray-500 text-gray-800 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        {/* 우측 버튼 그룹 */}
        <div className="flex items-center gap-1">
          {/* 알림 버튼 */}
          <button 
            onClick={onNotificationClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {/* 알림 배지 - 로그인 상태일 때만 표시 */}
            {currentUser && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">3</span>
              </div>
            )}
          </button>

          {/* 북마크 버튼 */}
          <button 
            onClick={onBookmarkClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bookmark className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      {activeTab === 'home' && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-1.5">
            <div className="flex justify-between">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onMainTabChange(tab.id)}
                  className={`flex-1 py-1.5 font-medium transition-colors relative ${
                    activeMainTab === tab.id
                      ? 'text-primary'
                      : 'text-[#868E96] hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                  {activeMainTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 버튼들 - 홈 탭에서만 표시 */}
      {activeTab === 'home' && activeMainTab === 'home' && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-1">
            <div className="flex overflow-x-auto space-x-1.5 scrollbar-hide">
              {categoryButtons.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryButtonClick(category.id)}
                    className="flex flex-col items-center min-w-[72px] p-1.5"
                  >
                    {/* 아이콘 영역 - F1F3F5 배경, 12px 둥근 모서리, 액센트 색상 아이콘 */}
                    <div className="w-12 h-12 bg-[#F1F3F5] rounded-xl flex items-center justify-center mb-1 hover:bg-gray-200 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-gray-700 text-center leading-tight font-medium">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}