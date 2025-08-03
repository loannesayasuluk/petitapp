import React from 'react';
import { User, Star } from 'lucide-react';

export function ExpertContent() {
  const expertPosts = [
    {
      id: 1,
      author: '김수의 수의사',
      title: '겨울철 반려동물 건강관리',
      excerpt: '추운 겨울, 우리 아이들의 건강을 지키는 방법을 알려드립니다.',
      readTime: '5분 읽기',
      rating: 4.9,
      specialty: '내과 전문의',
    },
    {
      id: 2,
      author: '박훈련사',
      title: '강아지 기본 훈련 가이드',
      excerpt: '처음 키우는 강아지를 위한 필수 훈련 방법들을 소개합니다.',
      readTime: '7분 읽기',
      rating: 4.8,
      specialty: '동물행동학 전문가',
    },
    {
      id: 3,
      author: '이영양사',
      title: '연령별 사료 급여법',
      excerpt: '반려동물의 생애주기에 맞는 올바른 영양 관리 방법을 설명합니다.',
      readTime: '6분 읽기',
      rating: 4.9,
      specialty: '동물영양학 박사',
    },
  ];

  return (
    <div className="px-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">👨‍⚕️ 전문가 콘텐츠</h3>
      <div className="space-y-4">
        {expertPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-primary rounded-full mr-3 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">{post.author}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{post.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{post.specialty}</p>
              </div>
              <span className="text-xs text-white bg-primary px-2 py-1 rounded-full font-medium">
                전문가
              </span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{post.readTime}</span>
              <button className="text-sm text-primary hover:text-primary-600 font-medium">
                읽어보기 →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}