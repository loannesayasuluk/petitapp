import React, { useState } from 'react';

interface EventBannerProps {
  title: string;
  description: string;
  badge: string;
  date: string;
  onClick: () => void;
}

export function EventBanner({ title, description, badge, date, onClick }: EventBannerProps) {
  return (
    <div className="px-4 mb-6">
      <div 
        className="bg-gradient-to-r from-primary to-[#D4A574] rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="bg-white text-primary px-3 py-1 rounded-full text-sm font-bold">
            {badge}
          </span>
          <span className="text-sm opacity-90">{date}</span>
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm opacity-90 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function EventBannerList() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 단일 이벤트 데이터
  const events = [
    {
      id: '1',
      title: 'Petit 건강 지킴 이벤트',
      description: '새로운 펫시터 서비스와 함께하는 건강한 펫라이프! 지금 바로 참여해보세요.',
      badge: '이벤트 중',
      date: '24.7.28 까지'
    }
  ];

  return (
    <div className="px-4 mb-6">
      <div 
        className="bg-gradient-to-r from-primary to-[#D4A574] rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden"
        onClick={() => console.log('이벤트 클릭:', events[0].title)}
      >
        {/* 배경 이미지 효과 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>
        </div>
        
        {/* 컨텐츠 */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-white text-primary px-3 py-1 rounded-full text-sm font-bold">
              {events[0].badge}
            </span>
            <span className="text-sm opacity-90">{events[0].date}</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{events[0].title}</h2>
          <p className="text-sm opacity-90 leading-relaxed">
            {events[0].description}
          </p>
        </div>
      </div>
    </div>
  );
}