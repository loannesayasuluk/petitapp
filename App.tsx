import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';

import { EventBannerList } from './components/EventBanner';
import { RecommendedContent } from './components/RecommendedContent';
import { HotStories } from './components/HotStories';
import { ExpertContent } from './components/ExpertContent';
import { CommunityFeed } from './components/CommunityFeed';
import { UserProfile } from './components/UserProfile';
import { ChatList } from './components/ChatList';
import { BottomNavigation } from './components/BottomNavigation';
import { FloatingWriteButton } from './components/FloatingWriteButton';
import { WritePost } from './components/WritePost';

import { UnifiedLoginPrompt } from './components/UnifiedLoginPrompt';
import { LoginPromptCard } from './components/LoginPromptCard';
import { SideMenu } from './components/SideMenu';
import { DailyBoastPage } from './components/DailyBoastPage';
import { CuriousQAPage } from './components/CuriousQAPage';
import { KnowledgeWikiPage } from './components/KnowledgeWikiPage';
import { ProductReviewPage } from './components/ProductReviewPage';
import { PetPlacePage } from './components/PetPlacePage';
import { PhotoContestPage } from './components/PhotoContestPage';
import { ShareAdoptionPage } from './components/ShareAdoptionPage';
import { GroupChallengePage } from './components/GroupChallengePage';
import { PostDetailPage } from './components/PostDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { ContentModeration } from './components/ContentModeration';
import { AdminSettings } from './components/AdminSettings';
import { ProfileDetailPage } from './components/ProfileDetailPage';
import { SettingsPage } from './components/SettingsPage';
import { SupportPage } from './components/SupportPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeSampleData } from './lib/sampleData';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('home');
  const [activeMainTab, setActiveMainTab] = useState('home');
  const [showWritePage, setShowWritePage] = useState(false);

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showUnifiedLoginPage, setShowUnifiedLoginPage] = useState(false);
  const [loginPromptTrigger, setLoginPromptTrigger] = useState<'notification' | 'bookmark' | 'write' | 'profile' | 'general'>('general');
  const [currentCategoryPage, setCurrentCategoryPage] = useState<string | null>(null);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [currentAdminPage, setCurrentAdminPage] = useState<string | null>(null);
  const [currentSideMenuPage, setCurrentSideMenuPage] = useState<string | null>(null);

  // 로그인 유도 카드 상태
  const [showLoginPromptCard, setShowLoginPromptCard] = useState(false);
  const [loginPromptCardAction, setLoginPromptCardAction] = useState<'like' | 'comment' | 'general'>('general');

  const [lastHomeClickTime, setLastHomeClickTime] = useState<number>(0);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 자동 로그인 방지: 앱 시작 시 Firebase Auth 관련 localStorage 클리어 (한 번만)
        const hasLoggedOutPreviously = localStorage.getItem('petit_auth_cleared');
        if (!hasLoggedOutPreviously) {
          // Firebase Auth에서 사용하는 가능한 localStorage 키들 제거
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
              key.startsWith('firebase:') || 
              key.includes('authUser') || 
              key.includes('firebase') ||
              key.includes('auth')
            )) {
              keysToRemove.push(key);
            }
          }
          
          keysToRemove.forEach(key => {
            try {
              localStorage.removeItem(key);
              console.log(`Cleared auth storage: ${key}`);
            } catch (error) {
              console.warn(`Failed to clear ${key}:`, error);
            }
          });
          
          localStorage.setItem('petit_auth_cleared', 'true');
          console.log('🧹 자동 로그인 방지: 이전 인증 정보 클리어됨');
        }
        
        // 영구 샘플 데이터 생성 (한 번만 실행)
        const hasInitializedData = localStorage.getItem('petit_initial_data_created');
        
        if (!hasInitializedData) {
          console.log('카테고리별 샘플 데이터 생성 중...');
          await initializeSampleData();
          localStorage.setItem('petit_initial_data_created', 'true');
          console.log('✅ 카테고리별 샘플 데이터 생성 완료');
        }
      } catch (error) {
        console.warn('앱 초기화 중 네트워크 문제:', error?.message || '알 수 없는 오류');
        console.log('앱은 오프라인 기능으로 계속 동작합니다');
      }
    };
    
    initializeApp();

    // PWA 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // 앱이 이미 설치되어 있지 않고, 처음 방문이 아닌 경우에만 프롬프트 표시
      const isInstalled = localStorage.getItem('petit_pwa_installed');
      const visitCount = parseInt(localStorage.getItem('petit_visit_count') || '0');
      
      if (!isInstalled && visitCount >= 2) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      console.log('🎉 PWA 설치 완료');
      localStorage.setItem('petit_pwa_installed', 'true');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // 방문 횟수 카운트
    const visitCount = parseInt(localStorage.getItem('petit_visit_count') || '0');
    localStorage.setItem('petit_visit_count', (visitCount + 1).toString());

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleLogin = () => {
    setShowSideMenu(false);
    setLoginPromptTrigger('general');
    setShowUnifiedLoginPage(true);
  };

  const handleLogout = async () => {
    setShowSideMenu(false);
    try {
      // Firebase에서 로그아웃
      const { logOut } = await import('./lib/firebase');
      await logOut();
      
      // 브라우저 저장소 정리
      localStorage.removeItem('petit_initial_data_created');
      localStorage.removeItem('petit_auth_cleared');
      
      // 페이지 새로고침��로 앱 초기화
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      // 에러가 발생해도 강제로 로그아웃
      window.location.reload();
    }
  };

  const handleProfileClick = () => {
    setShowSideMenu(false);
    setCurrentSideMenuPage('profile-detail');
  };

  const handleSettingsClick = () => {
    setShowSideMenu(false);
    setCurrentSideMenuPage('settings');
  };

  const handleSupportClick = () => {
    setShowSideMenu(false);
    setCurrentSideMenuPage('support');
  };

  const handleBackFromSideMenuPage = () => {
    setCurrentSideMenuPage(null);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('✅ 사용자가 PWA 설치를 승인했습니다');
          localStorage.setItem('petit_pwa_installed', 'true');
        } else {
          console.log('❌ 사용자가 PWA 설치를 거부했습니다');
        }
        
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      } catch (error) {
        console.error('PWA 설치 중 오류:', error);
      }
    }
  };

  const handleCloseInstallPrompt = () => {
    setShowInstallPrompt(false);
    // 24시간 동안 다시 표시하지 않음
    localStorage.setItem('petit_install_prompt_dismissed', Date.now().toString());
  };

  const handleWritePost = () => {
    // 로그인 상태 확인
    if (!currentUser) {
      setLoginPromptTrigger('write');
      setShowUnifiedLoginPage(true);
      return;
    }
    
    // 로그인된 경우 글쓰기 페이지로 이동
    setShowWritePage(true);
  };

  // 로그인 유도 카드 핸들러
  const handleShowLoginPrompt = (actionType: 'like' | 'comment' | 'general' = 'general') => {
    if (!currentUser) {
      setLoginPromptCardAction(actionType);
      setShowLoginPromptCard(true);
    }
  };

  const handleCloseLoginPromptCard = () => {
    setShowLoginPromptCard(false);
  };

  const handleLoginPromptCardClick = () => {
    setShowLoginPromptCard(false);
    setLoginPromptTrigger('general');
    setShowUnifiedLoginPage(true);
  };

  const handleBackFromCategoryPage = () => {
    setCurrentCategoryPage(null);
  };

  const handlePostClick = (postId: string) => {
    console.log('게시물 클릭:', postId);
    setCurrentPostId(postId);
  };

  const handleBackFromPostDetail = () => {
    setCurrentPostId(null);
  };

  const handleAdminNavigate = (page: string) => {
    setCurrentAdminPage(page);
  };

  const handleBackFromAdmin = () => {
    setCurrentAdminPage(null);
  };

  const handleMainTabChange = (tabId: string) => {
    setActiveMainTab(tabId);
    console.log(`메인 탭 변경: ${tabId}`);
  };

  const handleCategoryButtonClick = (categoryId: string) => {
    console.log(`카테고리 버튼 클릭: ${categoryId}`);
    
    // 각 카테고리별 페이지로 이동
    switch (categoryId) {
      case 'daily-boast':
        setCurrentCategoryPage('daily-boast');
        break;
      case 'curious-qa':
        setCurrentCategoryPage('curious-qa');
        break;
      case 'knowledge-wiki':
        setCurrentCategoryPage('knowledge-wiki');
        break;
      case 'product-review':
        setCurrentCategoryPage('product-review');
        break;
      case 'pet-places':
        setCurrentCategoryPage('pet-places');
        break;
      case 'photo-contest':
        setCurrentCategoryPage('photo-contest');
        break;
      case 'sharing-adoption':
        setCurrentCategoryPage('sharing-adoption');
        break;
      case 'group-challenge':
        setCurrentCategoryPage('group-challenge');
        break;
      default:
        console.log('알 수 없는 카테고리:', categoryId);
    }
  };

  const handleNotificationClick = () => {
    console.log('알림 버튼 클릭');
    
    if (!currentUser) {
      setLoginPromptTrigger('notification');
      setShowUnifiedLoginPage(true);
      return;
    }
    
    // 실제 알림 시스템이 구현되기 전까지는 빈 상태 메시지 표시
    alert('🔔 알림\n\n아직 새로운 알림이 없습니다.\n알림 기능이 곧 업데이트됩니다!');
  };

  const handleBookmarkClick = () => {
    console.log('북마크 버튼 클릭');
    
    if (!currentUser) {
      setLoginPromptTrigger('bookmark');
      setShowUnifiedLoginPage(true);
      return;
    }
    
    alert('📚 북마크한 게시물들을 확인하실 수 있습니다!\n저장된 유용한 정보들을 다시 찾아보세요.');
  };

  const renderHomeContent = () => {
    // 메인 탭에 따른 콘텐츠 렌더링
    switch (activeMainTab) {
      case 'home':
        return (
          <div className="pb-20 pt-4">
            <EventBannerList />
            <RecommendedContent 
              onPostClick={handlePostClick} 
              onLoginRequired={handleShowLoginPrompt}
            />
            <HotStories 
              onPostClick={handlePostClick}
              onLoginRequired={handleShowLoginPrompt} 
            />
            <ExpertContent />
          </div>
        );
      case 'latest':
        return (
          <div className="pb-20 pt-4">
            <CommunityFeed 
              onPostClick={handlePostClick}
              onLoginRequired={handleShowLoginPrompt}
            />
          </div>
        );
      case 'popular':
        return (
          <div className="pb-20 pt-4">
            <HotStories 
              onPostClick={handlePostClick}
              onLoginRequired={handleShowLoginPrompt}
            />
            <RecommendedContent 
              onPostClick={handlePostClick}
              onLoginRequired={handleShowLoginPrompt}
            />
          </div>
        );
      case 'video':
        return (
          <div className="pb-20 pt-4">
            <div className="px-4 py-6">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🎥</div>
                <p className="text-gray-600">영상 콘텐츠 기능이 곧 업데이트됩니다!</p>
              </div>
            </div>
          </div>
        );
      case 'expert':
        return (
          <div className="pb-20 pt-4">
            <ExpertContent />
          </div>
        );
      default:
        return (
          <div className="pb-20 pt-4">
            <div className="px-4 py-6">
              <p className="text-gray-600">곧 더 많은 콘텐츠로 찾아뵐게요.</p>
            </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    // 통합 로그인 유도 페이지가 활성화된 경우
    if (showUnifiedLoginPage) {
      return <UnifiedLoginPrompt 
        onClose={() => setShowUnifiedLoginPage(false)} 
        trigger={loginPromptTrigger} 
        isFullScreen={true}
      />;
    }

    // 글쓰기 페이지가 활성화된 경우
    if (showWritePage) {
      return <WritePost onClose={() => setShowWritePage(false)} />;
    }

    // 게시물 상세 페이지가 활성화된 경우
    if (currentPostId) {
      return <PostDetailPage 
        postId={currentPostId} 
        onBack={handleBackFromPostDetail} 
        onLoginRequired={handleShowLoginPrompt}
      />;
    }

    // 사이드 메뉴 페이지가 활성화된 경우
    if (currentSideMenuPage) {
      switch (currentSideMenuPage) {
        case 'profile-detail':
          return <ProfileDetailPage onBack={handleBackFromSideMenuPage} />;
        case 'settings':
          return <SettingsPage onBack={handleBackFromSideMenuPage} />;
        case 'support':
          return <SupportPage onBack={handleBackFromSideMenuPage} />;
        default:
          return null;
      }
    }

    // 관리자 페이지가 활성화된 경우
    if (currentAdminPage) {
      switch (currentAdminPage) {
        case 'user-management':
          return <UserManagement onBack={handleBackFromAdmin} />;
        case 'content-moderation':
          return <ContentModeration onBack={handleBackFromAdmin} />;
        case 'admin-settings':
          return <AdminSettings onBack={handleBackFromAdmin} />;
        default:
          return <AdminDashboard onBack={handleBackFromAdmin} onNavigate={handleAdminNavigate} />;
      }
    }

    // 카테고리 페이지가 활성화된 경우
    if (currentCategoryPage) {
      switch (currentCategoryPage) {
        case 'daily-boast':
          return <DailyBoastPage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        case 'curious-qa':
          return <CuriousQAPage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        case 'knowledge-wiki':
          return <KnowledgeWikiPage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        case 'product-review':
          return <ProductReviewPage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        case 'pet-places':
          return <PetPlacePage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        case 'photo-contest':
          return <PhotoContestPage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        case 'sharing-adoption':
          return <ShareAdoptionPage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        case 'group-challenge':
          return <GroupChallengePage onBack={handleBackFromCategoryPage} onWritePost={handleWritePost} onLoginRequired={handleShowLoginPrompt} />;
        default:
          return renderHomeContent();
      }
    }

    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'community':
        return <CommunityFeed 
          onPostClick={handlePostClick}
          onLoginRequired={handleShowLoginPrompt}
        />;
      case 'chat':
        return <ChatList />;
      case 'profile':
        return <UserProfile onRequestLogin={() => {
          setLoginPromptTrigger('profile');
          setShowUnifiedLoginPage(true);
        }} />;
      case 'admin':
        return <AdminDashboard onBack={() => setActiveTab('home')} onNavigate={handleAdminNavigate} />;
      default:
        return renderHomeContent();
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'write') {
      handleWritePost();
    } else if (tabId === 'home') {
      const currentTime = Date.now();
      
      // 사이드 메뉴 페이지에서 홈 버튼을 클릭한 경우 사이드 메뉴 페이지 종료
      if (currentSideMenuPage) {
        setCurrentSideMenuPage(null);
        setActiveTab('home');
        setLastHomeClickTime(currentTime);
        return;
      }

      // 카테고리 페이지에서 홈 버튼을 클릭한 경우 카테고리 페이지 종료
      if (currentCategoryPage) {
        setCurrentCategoryPage(null);
        setActiveTab('home');
        setLastHomeClickTime(currentTime);
        return;
      }

      // 관리자 페이지에서 홈 버튼을 클릭한 경우 관리자 페이지 종료
      if (currentAdminPage) {
        setCurrentAdminPage(null);
        setActiveTab('home');
        setLastHomeClickTime(currentTime);
        return;
      }

      // 로그인 페이지에서 홈 버튼을 클릭한 경우 로그인 페이지 종료
      if (showUnifiedLoginPage) {
        setShowUnifiedLoginPage(false);
        setActiveTab('home');
        setLastHomeClickTime(currentTime);
        return;
      }
      
      // 이미 홈 탭이 활성화되어 있는 경우
      if (activeTab === 'home') {
        // 500ms 이내에 두 번 클릭된 경우에만 카테고리를 홈으로 리셋
        if (currentTime - lastHomeClickTime <= 500) {
          setActiveCategory('home');
          setLastHomeClickTime(0); // 리셋 후 초기화
        } else {
          // 첫 번째 클릭: 시간만 기록하고 아무것도 하지 않음
          setLastHomeClickTime(currentTime);
        }
      } else {
        // 다른 탭에서 홈으로 이동하는 경우는 그대로 동작
        setActiveTab(tabId);
        setLastHomeClickTime(currentTime);
      }
    } else {
      // 사이드 메뉴 페이지에서 다른 탭으로 이동하는 경우 사이드 메뉴 페이지 종료
      if (currentSideMenuPage) {
        setCurrentSideMenuPage(null);
      }

      // 카테고리 페이지에서 다른 탭으로 이동하는 경우 카테고리 페이지 종료
      if (currentCategoryPage) {
        setCurrentCategoryPage(null);
      }

      // 관리자 페이지에서 다른 탭으로 이동하는 경우 관리자 페이지 종료
      if (currentAdminPage) {
        setCurrentAdminPage(null);
      }

      // 로그인 페이지에서 다른 탭으로 이동하는 경우 로그인 페이지 종료
      if (showUnifiedLoginPage) {
        setShowUnifiedLoginPage(false);
      }

      setActiveTab(tabId);
      setLastHomeClickTime(0); // 다른 탭 클릭 시 홈 클릭 시간 초기화
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Pretendard', sans-serif" }}>
      {/* 글쓰기 페이지나 카테고리 페이지, 게시물 상세 페이지, 관리자 페이지, 사이드 메뉴 페이지, 로그인 페이지가 아닐 때만 헤더 표시 */}
      {!showWritePage && !showUnifiedLoginPage && !currentCategoryPage && !currentPostId && !currentAdminPage && !currentSideMenuPage && (
        <Header 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onMenuClick={() => setShowSideMenu(true)}
          onCategoryButtonClick={handleCategoryButtonClick}
          onMainTabChange={handleMainTabChange}
          activeTab={activeTab}
          activeMainTab={activeMainTab}
          onNotificationClick={handleNotificationClick}
          onBookmarkClick={handleBookmarkClick}
          currentUser={currentUser}
        />
      )}
      
      <main className="min-h-screen">
        {renderContent()}
      </main>
      
      {/* 로그인 유도 카드 */}
      <LoginPromptCard
        isVisible={showLoginPromptCard}
        onClose={handleCloseLoginPromptCard}
        onLoginClick={handleLoginPromptCardClick}
        actionType={loginPromptCardAction}
      />

      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt
        isVisible={showInstallPrompt}
        onInstall={handleInstallPWA}
        onClose={handleCloseInstallPrompt}
      />
      
      {/* 글쓰기 플로팅 버튼 (홈, 커뮤니티에서만 표시, 글쓰기 페이지나 게시물 상세 페이지, 관리자 페이지, 사이드 메뉴 페이지, 로그인 페이지가 아닐 때만) */}
      {!showWritePage && !showUnifiedLoginPage && !currentPostId && !currentAdminPage && !currentSideMenuPage && (activeTab === 'home' || activeTab === 'community') && (
        <FloatingWriteButton onClick={handleWritePost} />
      )}

      {/* 사이드 메뉴 */}
      <SideMenu
        isOpen={showSideMenu}
        onClose={() => setShowSideMenu(false)}
        isLoggedIn={!!currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onSupportClick={handleSupportClick}
      />
      
      {/* 글쓰기 페이지나 게시물 상세 페이지, 관리자 페이지, 사이드 메뉴 페이지, 로그인 페이지가 아닐 때만 하단 네비게이션 표시 */}
      {!showWritePage && !showUnifiedLoginPage && !currentPostId && !currentAdminPage && !currentSideMenuPage && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}