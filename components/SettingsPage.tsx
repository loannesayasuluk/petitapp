import React, { useState } from 'react';
import { ArrowLeft, Bell, Shield, Palette, Globe, Volume2, Eye, Smartphone, HelpCircle, ChevronRight } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ko');

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    alert(notifications ? '🔕 알림이 비활성화되었습니다' : '🔔 알림이 활성화되었습니다');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    alert('🌙 다크 모드 기능이 곧 업데이트됩니다!');
  };

  const handleLanguageChange = () => {
    alert('🌍 언어 설정 기능이 곧 업데이트됩니다!\n\n지원 예정 언어:\n• 한국어\n• English\n• 日本語');
  };

  const settingSections = [
    {
      title: '알림',
      icon: Bell,
      items: [
        {
          title: '푸시 알림',
          description: '새로운 소식을 받아보세요',
          toggle: true,
          value: notifications,
          onToggle: handleToggleNotifications
        },
        {
          title: '알림 시간 설정',
          description: '방해 금지 시간을 설정하세요',
          action: () => alert('⏰ 알림 시간 설정 기능이 곧 업데이트됩니다!')
        },
        {
          title: '알림 카테고리',
          description: '받고 싶은 알림을 선택하세요',
          action: () => alert('📂 알림 카테고리 설정 기능이 곧 업데이트됩니다!')
        }
      ]
    },
    {
      title: '개인정보 보호',
      icon: Shield,
      items: [
        {
          title: '프로필 공개 설정',
          description: '다른 사용자에게 보이는 정보를 관리하세요',
          action: () => alert('👤 프로필 공개 설정 기능이 곧 업데이트됩니다!')
        },
        {
          title: '차단 목록',
          description: '차단한 사용자를 관리하세요',
          action: () => alert('🚫 차단 목록 관리 기능이 곧 업데이트됩니다!')
        },
        {
          title: '데이터 다운로드',
          description: '내 데이터를 다운로드하세요',
          action: () => alert('💾 데이터 다운로드 기능이 곧 업데이트됩니다!')
        }
      ]
    },
    {
      title: '디스플레이',
      icon: Palette,
      items: [
        {
          title: '다크 모드',
          description: '어두운 테마를 사용하세요',
          toggle: true,
          value: darkMode,
          onToggle: handleToggleDarkMode
        },
        {
          title: '글꼴 크기',
          description: '읽기 편한 글꼴 크기로 조정하세요',
          action: () => alert('🔤 글꼴 크기 설정 기능이 곧 업데이트됩니다!')
        }
      ]
    },
    {
      title: '언어 및 지역',
      icon: Globe,
      items: [
        {
          title: '언어',
          description: '한국어',
          action: handleLanguageChange
        },
        {
          title: '지역',
          description: '대한민국',
          action: () => alert('🌏 지역 설정 기능이 곧 업데이트됩니다!')
        }
      ]
    },
    {
      title: '접근성',
      icon: Eye,
      items: [
        {
          title: '화면 읽기 도구',
          description: '접근성 기능을 활성화하세요',
          action: () => alert('♿ 접근성 기능이 곧 업데이트됩니다!')
        },
        {
          title: '고대비 모드',
          description: '더 명확한 색상 대비를 사용하세요',
          action: () => alert('🔍 고대비 모드 기능이 곧 업데이트됩니다!')
        }
      ]
    }
  ];

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
          <h1 className="text-lg font-semibold">설정</h1>
        </div>
      </div>

      {/* 설정 콘텐츠 */}
      <div className="p-4">
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-card rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-4">
                <section.icon className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">{section.title}</h2>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.toggle ? (
                        <button
                          onClick={item.onToggle}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={item.action}
                          className="p-1 hover:bg-muted rounded-lg"
                        >
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 앱 정보 */}
        <div className="bg-card rounded-xl p-4 mt-6">
          <div className="flex items-center space-x-3 mb-4">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">앱 정보</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span>버전</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span>최근 업데이트</span>
              <span className="text-muted-foreground">2024.01.30</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span>개발자</span>
              <span className="text-muted-foreground">Petit Team</span>
            </div>
          </div>
        </div>

        {/* 도움말 */}
        <div className="bg-card rounded-xl p-4 mt-6">
          <button
            onClick={() => alert('❓ 도움말 및 FAQ 페이지가 곧 업데이트됩니다!')}
            className="w-full flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">도움말 및 FAQ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}