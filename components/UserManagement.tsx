import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, MoreVertical, Shield, AlertTriangle, Ban, Eye } from 'lucide-react';

interface UserManagementProps {
  onBack: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'warned' | 'suspended' | 'banned';
  postsCount: number;
  reportsCount: number;
  lastActive: string;
}

export function UserManagement({ onBack }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [users] = useState<User[]>([
    {
      id: '1',
      name: '댕댕이사랑님',
      email: 'dogLover@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d3b8c3?w=100&h=100&fit=crop&crop=face',
      joinDate: '2024.03.15',
      status: 'active',
      postsCount: 34,
      reportsCount: 0,
      lastActive: '5분 전'
    },
    {
      id: '2',
      name: '냥이집사',
      email: 'catParent@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      joinDate: '2024.02.28',
      status: 'warned',
      postsCount: 12,
      reportsCount: 1,
      lastActive: '2시간 전'
    },
    {
      id: '3',
      name: '반려동물전문가',
      email: 'expert@petit.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      joinDate: '2024.01.10',
      status: 'active',
      postsCount: 89,
      reportsCount: 0,
      lastActive: '1일 전'
    },
    {
      id: '4',
      name: '문제사용자',
      email: 'problem@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      joinDate: '2024.07.20',
      status: 'suspended',
      postsCount: 5,
      reportsCount: 3,
      lastActive: '3일 전'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warned': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'banned': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성';
      case 'warned': return '경고';
      case 'suspended': return '정지';
      case 'banned': return '차단';
      default: return '알 수 없음';
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserAction = (action: string, userId: string) => {
    console.log(`사용자 ${userId}에 대한 ${action} 액션 실행`);
    // 실제 구현에서는 Firebase에서 사용자 상태 업데이트
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
              <h1 className="text-xl font-bold text-gray-900">사용자 관리</h1>
              <p className="text-sm text-gray-600">{filteredUsers.length}명의 사용자</p>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="p-4 pt-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="사용자 이름 또는 이메일로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: '전체' },
              { key: 'active', label: '활성' },
              { key: 'warned', label: '경고' },
              { key: 'suspended', label: '정지' },
              { key: 'banned', label: '차단' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filterStatus === filter.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="p-4 pb-20 space-y-3">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="bg-white rounded-xl p-4 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleUserClick(user)}
          >
            <div className="flex items-center space-x-3">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {getStatusText(user.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-400">가입: {user.joinDate}</span>
                  <span className="text-xs text-gray-400">게시물: {user.postsCount}</span>
                  <span className="text-xs text-gray-400">신고: {user.reportsCount}</span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* 사용자 상세 모달 */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">사용자 상세 정보</h2>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* 사용자 기본 정보 */}
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedUser.status)}`}>
                    {getStatusText(selectedUser.status)}
                  </span>
                </div>
              </div>

              {/* 활동 통계 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.postsCount}</p>
                  <p className="text-sm text-gray-600">작성한 게시물</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{selectedUser.reportsCount}</p>
                  <p className="text-sm text-gray-600">신고 받은 횟수</p>
                </div>
              </div>

              {/* 계정 정보 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">계정 정보</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">가입일</span>
                    <span className="font-medium">{selectedUser.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">마지막 활동</span>
                    <span className="font-medium">{selectedUser.lastActive}</span>
                  </div>
                </div>
              </div>

              {/* 관리 액션 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">관리 액션</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleUserAction('view_posts', selectedUser.id)}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                  >
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">게시물 보기</span>
                  </button>
                  
                  <button 
                    onClick={() => handleUserAction('warn', selectedUser.id)}
                    className="w-full flex items-center space-x-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors text-left"
                  >
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">경고 주기</span>
                  </button>

                  <button 
                    onClick={() => handleUserAction('suspend', selectedUser.id)}
                    className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left"
                  >
                    <Ban className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-900">계정 정지</span>
                  </button>

                  <button 
                    onClick={() => handleUserAction('promote', selectedUser.id)}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
                  >
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">관리자 권한 부여</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}