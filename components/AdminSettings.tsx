import React, { useState } from 'react';
import { ArrowLeft, Settings, Shield, Bell, Database, Download, Upload, Trash2, Users } from 'lucide-react';

interface AdminSettingsProps {
  onBack: () => void;
}

export function AdminSettings({ onBack }: AdminSettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoModerationEnabled, setAutoModerationEnabled] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleDataExport = () => {
    console.log('데이터 내보내기 시작');
    alert('사용자 데이터 내보내기를 시작합니다. 완료되면 이메일로 알려드리겠습니다.');
  };

  const handleDataImport = () => {
    console.log('데이터 가져오기');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('선택된 파일:', file.name);
        alert(`${file.name} 파일을 가져오는 중입니다...`);
      }
    };
    input.click();
  };

  const handleDataCleanup = () => {
    if (confirm('정말로 오래된 데이터를 정리하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('데이터 정리 시작');
      alert('30일 이상된 임시 데이터를 정리하는 중입니다...');
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
              <h1 className="text-xl font-bold text-gray-900">관리자 설정</h1>
              <p className="text-sm text-gray-600">시스템 설정 및 관리</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* 시스템 설정 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">시스템 설정</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">알림 서비스</p>
                <p className="text-sm text-gray-600">관리자 알림 활성화</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">자동 검열</p>
                <p className="text-sm text-gray-600">AI 기반 콘텐츠 자동 검열</p>
              </div>
              <button
                onClick={() => setAutoModerationEnabled(!autoModerationEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoModerationEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoModerationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">점검 모드</p>
                <p className="text-sm text-gray-600">서비스 임시 중단</p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 데이터 관리 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">데이터 관리</h2>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleDataExport}
              className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
            >
              <Download className="h-5 w-5 text-green-600" />
              <div>
                <span className="font-medium text-green-900 block">데이터 내보내기</span>
                <span className="text-sm text-green-700">사용자 및 게시물 데이터를 CSV로 내보냅니다</span>
              </div>
            </button>

            <button 
              onClick={handleDataImport}
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
            >
              <Upload className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-medium text-blue-900 block">데이터 가져오기</span>
                <span className="text-sm text-blue-700">외부 데이터를 시스템에 가져옵니다</span>
              </div>
            </button>

            <button 
              onClick={handleDataCleanup}
              className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left"
            >
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <span className="font-medium text-red-900 block">데이터 정리</span>
                <span className="text-sm text-red-700">오래된 임시 데이터를 삭제합니다</span>
              </div>
            </button>
          </div>
        </div>

        {/* 보안 설정 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">보안 설정</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">관리자 권한</span>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">활성</span>
              </div>
              <p className="text-sm text-gray-600">현재 계정은 최고 관리자 권한을 가지고 있습니다.</p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">보안 알림</span>
              </div>
              <p className="text-sm text-yellow-800">
                관리자 계정 보안을 위해 정기적으로 비밀번호를 변경해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* 시스템 정보 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">시스템 정보</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">앱 버전</span>
              <span className="font-medium">v1.2.3</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">데이터베이스</span>
              <span className="font-medium">Firebase Firestore</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">서버 상태</span>
              <span className="font-medium text-green-600">정상</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">마지막 백업</span>
              <span className="font-medium">2024.07.30 03:00</span>
            </div>
          </div>
        </div>

        {/* 위험 구역 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-900">위험 구역</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 mb-3">
                이 작업들은 되돌릴 수 없습니다. 신중하게 진행해주세요.
              </p>
              <button 
                onClick={() => {
                  if (confirm('정말로 모든 캐시 데이터를 삭제하시겠습니까?')) {
                    alert('캐시 데이터를 삭제하는 중입니다...');
                  }
                }}
                className="w-full p-3 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg transition-colors font-medium"
              >
                모든 캐시 데이터 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}