import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, Gift, Home, MapPin, Phone } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface ShareAdoptionPageProps {
  onBack: () => void;
  onWritePost: () => void;
}

export function ShareAdoptionPage({ onBack, onWritePost }: ShareAdoptionPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('ShareAdoptionPage: 나눔/분양 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('ShareAdoptionPage: 받은 게시물 수:', fetchedPosts.length);
        setPosts(fetchedPosts);
        setLoading(false);
      },
      '나눔/분양', // category filter
      undefined, // pet type filter
      (error) => {
        console.error('ShareAdoptionPage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('ShareAdoptionPage: Firebase 리스너 해제');
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

  const getPostType = (content: string) => {
    if (content.includes('나눔') || content.includes('드려요') || content.includes('무료')) {
      return { type: '나눔', color: 'bg-green-100 text-green-600', icon: '🎁' };
    }
    if (content.includes('분양') || content.includes('입양') || content.includes('가족')) {
      return { type: '분양', color: 'bg-blue-100 text-blue-600', icon: '🏠' };
    }
    return { type: '기타', color: 'bg-gray-100 text-gray-600', icon: '📝' };
  };

  // 나눔/분양 카테고리들
  const shareCategories = [
    {
      icon: '🎁',
      title: '용품 나눔',
      description: '안 쓰는 펫용품 나눔',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: '🍖',
      title: '사료/간식 나눔',
      description: '남은 사료, 간식 나눔',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: '🏠',
      title: '분양 정보',
      description: '새 가족을 찾는 아이들',
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      icon: '🆘',
      title: '임시보호',
      description: '임시보호가 필요한 경우',
      color: 'bg-amber-100 text-amber-700'
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
            <h1 className="text-lg font-semibold">나눔/분양</h1>
            <p className="text-sm text-gray-500">나눔과 분양으로 더 따뜻한 세상을</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Gift className="w-4 h-4" />
          <span>나눔하기</span>
        </button>
      </div>

      {/* 나눔/분양 탭 버튼 */}
      <div className="px-4 mb-6 mt-6">
        <div className="grid grid-cols-4 gap-3">
          {shareCategories.map((category, index) => (
            <button 
              key={index} 
              className="bg-white rounded-xl p-4 border-2 border-primary/20 text-center hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <span className="text-2xl block mb-2">{category.icon}</span>
              <h3 className="text-xs font-semibold text-gray-800">{category.title}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="px-4 pb-20">

        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">나눔/분양 정보를 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 나눔/분양 글이 없어요</h3>
            <p className="text-gray-500 mb-4">첫 번째 나눔을 시작해보세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              첫 나눔 글쓰기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 10).map((post) => {
              const postType = getPostType(post.content);
              
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
                        <span className={`text-xs px-2 py-1 rounded-full ${postType.color}`}>
                          {postType.icon} {postType.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
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
                            alt={`${post.authorName}의 나눔/분양 사진`}
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
                                alt={`${post.authorName}의 나눔/분양 사진 ${index + 1}`}
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

                  {/* 연락처 정보 (분양 게시물인 경우) */}
                  {postType.type === '분양' && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 text-blue-700">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs font-medium">연락처: 댓글이나 DM으로 문의주세요</span>
                      </div>
                    </div>
                  )}

                  {/* 나눔 완료 상태 표시 */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">상태</span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        🔥 나눔 진행중
                      </span>
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