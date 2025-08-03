import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Eye, Trash2, Ban, CheckCircle, Clock } from 'lucide-react';

interface ContentModerationProps {
  onBack: () => void;
}

interface ReportedContent {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  category: string;
  reportReason: string;
  reporterName: string;
  reportDate: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reportCount: number;
}

export function ContentModeration({ onBack }: ContentModerationProps) {
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [selectedContent, setSelectedContent] = useState<ReportedContent | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);

  const [reportedContents] = useState<ReportedContent[]>([
    {
      id: '1',
      postId: 'post_1',
      authorName: '문제유저',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      content: '이 게시물에는 부적절한 내용이 포함되어 있을 수 있습니다. 커뮤니티 가이드라인을 위반하는 내용으로 신고되었습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
      category: '일상 자랑',
      reportReason: '부적절한 내용',
      reporterName: '신고자1',
      reportDate: '2024.07.29',
      status: 'pending',
      reportCount: 3
    },
    {
      id: '2',
      postId: 'post_2',
      authorName: '스팸계정',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      content: '여기서 최고의 반려동물 용품을 구매하세요! 링크 클릭하면 50% 할인! 지금 바로 구매하세요!',
      category: '제품 리뷰',
      reportReason: '스팸/광고',
      reporterName: '신고자2',
      reportDate: '2024.07.29',
      status: 'pending',
      reportCount: 5
    },
    {
      id: '3',
      postId: 'post_3',
      authorName: '악성유저',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d3b8c3?w=100&h=100&fit=crop&crop=face',
      content: '다른 사용자들에게 비방과 욕설을 사용한 댓글입니다.',
      category: '궁금해요 Q&A',
      reportReason: '욕설/비방',
      reporterName: '신고자3',
      reportDate: '2024.07.28',
      status: 'resolved',
      reportCount: 2
    },
    {
      id: '4',
      postId: 'post_4',
      authorName: '허위정보유저',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      content: '반려동물 건강에 관한 잘못된 정보를 퍼뜨리고 있습니다.',
      category: '지식 위키',
      reportReason: '허위 정보',
      reporterName: '신고자4',
      reportDate: '2024.07.28',
      status: 'dismissed',
      reportCount: 1
    }
  ]);

  const filteredContents = reportedContents.filter(content => 
    filterStatus === 'all' || content.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'dismissed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'resolved': return '처리완료';
      case 'dismissed': return '기각';
      default: return '알 수 없음';
    }
  };

  const handleContentAction = (action: string, contentId: string) => {
    console.log(`콘텐츠 ${contentId}에 대한 ${action} 액션 실행`);
    // 실제 구현에서는 Firebase에서 콘텐츠 상태 업데이트
    setShowContentModal(false);
  };

  const getReportReasonColor = (reason: string) => {
    switch (reason) {
      case '부적절한 내용': return 'bg-red-100 text-red-800';
      case '스팸/광고': return 'bg-orange-100 text-orange-800';
      case '욕설/비방': return 'bg-purple-100 text-purple-800';
      case '허위 정보': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">콘텐츠 관리</h1>
              <p className="text-sm text-gray-600">{filteredContents.length}개의 신고</p>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="p-4 pt-0">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'pending', label: '대기중', count: reportedContents.filter(c => c.status === 'pending').length },
              { key: 'resolved', label: '처리완료', count: reportedContents.filter(c => c.status === 'resolved').length },
              { key: 'dismissed', label: '기각', count: reportedContents.filter(c => c.status === 'dismissed').length },
              { key: 'all', label: '전체', count: reportedContents.length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-2 ${
                  filterStatus === filter.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  filterStatus === filter.key ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 신고된 콘텐츠 목록 */}
      <div className="p-4 pb-20 space-y-3">
        {filteredContents.map((content) => (
          <div 
            key={content.id} 
            className="bg-white rounded-xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-start space-x-3">
              <img 
                src={content.authorAvatar} 
                alt={content.authorName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-gray-900">{content.authorName}</h3>
                  <span className="text-sm text-gray-500">{content.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                    {getStatusText(content.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{content.content}</p>

                {content.imageUrl && (
                  <img 
                    src={content.imageUrl}
                    alt="신고된 이미지"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                <div className="flex items-center space-x-4 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getReportReasonColor(content.reportReason)}`}>
                    {content.reportReason}
                  </span>
                  <span className="text-xs text-gray-500">신고자: {content.reporterName}</span>
                  <span className="text-xs text-gray-500">신고 {content.reportCount}회</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{content.reportDate}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedContent(content);
                        setShowContentModal(true);
                      }}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">상세보기</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredContents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500">해당 상태의 신고가 없습니다</p>
          </div>
        )}
      </div>

      {/* 콘텐츠 상세 모달 */}
      {showContentModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">신고된 콘텐츠 상세</h2>
                <button 
                  onClick={() => setShowContentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* 작성자 정보 */}
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedContent.authorAvatar} 
                  alt={selectedContent.authorName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedContent.authorName}</h3>
                  <p className="text-sm text-gray-600">{selectedContent.category}</p>
                </div>
              </div>

              {/* 신고 정보 */}
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-900">신고 정보</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-red-700">신고 사유:</span>
                    <span className="font-medium text-red-900">{selectedContent.reportReason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">신고자:</span>
                    <span className="font-medium text-red-900">{selectedContent.reporterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">신고 횟수:</span>
                    <span className="font-medium text-red-900">{selectedContent.reportCount}회</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">신고일:</span>
                    <span className="font-medium text-red-900">{selectedContent.reportDate}</span>
                  </div>
                </div>
              </div>

              {/* 콘텐츠 내용 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">신고된 콘텐츠</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContent.content}</p>
                  {selectedContent.imageUrl && (
                    <img 
                      src={selectedContent.imageUrl}
                      alt="신고된 이미지"
                      className="w-full h-48 object-cover rounded-lg mt-3"
                    />
                  )}
                </div>
              </div>

              {/* 처리 액션 */}
              {selectedContent.status === 'pending' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">처리 액션</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleContentAction('delete', selectedContent.id)}
                      className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                      <div>
                        <span className="font-medium text-red-900 block">콘텐츠 삭제</span>
                        <span className="text-sm text-red-700">게시물을 완전히 제거합니다</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleContentAction('hide', selectedContent.id)}
                      className="w-full flex items-center space-x-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors text-left"
                    >
                      <Ban className="h-5 w-5 text-yellow-600" />
                      <div>
                        <span className="font-medium text-yellow-900 block">콘텐츠 숨김</span>
                        <span className="text-sm text-yellow-700">게시물을 비공개로 전환합니다</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleContentAction('dismiss', selectedContent.id)}
                      className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    >
                      <CheckCircle className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="font-medium text-gray-900 block">신고 기각</span>
                        <span className="text-sm text-gray-700">문제없음으로 처리합니다</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* 처리 결과 (이미 처리된 경우) */}
              {selectedContent.status !== 'pending' && (
                <div className={`rounded-xl p-4 ${
                  selectedContent.status === 'resolved' ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    {selectedContent.status === 'resolved' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-600" />
                    )}
                    <span className={`font-medium ${
                      selectedContent.status === 'resolved' ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {selectedContent.status === 'resolved' ? '처리 완료됨' : '신고 기각됨'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}