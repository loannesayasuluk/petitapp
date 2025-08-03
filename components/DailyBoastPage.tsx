import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, Camera } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface DailyBoastPageProps {
  onBack: () => void;
  onWritePost: () => void;
  onLoginRequired?: (actionType: 'like' | 'comment' | 'general') => void;
}

export function DailyBoastPage({ onBack, onWritePost, onLoginRequired }: DailyBoastPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 랜덤 반려동물 사진 배열
  const getRandomPetImage = () => {
    const petImages = [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80', // 골든 리트리버
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&q=80', // 고양이
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80', // 강아지와 고양이
      'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=300&fit=crop&q=80', // 시바견
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&q=80', // 고양이 놀이
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&q=80', // 강아지 산책
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&q=80', // 오렌지 고양이
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80', // 플레이풀한 강아지
    ];
    return petImages[Math.floor(Math.random() * petImages.length)];
  };

  useEffect(() => {
    console.log('DailyBoastPage: 일상 자랑 카테고리 게시물 로딩 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('DailyBoastPage: 받은 게시물 수:', fetchedPosts.length);
        
        // 사진이 없는 게시물에 랜덤 반려동물 사진 추가
        const postsWithImages = fetchedPosts.map(post => ({
          ...post,
          imageUrls: post.imageUrls && post.imageUrls.length > 0 
            ? post.imageUrls 
            : [getRandomPetImage()]
        }));
        
        setPosts(postsWithImages);
        setLoading(false);
      },
      '일상 자랑', // category filter
      undefined, // pet type filter
      (error) => {
        console.error('DailyBoastPage: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('DailyBoastPage: Firebase 리스너 해제');
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
      onLoginRequired?.('general');
      return;
    }
    onWritePost();
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (!currentUser) {
      onLoginRequired?.('like');
      return;
    }
    
    // TODO: 실제 좋아요 토글 로직 구현
    console.log('좋아요 토글:', postId);
  };

  // 댓글 버튼 클릭 핸들러
  const handleCommentClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (!currentUser) {
      onLoginRequired?.('comment');
      return;
    }
    
    // TODO: 댓글 페이지로 이동 또는 댓글 모달 표시
    console.log('댓글 클릭:', postId);
  };

  // 안전한 클립보드 복사 함수
  const copyToClipboard = async (text: string): Promise<boolean> => {
    // 방법 1: 전통적인 방식을 우선 사용 (더 안정적)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (success) {
        return true;
      }
    } catch (error) {
      console.warn('전통적인 복사 방식 실패:', error);
    }
    
    // 방법 2: 최신 Clipboard API 시도 (보안 컨텍스트에서만)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.warn('Clipboard API 실패:', error);
      }
    }
    
    return false;
  };

  // 공유 버튼 클릭 핸들러
  const handleShareClick = async (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const shareTitle = `Petit에서 ${post.authorName}님의 일상 자랑`;
    const shareText = post.content.length > 50 
      ? `${post.content.substring(0, 50)}...` 
      : post.content;

    try {
      // Web Share API가 지원되는 경우 (주로 모바일)
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: shareTitle,
          text: shareText,
          url: shareUrl
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast.success('게시물이 공유되었습니다! 🎉');
          return;
        }
      }
      
      // Web Share API를 사용할 수 없는 경우 클립보드 복사
      const copySuccess = await copyToClipboard(shareUrl);
      
      if (copySuccess) {
        toast.success('게시물 링크가 클립보드에 복사되었습니다! 📋', {
          description: '다른 앱에서 붙여넣기하여 공유할 수 있어요'
        });
      } else {
        // 모든 방법이 실패한 경우 URL 표시
        toast.info('링크를 수동으로 복사해 주세요', {
          description: shareUrl,
          duration: 10000
        });
      }
    } catch (error) {
      console.error('공유 실패:', error);
      
      // 최후의 수단: URL을 길게 표시하여 사용자가 수동으로 복사할 수 있도록
      toast.info('링크를 수동으로 복사해 주세요', {
        description: shareUrl,
        duration: 10000
      });
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
            <h1 className="text-lg font-semibold">일상 자랑</h1>
            <p className="text-sm text-gray-500">우리 아이의 귀여운 일상을 공유해보세요</p>
          </div>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center space-x-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span>자랑하기</span>
        </button>
      </div>



      {/* 게시물 목록 */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">일상 자랑 게시물을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">아직 자랑할 게시물이 없어요</h3>
            <p className="text-gray-500 mb-4">우리 아이의 첫 번째 일상을 공유해보세요!</p>
            <button
              onClick={handleWriteClick}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              첫 게시물 작성하기
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
                  <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    일상 자랑
                  </span>
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
                  <button 
                    className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    onClick={(e) => handleLikeClick(e, post.id)}
                  >
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
                  <button 
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    onClick={(e) => handleCommentClick(e, post.id)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount || 0}</span>
                  </button>
                  <button 
                    className="flex items-center space-x-1 hover:text-green-500 transition-colors"
                    onClick={(e) => handleShareClick(e, post)}
                  >
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