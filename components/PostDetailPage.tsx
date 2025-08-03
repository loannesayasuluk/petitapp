import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, MoreVertical, Send, Star } from 'lucide-react';
import { Post, getPostById, addComment, getCommentsForPost, Comment } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';


interface PostDetailPageProps {
  postId: string;
  onBack: () => void;
  onLoginRequired?: (actionType: 'like' | 'comment' | 'general') => void;
}

export function PostDetailPage({ postId, onBack, onLoginRequired }: PostDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    try {
      console.log('PostDetailPage: 게시물 데이터 로딩 시작, postId:', postId);
      
      // 게시물 데이터 로드
      const postData = await getPostById(postId);
      console.log('PostDetailPage: 로드된 게시물 데이터:', postData);
      
      if (postData) {
        setPost(postData);
        
        // 댓글 데이터 로드
        const commentsData = await getCommentsForPost(postId);
        console.log('PostDetailPage: 로드된 댓글 데이터:', commentsData);
        setComments(commentsData);
      }
    } catch (error) {
      console.error('PostDetailPage: 데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    setSubmittingComment(true);
    try {
      console.log('PostDetailPage: 댓글 작성 시도, 내용:', newComment);
      
      await addComment({
        postId,
        content: newComment.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName || '익명',
        createdAt: new Date()
      });

      setNewComment('');
      // 댓글 목록 새로고침
      const updatedComments = await getCommentsForPost(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error('PostDetailPage: 댓글 작성 오류:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      onLoginRequired?.('like');
      return;
    }
    
    // TODO: 실제 좋아요 토글 로직 구현
    console.log('좋아요 토글:', postId);
  };

  // 댓글 버튼 클릭 핸들러
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      onLoginRequired?.('comment');
      return;
    }
    
    // 댓글 입력 필드에 포커스
    const commentInput = document.querySelector('input[placeholder="댓글을 입력하세요..."]') as HTMLInputElement;
    if (commentInput) {
      commentInput.focus();
    }
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
  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!post) return;
    
    const shareUrl = `${window.location.origin}/post/${postId}`;
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

  // 댓글 입력 필드 클릭 핸들러
  const handleCommentInputClick = () => {
    if (!currentUser) {
      onLoginRequired?.('comment');
      return;
    }
  };

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

  const getPostRating = (content: string) => {
    if (content.includes('최고') || content.includes('완전 좋') || content.includes('강추')) return 5;
    if (content.includes('좋아') || content.includes('만족') || content.includes('추천')) return 4;
    if (content.includes('보통') || content.includes('그럭저럭')) return 3;
    if (content.includes('별로') || content.includes('아쉬')) return 2;
    if (content.includes('최악') || content.includes('비추')) return 1;
    return 0; // 별점이 없는 게시물
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">게시물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😥</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">게시물을 찾을 수 없어요</h3>
          <p className="text-gray-500 mb-4">삭제되었거나 존재하지 않는 게시물입니다.</p>
          <button
            onClick={onBack}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const postRating = getPostRating(post.content);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">게시물</h1>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 게시물 내용 */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="bg-white border-b border-gray-200">
          {/* 작성자 정보 */}
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full mr-3 flex items-center justify-center">
                <span className="text-white font-medium">
                  {post.authorName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{post.authorName || '익명'}</p>
                  {postRating > 0 && renderStars(postRating)}
                </div>
                <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
              </div>
              {post.category && (
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs">
                  {post.category}
                </span>
              )}
            </div>

            {/* 게시물 내용 */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* 이미지들 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="mb-4">
                {post.imageUrls.length === 1 ? (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={post.imageUrls[0]}
                      alt={`${post.authorName}의 게시물 사진`}
                      className="w-full h-auto max-h-96 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                      }}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {post.imageUrls.map((imageUrl, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`${post.authorName}의 게시물 사진 ${index + 1}`}
                          className="w-full h-32 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 반려동물 정보 */}
            {(post.petName || post.petType) && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">🐾 반려동물 정보</h4>
                <div className="text-sm text-gray-600">
                  {post.petType && <span>종류: {post.petType}</span>}
                  {post.petName && <span className="ml-3">이름: {post.petName}</span>}
                  {post.petBreed && <span className="ml-3">품종: {post.petBreed}</span>}
                </div>
              </div>
            )}

            {/* 좋아요, 댓글, 공유 버튼 */}
            <div className="flex items-center space-x-6 py-2 border-t border-gray-100">
              <button 
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                onClick={handleLikeClick}
              >
                {/* 로그인한 사용자가 실제로 좋아요를 눌렀는지 확인 */}
                {currentUser && post.likes && post.likes.includes(currentUser.uid) ? (
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                ) : (
                  <Heart className="w-5 h-5" />
                )}
                <span className={`text-sm ${currentUser && post.likes && post.likes.includes(currentUser.uid) ? "text-red-500" : ""}`}>
                  {post.likesCount || 0}
                </span>
              </button>
              <button 
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                onClick={handleCommentClick}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{comments.length}</span>
              </button>
              <button 
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                onClick={handleShareClick}
              >
                <Share className="w-5 h-5" />
                <span className="text-sm">공유</span>
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 mb-3">
              댓글 {comments.length}개
            </h3>
            
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">아직 댓글이 없어요</p>
                <p className="text-xs">첫 번째 댓글을 남겨보세요!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600">
                        {comment.authorName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{comment.authorName || '익명'}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 댓글 작성 영역 */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        {currentUser ? (
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-white">
                {currentUser.displayName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submittingComment}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submittingComment ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-gray-500 text-sm">
              댓글을 작성하려면{' '}
              <button
                onClick={() => onLoginRequired?.('comment')}
                className="text-primary font-medium hover:text-primary-600 hover:underline transition-colors"
              >
                로그인
              </button>
              해주세요
            </p>
          </div>
        )}
      </div>

    </div>
  );
}