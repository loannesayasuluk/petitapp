import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, HelpCircle, CheckCircle } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface CuriousQAPageProps {
  onBack: () => void;
  onWritePost: () => void;
}

export function CuriousQAPage({ onBack, onWritePost }: CuriousQAPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('CuriousQAPage: 궁금 Q&A 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('CuriousQAPage: 받은 게시물 수:', fetchedPosts.length);
        setPosts(fetchedPosts);
        setLoading(false);
      },
      '궁금 Q&A', // category filter
      undefined, // pet type filter
      (error) => {
        console.error('CuriousQAPage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('CuriousQAPage: Firebase 리스너 해제');
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

  const isQuestion = (content: string) => {
    return content.includes('?') || content.includes('궁금') || content.includes('질문') || content.includes('어떻게');
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
            <h1 className="text-lg font-semibold">궁금 Q&A</h1>
            <p className="text-sm text-gray-500">반려동물 관련 궁금한 점을 물어보세요</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>질문하기</span>
        </button>
      </div>



      {/* 게시물 목록 */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Q&A 게시물을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 질문이 없어요</h3>
            <p className="text-gray-500 mb-4">궁금한 점이 있으시면 언제든 질문해주세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              첫 질문 올리기
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
                    <p className="text-sm font-medium">{post.authorName || '익명'}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    {isQuestion(post.content) ? (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center">
                        <HelpCircle className="w-3 h-3 mr-1" />
                        질문
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        답변
                      </span>
                    )}
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
                    <span>{post.commentsCount || 0} 답변</span>
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