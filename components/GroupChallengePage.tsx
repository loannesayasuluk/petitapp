import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, Users, Target, Trophy, Calendar } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import bannerImage from 'figma:asset/2910648e899a96ea2a6bf403052a9c4fc19d181e.png';

interface GroupChallengePageProps {
  onBack: () => void;
  onWritePost: () => void;
}

export function GroupChallengePage({ onBack, onWritePost }: GroupChallengePageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('GroupChallengePage: 그룹 챌린지 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('GroupChallengePage: 받은 게시물 수:', fetchedPosts.length);
        setPosts(fetchedPosts);
        setLoading(false);
      },
      '그룹 챌린지', // category filter
      undefined, // pet type filter
      (error) => {
        console.error('GroupChallengePage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('GroupChallengePage: Firebase 리스너 해제');
      unsubscribe();
    };
  }, []);

  const formatTimeAgo = (createdAt: any) => {
    if (!createdAt) return '방금 전';
    
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const handleWriteClick = () => {
    if (!currentUser) {
      alert('로그인이 필요합니다!');
      return;
    }
    onWritePost();
  };

  const getChallengeInfo = (content: string, likesCount: number) => {
    if (content.includes('산책') || content.includes('운동')) {
      return { 
        type: '운동챌린지', 
        color: 'bg-green-100 text-green-600', 
        icon: '🏃‍♀️',
        participants: Math.max(30, likesCount * 2)
      };
    }
    if (content.includes('다이어트') || content.includes('체중') || content.includes('건강')) {
      return { 
        type: '건강챌린지', 
        color: 'bg-blue-100 text-blue-600', 
        icon: '⚖️',
        participants: Math.max(20, likesCount * 1.5)
      };
    }
    if (content.includes('사진') || content.includes('인증')) {
      return { 
        type: '인증챌린지', 
        color: 'bg-purple-100 text-purple-600', 
        icon: '📸',
        participants: Math.max(25, likesCount * 1.8)
      };
    }
    return { 
      type: '기타챌린지', 
      color: 'bg-gray-100 text-gray-600', 
      icon: '🎯',
      participants: Math.max(15, likesCount)
    };
  };

  // 각 배너별 배경 이미지
  const challengeImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&q=80', // 산책하는 강아지
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&q=80',   // 건강한 반려동물
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop&q=80', // 사진 찍는 모습
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop&q=80'     // 훈련하는 모습
  ];

  // 진행중인 챌린지 배너들
  const challengeBanners = [
    {
      title: '매일 산책하기',
      subtitle: '30일 연속 산책으로 건강한 생활 습관 만들기',
      duration: '30일 챌린지',
      reward: '완주시 포인트 적립',
      participants: 85,
      difficulty: '쉬움',
      icon: '🏃‍♀️',
      backgroundImage: challengeImages[0]
    },
    {
      title: '건강체중 만들기',
      subtitle: '우리 아이 적정 체중 유지 프로젝트',
      duration: '60일 챌린지',
      reward: '완주시 수의사 상담권',
      participants: 42,
      difficulty: '보통',
      icon: '⚖️',
      backgroundImage: challengeImages[1]
    },
    {
      title: '일상 인증샷',
      subtitle: '매일매일 우리 아이 일상 기록하기',
      duration: '21일 챌린지',
      reward: '완주시 포토북 제작권',
      participants: 67,
      difficulty: '쉬움',
      icon: '📸',
      backgroundImage: challengeImages[2]
    },
    {
      title: '새로운 기술 배우기',
      subtitle: '반려동물과 함께하는 트릭 훈련',
      duration: '45일 챌린지',
      reward: '완주시 훈련용품 세트',
      participants: 28,
      difficulty: '어려움',
      icon: '🎯',
      backgroundImage: challengeImages[3]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움': return 'bg-green-100 text-green-600';
      case '보통': return 'bg-yellow-100 text-yellow-600';
      case '어려움': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">그룹 챌린지</h1>
            <p className="text-sm text-gray-500">함께 도전하고 성장해요</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Target className="w-4 h-4" />
          <span>챌린지 만들기</span>
        </button>
      </div>

      {/* 챌린지 배너 슬라이드 */}
      <div className="px-4 mb-8 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Trophy className="w-4 h-4 mr-1 text-primary" />
            진행중인 챌린지
          </h3>
          {/* 페이지 인디케이터를 제목 옆에 배치 */}
          <span className="text-xs text-gray-400 font-medium">
            {currentSlide + 1} / {challengeBanners.length}
          </span>
        </div>
        
        <div className="relative">
          {/* 배너 컨테이너 - 터치 스크롤 가능 */}
          <div 
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 touch-pan-x"
            style={{ scrollBehavior: 'smooth' }}
            onScroll={(e) => {
              const container = e.currentTarget;
              const containerWidth = container.clientWidth;
              const scrollLeft = container.scrollLeft;
              const newSlide = Math.round(scrollLeft / containerWidth);
              if (newSlide !== currentSlide && newSlide >= 0 && newSlide < challengeBanners.length) {
                setCurrentSlide(newSlide);
              }
            }}
          >
            {challengeBanners.map((banner, index) => (
              <div 
                key={index} 
                className="w-full flex-shrink-0 snap-start rounded-2xl overflow-hidden shadow-lg relative"
                style={{ minWidth: '100%', minHeight: '140px' }}
              >
                {/* 배경 이미지 */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${banner.backgroundImage})`,
                    filter: 'brightness(0.8) saturate(1.1)'
                  }}
                />
                
                {/* 컨셉 색상 오버레이 */}
                <div className="absolute inset-0 bg-primary/65" />
                
                {/* 추가 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-orange-400/30" />
                
                {/* 콘텐츠 */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  {/* 상단 정보 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        {banner.icon} {banner.title}
                      </h4>
                      <p className="text-sm text-white leading-relaxed" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                        {banner.subtitle}
                      </p>
                    </div>
                    <div className="ml-3">
                      <span className="bg-white/25 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/40" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {banner.participants}명 참가
                      </span>
                    </div>
                  </div>
                  
                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-white">
                        <span className="mr-2">⏰</span>
                        <span className="font-medium" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{banner.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-white">
                        <span className="mr-2">🎁</span>
                        <span className="font-medium" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{banner.reward}</span>
                      </div>
                    </div>
                    <button className="bg-white text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/95 hover:scale-105 transition-all duration-200 shadow-lg">
                      참가하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 도트 */}
          <div className="flex justify-center space-x-1.5 mt-4">
            {challengeBanners.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-primary w-6' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 챌린지 참가 게시물 */}
      <div className="px-4 pb-20">

        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">챌린지 정보를 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 진행중인 챌린지가 없어요</h3>
            <p className="text-gray-500 mb-4">첫 번째 챌린지를 만들어보세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              첫 챌린지 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 10).map((post) => {
              const challengeInfo = getChallengeInfo(post.content, post.likesCount || 0);
              
              return (
                <div key={post.id} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-primary rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {post.authorName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{post.authorName || '익명'}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${challengeInfo.color}`}>
                          {challengeInfo.icon} {challengeInfo.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">{post.content}</p>
                  
                  {/* 사진 표시 */}
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="mb-3">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={post.imageUrls[0]}
                          alt={`${post.authorName}의 챌린지 인증샷`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 챌린지 정보 */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-purple-600" />
                        <span className="text-gray-700">참여자: {challengeInfo.participants}명</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-purple-600" />
                        <span className="text-gray-700">기간: 30일</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-purple-600" />
                        <span className="text-gray-700">목표: 매일 인증</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3 text-purple-600" />
                        <span className="text-gray-700">상금: 포인트 적립</span>
                      </div>
                    </div>
                  </div>

                  {/* 반려동물 정보 */}
                  {(post.petName || post.petType) && (
                    <div className="bg-gray-50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-gray-600">
                        🐾 {post.petType && `${post.petType}`}
                        {post.petName && ` • ${post.petName}`}
                        {post.petBreed && ` • ${post.petBreed}`}
                      </p>
                    </div>
                  )}

                  {/* 참여 버튼 */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">이 챌린지에 참여하시겠어요?</span>
                      <button className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs hover:bg-purple-600 transition-colors">
                        참여하기
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      {/* 로그인한 사용자가 실제로 좋아요를 눌렀는지 확인 */}
                      {currentUser && post.likes && post.likes.includes(currentUser.uid) ? (
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                      <span className={currentUser && post.likes && post.likes.includes(currentUser.uid) ? "text-red-500" : ""}>
                        {post.likesCount || 0}
                      </span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <Share className="w-4 h-4" />
                      <span>공유</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}