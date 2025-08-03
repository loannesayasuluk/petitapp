import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { listenToPosts, Post } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface HotStoriesProps {
  petTypeFilter?: string;
  onPostClick?: (postId: string) => void;
  onLoginRequired?: (actionType: 'like' | 'comment' | 'general') => void;
}

export function HotStories({ petTypeFilter, onPostClick, onLoginRequired }: HotStoriesProps) {
  const [stories, setStories] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 랜덤 반려동물 사진 배열
  const getRandomPetImage = () => {
    const petImages = [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80', // 골든 리트리버
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&q=80', // 고양이
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80', // 강아지와 고양이
      'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=300&fit=crop&q=80', // 시바견
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&q=80', // 고양이 놀���
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&q=80', // 강아지 산책
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&q=80', // 오렌지 고양이
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80', // 플레이풀한 강아지
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=300&fit=crop&q=80', // 햄스터
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop&q=80', // 래브라도
    ];
    return petImages[Math.floor(Math.random() * petImages.length)];
  };

  useEffect(() => {
    console.log('HotStories: Firebase 연동 시작');
    const unsubscribe = listenToPosts(
      (fetchedPosts) => {
        console.log('HotStories: Firebase에서 받은 게시물 수:', fetchedPosts.length);
        
        // 좋아요 수가 높은 순으로 정렬하여 인기 게시물 만들기
        const sortedByLikes = fetchedPosts
          .filter(post => (post.likesCount || 0) > 0) // 좋아요가 있는 게시물만
          .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
          .slice(0, 5); // 상위 5개만
        
        console.log('HotStories: 좋아요 기준 필터링 후 게시물 수:', sortedByLikes.length);
        
        // 사진이 없는 게시물에 랜덤 반려동물 사진 추가
        const storiesWithImages = sortedByLikes.map((story, index) => {
          const hasImages = story.imageUrls && story.imageUrls.length > 0;
          const imageUrls = hasImages ? story.imageUrls : [getRandomPetImage()];
          
          console.log(`HotStory ${index + 1} (${story.authorName}, 좋아요 ${story.likesCount}): ${hasImages ? '기존 이미지' : '랜덤 이미지'} ${imageUrls.length}개`);
          
          return {
            ...story,
            imageUrls
          };
        });
        
        console.log('HotStories: 이미지 처리 완료된 인기 게시물 수:', storiesWithImages.length);
        setStories(storiesWithImages);
        setLoading(false);
      },
      undefined, // category filter
      petTypeFilter, // pet type filter
      (error) => {
        console.error('HotStories: Firebase 데이터 오류:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('HotStories: Firebase 리스너 해제');
      unsubscribe();
    };
  }, [petTypeFilter]);

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
  const handleShareClick = async (e: React.MouseEvent, story: Post) => {
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/post/${story.id}`;
    const shareTitle = `Petit에서 ${story.authorName}님의 핫 스토리`;
    const shareText = story.content.length > 50 
      ? `${story.content.substring(0, 50)}...` 
      : story.content;

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
        <h3 className="text-lg font-semibold mb-4">
          🔥 {petTypeFilter ? `${petTypeFilter} ` : ''}핫 스토리
        </h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">인기 게시물 로딩 중...</p>
        </div>
      </div>
    );
  }

  const filteredStories = petTypeFilter 
    ? stories.filter(story => story.petType === petTypeFilter)
    : stories;

  return (
    <div className="px-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        🔥 {petTypeFilter ? `${petTypeFilter} ` : ''}핫 스토리
      </h3>
      {filteredStories.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">아직 인기 게시물이 없어요</p>
          <p className="text-sm text-gray-500">좋아요를 많이 받은 게시물이 여기에 표시됩니다! ❤️</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => (
            <div 
              key={story.id} 
              className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => onPostClick && onPostClick(story.id)}
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-primary rounded-full mr-3 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {story.authorName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{story.authorName || '익명'}</p>
                  <p className="text-xs text-gray-500">{formatTimeAgo(story.createdAt)}</p>
                </div>
                <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {story.petType || story.category}
                </span>
              </div>
              <p className="text-sm text-gray-800 mb-3 leading-relaxed">{story.content}</p>
              
              {/* 사진 표시 */}
              {story.imageUrls && story.imageUrls.length > 0 && (
                <div className="mb-3">
                  {story.imageUrls.length === 1 ? (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={story.imageUrls[0]}
                        alt={`${story.authorName}의 반려동물 사진`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                      {story.imageUrls.slice(0, 4).map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imageUrl}
                            alt={`${story.authorName}의 반려동물 사진 ${index + 1}`}
                            className="w-full h-24 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                            }}
                          />
                          {index === 3 && story.imageUrls.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-medium">+{story.imageUrls.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* 반려동물 정보가 있는 경우 표시 */}
              {(story.petName || story.petType) && (
                <div className="bg-gray-50 rounded-lg p-2 mb-3">
                  <p className="text-xs text-gray-600">
                    🐾 {story.petType && `${story.petType}`}
                    {story.petName && ` • ${story.petName}`}
                    {story.petBreed && ` • ${story.petBreed}`}
                  </p>
                </div>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <button 
                  className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                  onClick={(e) => handleLikeClick(e, story.id)}
                >
                  {/* 로그인한 사용자가 실제로 좋아요를 눌렀는지 확인 */}
                  {currentUser && story.likes && story.likes.includes(currentUser.uid) ? (
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                  <span className={currentUser && story.likes && story.likes.includes(currentUser.uid) ? "text-red-500 font-medium" : ""}>
                    {story.likesCount || 0}
                  </span>
                </button>
                <button 
                  className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                  onClick={(e) => handleCommentClick(e, story.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{story.commentsCount || 0}</span>
                </button>
                <button 
                  className="flex items-center space-x-1 hover:text-green-500 transition-colors"
                  onClick={(e) => handleShareClick(e, story)}
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
  );
}