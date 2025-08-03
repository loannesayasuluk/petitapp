import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface RecommendedContentProps {
  onPostClick?: (postId: string) => void;
  onLoginRequired?: (actionType: 'like' | 'comment' | 'general') => void;
}

export function RecommendedContent({ onPostClick, onLoginRequired }: RecommendedContentProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 랜덤 반려동물 사진 배열
  const getRandomPetImage = () => {
    const petImages = [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80',
    ];
    return petImages[Math.floor(Math.random() * petImages.length)];
  };

  useEffect(() => {
    console.log('RecommendedContent: Firebase 연동 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('RecommendedContent: Firebase에서 받은 게시물 수:', fetchedPosts.length);
        
        // 최신 게시물 순으로 정렬하여 추천 콘텐츠 생성
        const sortedPosts = fetchedPosts
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return bTime.getTime() - aTime.getTime();
          })
          .slice(0, 6); // 상위 6개만
        
        // 사진이 없는 게시물에 랜덤 반려동물 사진 추가
        const postsWithImages = sortedPosts.map((post, index) => {
          const hasImages = post.imageUrls && post.imageUrls.length > 0;
          const imageUrls = hasImages ? post.imageUrls : [getRandomPetImage()];
          
          console.log(`RecommendedContent ${index + 1} (${post.authorName}): ${hasImages ? '기존 이미지' : '랜덤 이미지'} ${imageUrls.length}개`);
          
          return {
            ...post,
            imageUrls
          };
        });
        
        console.log('RecommendedContent: 이미지 처리 완료된 게시물 수:', postsWithImages.length);
        setPosts(postsWithImages);
        setLoading(false);
      },
      undefined, // category filter
      undefined, // pet type filter
      (error) => {
        console.error('RecommendedContent: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('RecommendedContent: Firebase 리스너 해제');
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
    
    // 게시물 상세 페이지로 이동 (댓글 작성을 위해)
    onPostClick?.(postId);
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
    const shareTitle = `Petit에서 ${post.authorName}님의 게시물`;
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

  if (loading) {
    return (
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">📋 추천 콘텐츠</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">추천 콘텐츠 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">📋 추천 콘텐츠</h3>
      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">추천할 콘텐츠가 없어요</p>
          <p className="text-sm text-gray-500">새로운 게시물이 올라오면 여기에 표시됩니다! 📝</p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPostClick && onPostClick(post.id)}
            >
              <div className="flex items-start space-x-4">
                {/* 작성자 아바타 */}
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-medium">
                    {post.authorName?.charAt(0) || 'U'}
                  </span>
                </div>
                
                {/* 게시물 내용 */}
                <div className="flex-1 min-w-0">
                  {/* 작성자 정보 */}
                  <div className="flex items-center space-x-2 mb-3">
                    <p className="text-sm font-medium text-gray-900">{post.authorName || '익명'}</p>
                    <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                    {post.category && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {post.category}
                      </span>
                    )}
                  </div>
                  
                  {/* 게시물 본문 */}
                  <p className="text-sm text-gray-800 mb-4 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                  
                  {/* 반려동물 정보 */}
                  {(post.petName || post.petType) && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2.5 mb-4">
                      <p className="text-xs text-gray-600 font-medium">
                        🐾 {post.petType && `${post.petType}`}
                        {post.petName && ` • ${post.petName}`}
                        {post.petBreed && ` • ${post.petBreed}`}
                      </p>
                    </div>
                  )}
                  
                  {/* 상호작용 버튼 */}
                  <div className="flex items-center space-x-6 text-xs text-gray-500">
                    <button 
                      className="flex items-center space-x-1.5 hover:text-red-500 transition-colors"
                      onClick={(e) => handleLikeClick(e, post.id)}
                    >
                      {/* 로그인한 사용자가 실제로 좋아요를 눌렀는지 확인 */}
                      {currentUser && post.likes && post.likes.includes(currentUser.uid) ? (
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      ) : (
                        <Heart className="w-3.5 h-3.5" />
                      )}
                      <span className={currentUser && post.likes && post.likes.includes(currentUser.uid) ? "text-red-500" : ""}>
                        {post.likesCount || 0}
                      </span>
                    </button>
                    <button 
                      className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors"
                      onClick={(e) => handleCommentClick(e, post.id)}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.commentsCount || 0}</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1.5 hover:text-green-500 transition-colors"
                      onClick={(e) => handleShareClick(e, post)}
                    >
                      <Share className="w-3.5 h-3.5" />
                      <span>공유</span>
                    </button>
                  </div>
                </div>
                
                {/* 썸네일 이미지 */}
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="w-18 h-18 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                    <img
                      src={post.imageUrls[0]}
                      alt={`${post.authorName}의 게시물 썸네일`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}