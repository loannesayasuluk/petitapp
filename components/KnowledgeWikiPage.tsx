import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, BookOpen, Star, Award } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface KnowledgeWikiPageProps {
  onBack: () => void;
  onWritePost: () => void;
}

export function KnowledgeWikiPage({ onBack, onWritePost }: KnowledgeWikiPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('KnowledgeWikiPage: 지식백과 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('KnowledgeWikiPage: 받은 게시물 수:', fetchedPosts.length);
        setPosts(fetchedPosts);
        setLoading(false);
      },
      '건강 정보', // category filter
      undefined, // pet type filter
      (error) => {
        console.error('KnowledgeWikiPage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('KnowledgeWikiPage: Firebase 리스너 해제');
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
    if (content.includes('품종') || content.includes('특징')) return '품종 정보';
    if (content.includes('건강') || content.includes('병원') || content.includes('증상')) return '건강 정보';
    if (content.includes('훈련') || content.includes('교육') || content.includes('행동')) return '훈련 가이드';
    if (content.includes('사료') || content.includes('영양') || content.includes('먹이')) return '영양 정보';
    return '기타 정보';
  };

  // 지식백과 카테고리들
  const knowledgeCategories = [
    {
      icon: '🐕',
      title: '품종 백과',
      description: '다양한 반려동물 품종 정보',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: '🏥',
      title: '건강 가이드',
      description: '건강관리와 질병 예방법',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: '🍖',
      title: '영양 정보',
      description: '올바른 사료와 영양소',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: '🎾',
      title: '훈련 방법',
      description: '효과적인 훈련과 교육',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: '🏠',
      title: '생활 환경',
      description: '안전하고 편안한 환경 조성',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: '🧴',
      title: '관리 용품',
      description: '필수 용품과 사용법',
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
            <h1 className="text-lg font-semibold">지식백과</h1>
            <p className="text-sm text-gray-500">품종, 질병 등 유용한 정보를 확인하세요</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>정보공유</span>
        </button>
      </div>



      {/* 게시물 목록 */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">지식백과 정보를 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 지식 정보가 없어요</h3>
            <p className="text-gray-500 mb-4">유용한 반려동물 정보를 공유해주세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              정보 공유하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
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
                      <Star className="w-3 h-3 text-yellow-500" />
                    </div>
                    <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                      {getPostType(post.content)}
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
                          alt={`${post.authorName}의 반려동물 사진`}
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
                              alt={`${post.authorName}의 반려동물 사진 ${index + 1}`}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}