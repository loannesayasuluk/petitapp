import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, Star, ShoppingBag, ThumbsUp } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface ProductReviewPageProps {
  onBack: () => void;
  onWritePost: () => void;
}

export function ProductReviewPage({ onBack, onWritePost }: ProductReviewPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('ProductReviewPage: 용품 리뷰 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('ProductReviewPage: 받은 게시물 수:', fetchedPosts.length);
        setPosts(fetchedPosts);
        setLoading(false);
      },
      '용품 리뷰', // category filter
      undefined, // pet type filter
      (error) => {
        console.error('ProductReviewPage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('ProductReviewPage: Firebase 리스너 해제');
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

  const getReviewRating = (content: string) => {
    if (content.includes('최고') || content.includes('완전 좋') || content.includes('강추')) return 5;
    if (content.includes('좋아') || content.includes('만족') || content.includes('추천')) return 4;
    if (content.includes('보통') || content.includes('그럭저럭')) return 3;
    if (content.includes('별로') || content.includes('아쉬')) return 2;
    if (content.includes('최악') || content.includes('비추')) return 1;
    return 4; // 기본값
  };

  const getProductCategory = (content: string) => {
    if (content.includes('사료') || content.includes('간식') || content.includes('먹이')) return '사료/간식';
    if (content.includes('장난감') || content.includes('토이') || content.includes('놀이')) return '장난감';
    if (content.includes('집') || content.includes('하우스') || content.includes('매트')) return '하우스/매트';
    if (content.includes('목줄') || content.includes('하네스') || content.includes('리드줄')) return '산책용품';
    if (content.includes('샴푸') || content.includes('브러쉬') || content.includes('미용')) return '미용용품';
    if (content.includes('그릇') || content.includes('물병') || content.includes('식기')) return '식기류';
    return '기타 용품';
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

  // 용품 카테고리들
  const productCategories = [
    {
      icon: '🍖',
      title: '사료/간식',
      description: '맛있고 건강한 먹거리',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: '🎾',
      title: '장난감',
      description: '재미있는 놀이용품',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: '🏠',
      title: '하우스/매트',
      description: '편안한 휴식 공간',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: '🦮',
      title: '산책용품',
      description: '목줄, 하네스 등',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: '🧴',
      title: '미용용품',
      description: '샴푸, 브러쉬 등',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: '🥣',
      title: '식기류',
      description: '밥그릇, 물병 등',
      color: 'bg-indigo-50 text-indigo-600'
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
            <h1 className="text-lg font-semibold">용품 리뷰</h1>
            <p className="text-sm text-gray-500">다른 집사들의 솔직한 후기를 확인하세요</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Star className="w-4 h-4" />
          <span>리뷰쓰기</span>
        </button>
      </div>



      {/* 게시물 목록 */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">용품 리뷰를 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 리뷰가 없어요</h3>
            <p className="text-gray-500 mb-4">사용해본 용품의 첫 리뷰를 작성해보세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              첫 리뷰 작성하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const rating = getReviewRating(post.content);
              const productCategory = getProductCategory(post.content);
              
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
                      <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                        {productCategory}
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
                            alt={`${post.authorName}의 용품 리뷰 사진`}
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
                                alt={`${post.authorName}의 용품 리뷰 사진 ${index + 1}`}
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