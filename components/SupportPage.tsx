import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Mail, Phone, Clock, Send, Plus, ChevronDown, ExternalLink, Star } from 'lucide-react';

interface SupportPageProps {
  onBack: () => void;
}

export function SupportPage({ onBack }: SupportPageProps) {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const [inquiryType, setInquiryType] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const contactMethods = [
    {
      icon: MessageCircle,
      title: '카카오톡 상담',
      subtitle: '@petit_support',
      description: '가장 빠른 답변',
      status: '즉시 연결',
      statusColor: 'text-green-600',
      action: () => {
        alert('💬 카카오톡 상담\n\n@petit_support로 문의하시면\n가장 빠른 답변을 받을 수 있습니다!\n\n카카오톡 앱에서 검색해주세요.');
      }
    },
    {
      icon: Mail,
      title: '이메일 문의',
      subtitle: 'support@petit.com',
      description: '상세한 문의사항',
      status: '24시간 내 답변',
      statusColor: 'text-blue-600',
      action: () => {
        alert('📧 이메일 문의\n\nsupport@petit.com\n\n상세한 문의사항이나 스크린샷이\n필요한 경우 이메일로 문의해주세요.');
      }
    },
    {
      icon: Phone,
      title: '전화 상담',
      subtitle: '1588-1234',
      description: '긴급한 문의사항',
      status: '평일 9:00-18:00',
      statusColor: 'text-orange-600',
      action: () => {
        alert('📞 전화 상담\n\n1588-1234\n\n운영시간: 평일 9:00-18:00\n(토요일, 일요일, 공휴일 휴무)\n\n긴급한 문의사항은 전화로 연락주세요.');
      }
    }
  ];

  const faqItems = [
    {
      question: '회원가입은 어떻게 하나요?',
      answer: '구글 계정 또는 네이버 계정으로 간편하게 회원가입할 수 있습니다. 앱 상단의 로그인 버튼을 눌러 원하는 소셜 로그인을 선택해주세요.'
    },
    {
      question: '게시물을 삭제하려면 어떻게 하나요?',
      answer: '내가 작성한 게시물에서 우상단의 더보기 버튼(...)을 누르면 삭제 옵션이 나타납니다. 삭제된 게시물은 복구할 수 없으니 신중하게 선택해주세요.'
    },
    {
      question: '다른 사용자를 신고하려면?',
      answer: '부적절한 게시물이나 댓글에서 신고 버튼을 누르거나, 사용자 프로필에서 신고할 수 있습니다. 신고 사유를 선택하고 제출하면 검토 후 조치됩니다.'
    },
    {
      question: '알림 설정을 변경하려면?',
      answer: '설정 > 알림에서 원하는 알림 유형을 선택하거나 해제할 수 있습니다. 푸시 알림, 이메일 알림 등을 개별적으로 설정 가능합니다.'
    },
    {
      question: '반려동물 프로필은 어떻게 등록하나요?',
      answer: '프로필 > 반려동물 관리에서 새로운 반려동물을 등록할 수 있습니다. 이름, 품종, 나이, 사진 등을 입력하여 프로필을 완성해주세요.'
    }
  ];

  const inquiryTypes = [
    '계정 문제',
    '게시물 관련',
    '결제/환불',
    '기능 제안',
    '버그 신고',
    '기타'
  ];

  const handleSendInquiry = () => {
    if (!inquiryType || !inquiryMessage.trim()) {
      alert('문의 유형과 내용을 모두 입력해주세요.');
      return;
    }
    
    alert(`📨 문의가 접수되었습니다!\n\n유형: ${inquiryType}\n\n24시간 내에 답변드리겠습니다.\n빠른 답변을 원하시면 카카오톡으로 문의해주세요.`);
    setInquiryType('');
    setInquiryMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">고객센터</h1>
        </div>
      </div>

      {/* 고객센터 콘텐츠 */}
      <div className="p-4">
        {/* 인사말 */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">안녕하세요! 🐾</h2>
            <p className="text-muted-foreground">
              Petit을 이용해 주셔서 감사합니다.<br />
              궁금한 점이 있으시면 언제든지 문의해주세요.
            </p>
          </div>
        </div>

        {/* 연락 방법 */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">문의 방법</h3>
          <div className="space-y-3">
            {contactMethods.map((method, index) => (
              <button
                key={index}
                onClick={method.action}
                className="w-full bg-card rounded-xl p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{method.title}</div>
                    <div className="text-sm text-muted-foreground">{method.subtitle}</div>
                    <div className="text-xs text-muted-foreground mt-1">{method.description}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${method.statusColor}`}>
                      {method.status}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground mt-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 운영시간 */}
        <div className="bg-card rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">운영시간</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>평일</span>
              <span>09:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span>토요일</span>
              <span>10:00 - 16:00</span>
            </div>
            <div className="flex justify-between">
              <span>일요일/공휴일</span>
              <span className="text-muted-foreground">휴무</span>
            </div>
          </div>
        </div>

        {/* 자주 묻는 질문 */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">자주 묻는 질문</h3>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50"
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${
                      selectedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {selectedFAQ === index && (
                  <div className="px-4 pb-4">
                    <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 문의하기 폼 */}
        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold mb-4">직접 문의하기</h3>
          
          {/* 문의 유형 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">문의 유형</label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">유형을 선택해주세요</option>
              {inquiryTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* 문의 내용 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">문의 내용</label>
            <textarea
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              placeholder="문의하실 내용을 자세히 적어주세요..."
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
            />
          </div>

          {/* 전송 버튼 */}
          <button
            onClick={handleSendInquiry}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 font-medium"
          >
            <Send className="w-4 h-4" />
            <span>문의 전송</span>
          </button>
        </div>

        {/* 평가하기 */}
        <div className="bg-card rounded-xl p-4 mt-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2">고객센터가 도움이 되셨나요?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              여러분의 소중한 의견을 들려주세요
            </p>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => alert(`⭐ ${star}점 평가해주셔서 감사합니다!\n더 나은 서비스로 보답하겠습니다.`)}
                  className="w-8 h-8 flex items-center justify-center text-yellow-400 hover:text-yellow-500"
                >
                  <Star className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}