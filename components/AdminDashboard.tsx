import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, AlertTriangle, TrendingUp, Calendar, Settings, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminDashboardProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  reportedContent: number;
  activeEvents: number;
  todayNewUsers: number;
  todayNewPosts: number;
}

export function AdminDashboard({ onBack, onNavigate }: AdminDashboardProps) {
  const { currentUser, isAdmin, userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    totalPosts: 3856,
    reportedContent: 8,
    activeEvents: 2,
    todayNewUsers: 23,
    todayNewPosts: 45
  });

  const [recentActivities] = useState([
    {
      id: '1',
      type: 'new_user',
      message: '새 사용자 가입: 댕댕이사랑님',
      time: '5분 전',
      icon: Users
    },
    {
      id: '2',
      type: 'report',
      message: '게시물 신고: 부적절한 내용',
      time: '15분 전',
      icon: AlertTriangle
    },
    {
      id: '3',
      type: 'new_post',
      message: '새 게시물: 포토 콘테스트 카테고리',
      time: '32분 전',
      icon: FileText
    },
    {
      id: '4',
      type: 'event',
      message: '이벤트 종료: Petit 여름 페스티벌',
      time: '1시간 전',
      icon: Calendar
    }
  ]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-sm w-full">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">접근 권한 없음</h2>
          <p className="text-gray-600 mb-4">관리자 권한이 필요한 페이지입니다.</p>
          <p className="text-sm text-gray-500 mb-6">
            현재 로그인: {currentUser?.email || '로그인하지 않음'}
          </p>
          <button 
            onClick={onBack}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-sm text-gray-600">
                관리자: {userProfile?.nickname || userProfile?.displayName || '관리자'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('admin-settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* 통계 카드들 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">전체 사용자</p>
                <p className="text-xs text-green-600">+{stats.todayNewUsers} 오늘</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts.toLocaleString()}</p>
                <p className="text-sm text-gray-600">전체 게시물</p>
                <p className="text-xs text-green-600">+{stats.todayNewPosts} 오늘</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.reportedContent}</p>
                <p className="text-sm text-gray-600">신고된 콘텐츠</p>
                <p className="text-xs text-red-600">처리 필요</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
                <p className="text-sm text-gray-600">진행중 이벤트</p>
                <p className="text-xs text-gray-500">관리 중</p>
              </div>
            </div>
          </div>
        </div>

        {/* 빠른 액션 버튼들 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="text-lg font-bold text-gray-900 mb-4">빠른 관리</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onNavigate('user-management')}
              className="flex items-center space-x-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors text-left"
            >
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium text-gray-900">사용자 관리</p>
                <p className="text-sm text-gray-600">회원 정보 및 제재</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('content-moderation')}
              className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left"
            >
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">콘텐츠 관리</p>
                <p className="text-sm text-gray-600">신고 및 검토</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('event-management')}
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
            >
              <Calendar className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">이벤트 관리</p>
                <p className="text-sm text-gray-600">이벤트 생성/수정</p>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('analytics')}
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
            >
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">통계 분석</p>
                <p className="text-sm text-gray-600">활동 및 트렌드</p>
              </div>
            </button>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="text-lg font-bold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'report' ? 'bg-red-100' :
                    activity.type === 'new_user' ? 'bg-primary/10' :
                    activity.type === 'new_post' ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}>
                    <IconComponent className={`h-4 w-4 ${
                      activity.type === 'report' ? 'text-red-600' :
                      activity.type === 'new_user' ? 'text-primary' :
                      activity.type === 'new_post' ? 'text-blue-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 시스템 상태 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <h2 className="text-lg font-bold text-gray-900 mb-4">시스템 상태</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Firebase 서비스</span>
              </div>
              <span className="text-sm text-green-600">정상</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">이미지 서버</span>
              </div>
              <span className="text-sm text-green-600">정상</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">알림 서비스</span>
              </div>
              <span className="text-sm text-yellow-600">점검중</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}