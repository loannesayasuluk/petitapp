import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, MapPin, Star, Navigation, Phone } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface PetPlacePageProps {
  onBack: () => void;
  onWritePost: () => void;
}

export function PetPlacePage({ onBack, onWritePost }: PetPlacePageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('PetPlacePage: 펫 플레이스 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('PetPlacePage: 받은 게시물 수:', fetchedPosts.length);
        setPosts(fetchedPosts);
        setLoading(false);
      },
      '펫 플레이스', // category filter - 펫 플레이스만 표시
      undefined, // pet type filter
      (error) => {
        console.error('PetPlacePage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('PetPlacePage: Firebase 리스너 해제');
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

  const getPlaceType = (content: string) => {
    if (content.includes('병원') || content.includes('동물병원') || content.includes('수의사')) return '동물병원';
    if (content.includes('카페') || content.includes('애견카페') || content.includes('펫카페')) return '펫카페';
    if (content.includes('호텔') || content.includes('펜션') || content.includes('숙박')) return '펫호텔/펜션';
    if (content.includes('공원') || content.includes('산책') || content.includes('놀이터')) return '산책/공원';
    if (content.includes('미용') || content.includes('그루밍') || content.includes('목욕')) return '펫 미용실';
    if (content.includes('쇼핑') || content.includes('용품') || content.includes('마트')) return '펫샵/마트';
    return '기타 장소';
  };

  const getPlaceRating = (content: string) => {
    if (content.includes('최고') || content.includes('완전 좋') || content.includes('강추')) return 5;
    if (content.includes('좋아') || content.includes('만족') || content.includes('추천')) return 4;
    if (content.includes('보통') || content.includes('그럭저럭')) return 3;
    if (content.includes('별로') || content.includes('아쉬')) return 2;
    if (content.includes('최악') || content.includes('비추')) return 1;
    return 4; // 기본값
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // 장소 카테고리들
  const placeCategories = [
    {
      icon: '🏥',
      title: '동물병원',
      description: '믿을 수 있는 병원 정보',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: '☕',
      title: '펫카페',
      description: '반려동물과 함께하는 카페',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: '🏨',
      title: '펫호텔/펜션',
      description: '여행 시 맡길 수 있는 곳',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: '🌳',
      title: '산책/공원',
      description: '산책하기 좋은 장소',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: '✂️',
      title: '펫 미용실',
      description: '그루밍 전문점',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: '🛒',
      title: '펫샵/마트',
      description: '용품 쇼핑 장소',
      color: 'bg-pink-50 text-pink-600'
    }
  ];

  // 추천 장소 목록 (샘플 데이터)
  const recommendedPlaces = [
    {
      name: '강남 24시 동물병원',
      type: '동물병원',
      rating: 5,
      address: '서울시 강남구',
      features: ['24시간', '주차가능', '응급실']
    },
    {
      name: '홍대 댕댕이 카페',
      type: '펫카페',
      rating: 4,
      address: '서울시 마포구',
      features: ['대형견 환영', '놀이시설', '주차가능']
    },
    {
      name: '한강공원 뚝섬지구',
      type: '산책/공원',
      rating: 5,
      address: '서울시 성동구',
      features: ['넓은 잔디밭', '강변산책', '무료']
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
            <h1 className="text-lg font-semibold">펫 플레이스</h1>
            <p className="text-sm text-gray-500">주변의 애견카페, 병원 정보를 찾아보세요</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          <span>장소추천</span>
        </button>
      </div>



      {/* 게시물 목록 */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">펫 플레이스 정보를 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 장소 정보가 없어요</h3>
            <p className="text-gray-500 mb-4">좋은 펫 플레이스를 추천해주세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              첫 장소 추천하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 10).map((post) => {
              const placeType = getPlaceType(post.content);
              const rating = getPlaceRating(post.content);
              
              return (
                <div key={post.id} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-primary rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {post.authorName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{post.authorName || '익명'}</p>
                        {renderStars(rating)}
                      </div>
                      <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs bg-cyan-100 text-cyan-600 px-2 py-1 rounded-full">
                        {placeType}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-3 leading-relaxed">{post.content}</p>
                  
                  {/* 사진 표시 */}
                  {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="mb-3">
                      {post.imageUrls.length === 1 ? (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={post.imageUrls[0]}
                            alt={`${post.authorName}의 장소 사진`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                          {post.imageUrls.slice(0, 4).map((imageUrl, index) => (
                            <div key={index} className="relative">
                              <img
                                src={imageUrl}
                                alt={`${post.authorName}의 장소 사진 ${index + 1}`}
                                className="w-full h-24 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                                }}
                              />
                              {index === 3 && post.imageUrls.length > 4 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                  <span className="text-white font-medium">+{post.imageUrls.length - 4}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 장소 정보 표시 */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <p className="text-xs text-gray-600 font-medium">장소 정보</p>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-700">
                        📍 서울시 강남구 (예시)
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-700">
                        ⏰ 09:00-18:00
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-700">
                        🚗 주차가능
                      </span>
                    </div>
                  </div>
                  
                  {/* 반려동물 정보가 있는 경우 표시 */}
                  {(post.petName || post.petType) && (
                    <div className="bg-gray-50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-gray-600">
                        🐾 {post.petType && `${post.petType}`}
                        {post.petName && ` • ${post.petName}`}
                        {post.petBreed && ` • ${post.petBreed}`}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likesCount || 0}</span>
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