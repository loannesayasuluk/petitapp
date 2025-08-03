import React from 'react';
import { X, User, Settings, HelpCircle, LogIn, LogOut } from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onSupportClick?: () => void;
}

export function SideMenu({ 
  isOpen, 
  onClose, 
  isLoggedIn, 
  onLogin, 
  onLogout,
  onProfileClick,
  onSettingsClick,
  onSupportClick 
}: SideMenuProps) {
  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* 사이드 메뉴 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary">Petit</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">펫띠 유저</p>
                    <p className="text-sm text-gray-600">user@petit.com</p>
                  </div>
                </div>
                
                <button 
                  onClick={onProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span>내 프로필</span>
                </button>
                
                <button 
                  onClick={onSettingsClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>설정</span>
                </button>
                
                <button 
                  onClick={onSupportClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span>고객센터</span>
                </button>
                
                <hr className="my-4" />
                
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onLogin}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <LogIn className="w-5 h-5 text-gray-600" />
                  <span>로그인</span>
                </button>
                
                <button 
                  onClick={onSupportClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span>고객센터</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}