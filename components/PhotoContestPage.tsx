import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, Camera, Trophy, Award, Star } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import bannerImage from 'figma:asset/2910648e899a96ea2a6bf403052a9c4fc19d181e.png';

interface PhotoContestPageProps {
  onBack: () => void;
  onWritePost: () => void;
}

export function PhotoContestPage({ onBack, onWritePost }: PhotoContestPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('PhotoContestPage: 포토 콘테스트 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('PhotoContestPage: 받은 게시물 수:', fetchedPosts.length);
        setPosts(fetchedPosts);
        setLoading(false);
      },
      '포토 콘테스트', // category filter
      undefined, // pet type filter
      (error) => {
        console.error('PhotoContestPage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('PhotoContestPage: Firebase 리스너 해제');
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

  const getContestStatus = (likesCount: number) => {
    if (likesCount >= 40) return { status: '1위', color: 'bg-yellow-500 text-white', icon: '🥇' };
    if (likesCount >= 30) return { status: '2위', color: 'bg-gray-400 text-white', icon: '🥈' };
    if (likesCount >= 20) return { status: '3위', color: 'bg-orange-600 text-white', icon: '🥉' };
    return { status: '참가중', color: 'bg-blue-100 text-blue-600', icon: '📸' };
  };

  // 각 배너별 배경 이미지
  const bannerImages = [
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=400&fit=crop&q=80', // 잠자는 강아지
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&q=80', // 일상 반려동물
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop&q=80'  // 겨울 옷 반려동물
  ];

  // 현재 진행중인 이벤트 배너들
  const eventBanners = [
    {
      title: '가장 귀여운 잠자는 모습',
      subtitle: '우리 아이들의 달콤한 잠자는 모습을 담아주세요',
      deadline: '12월 31일까지',
      prize: '1등 10만원 상품권',
      participants: 45,
      backgroundImage: bannerImages[0]
    },
    {
      title: '반려동물과 함께하는 일상',
      subtitle: '소중한 일상의 순간들을 공유해주세요',
      deadline: '1월 15일까지',
      prize: '1등 펫용품 세트',
      participants: 32,
      backgroundImage: bannerImages[1]
    },
    {
      title: '겨울 패션쇼',
      subtitle: '귀여운 겨울 옷차림을 자랑해주세요',
      deadline: '2월 14일까지',
      prize: '1등 5만원 상품권',
      participants: 28,
      backgroundImage: bannerImages[2]
    }
  ];



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
            <h1 className="text-lg font-semibold">포토 콘테스트</h1>
            <p className="text-sm text-gray-500">자랑스러운 우리 아이를 뽐내보세요</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span>참가하기</span>
        </button>
      </div>

      {/* 이벤트 배너 슬라이드 */}
      <div className="px-4 mb-8 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <Trophy className="w-4 h-4 mr-1 text-primary" />
            진행중인 콘테스트
          </h3>
          {/* 페이지 인디케이터를 제목 옆에 배치 */}
          <span className="text-xs text-gray-400 font-medium">
            {currentSlide + 1} / {eventBanners.length}
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
              if (newSlide !== currentSlide && newSlide >= 0 && newSlide < eventBanners.length) {
                setCurrentSlide(newSlide);
              }
            }}
          >
            {eventBanners.map((banner, index) => (
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
                        {banner.title}
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
                        <span className="mr-2">📅</span>
                        <span className="font-medium" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{banner.deadline}</span>
                      </div>
                      <div className="flex items-center text-sm text-white">
                        <span className="mr-2">🎁</span>
                        <span className="font-medium" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{banner.prize}</span>
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
            {eventBanners.map((_, index) => (
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

      {/* 콘테스트 참가작 목록 */}
      <div className="px-4 pb-20">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-primary" />
          참가작 갤러리
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">콘테스트 작품을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 참가작이 없어요</h3>
            <p className="text-gray-500 mb-4">첫 번째 참가자가 되어보세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              첫 작품 올리기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.slice(0, 10).map((post) => {
              const contestStatus = getContestStatus(post.likesCount || 0);
              
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
                        <span className={`text-xs px-2 py-1 rounded-full ${contestStatus.color}`}>
                          {contestStatus.icon} {contestStatus.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">{post.content}</p>
                  
                  {/* 사진 표시 - 콘테스트이므로 사진이 중심 */}
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="mb-3">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={post.imageUrls[0]}
                          alt={`${post.authorName}의 콘테스트 참가작`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
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
                  
                  {/* 투표 정보 */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">현재 투표 수</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-800">{post.likesCount || 0}표</span>
                      </div>
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
                        투표하기
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