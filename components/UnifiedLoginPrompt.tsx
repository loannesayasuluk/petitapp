import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, checkEmailAvailability } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface UnifiedLoginPromptProps {
  onClose: () => void;
  trigger: 'notification' | 'bookmark' | 'write' | 'profile' | 'general';
  isFullScreen?: boolean;
}

export function UnifiedLoginPrompt({ onClose, trigger, isFullScreen = false }: UnifiedLoginPromptProps) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    nickname: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    nickname: '',
    general: ''
  });
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({ checked: false, available: false, message: '' });
  const { login } = useAuth();

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'notification':
        return {
          title: '알림을 확인하려면 로그인하세요',
          description: '회원님의 알림과 소식을 놓치지 마세요!'
        };
      case 'bookmark':
        return {
          title: '북마크를 사용하려면 로그인하세요',
          description: '유용한 게시물을 저장하고 언제든 다시 확인하세요!'
        };
      case 'write':
        return {
          title: '글을 작성하려면 로그인하세요',
          description: '펫 커뮤니티에 소중한 이야기를 공유해보세요!'
        };
      case 'profile':
        return {
          title: '프로필을 보려면 로그인하세요',
          description: '개인화된 펫 라이프를 경험해보세요!'
        };
      default:
        return {
          title: 'Petit에 로그인하세요',
          description: '반려동물과 함께하는 특별한 경험을 시작하세요!'
        };
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '', displayName: '', nickname: '' });
    setErrors({ email: '', password: '', confirmPassword: '', displayName: '', nickname: '', general: '' });
    setShowPassword(false);
    setEmailCheckResult({ checked: false, available: false, message: '' });
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '', confirmPassword: '', displayName: '', nickname: '', general: '' };
    let isValid = true;

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
      isValid = false;
    } else if (isSignUp && (!emailCheckResult.checked || !emailCheckResult.available)) {
      newErrors.email = '이메일 중복 확인을 해주세요.';
      isValid = false;
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (isSignUp && formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
      isValid = false;
    }

    // 회원가입 시 비밀번호 확인 검증
    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        isValid = false;
      }
    }

    // 회원가입 시 이름 검증
    if (isSignUp && !formData.displayName.trim()) {
      newErrors.displayName = '이름을 입력해주세요.';
      isValid = false;
    }

    // 회원가입 시 닉네임 검증
    if (isSignUp && !formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      isValid = false;
    } else if (isSignUp && formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다.';
      isValid = false;
    } else if (isSignUp && formData.nickname.length > 20) {
      newErrors.nickname = '닉네임은 20자 이하여야 합니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, general: '' }));

      let user;
      if (isSignUp) {
        user = await signUpWithEmail(formData.email, formData.password, formData.displayName, formData.nickname);
      } else {
        user = await signInWithEmail(formData.email, formData.password);
      }

      if (user) {
        await login(user);
        resetForm();
        onClose();
      }
    } catch (error: any) {
      let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = '등록되지 않은 이메일입니다.';
          break;
        case 'auth/wrong-password':
          errorMessage = '비밀번호가 올바르지 않습니다.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = '이미 사용 중인 이메일입니다.';
          break;
        case 'auth/weak-password':
          errorMessage = '비밀번호가 너무 약합니다. 6자 이상 입력해주세요.';
          break;
        case 'auth/invalid-email':
          errorMessage = '올바르지 않은 이메일 형식입니다.';
          break;
        case 'auth/too-many-requests':
          errorMessage = '너무 많은 시도입니다. 잠시 후 다시 시도해주세요.';
          break;
        case 'auth/invalid-credential':
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
      }
      
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, general: '' }));
      
      const user = await signInWithGoogle();
      if (user) {
        await login(user);
        resetForm();
        onClose();
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: '구글 로그인에 실패했습니다. 다시 시도해주세요.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleNaverLogin = () => {
    alert('네이버 로그인은 현재 준비 중입니다. 구글 로그인 또는 이메일 로그인을 이용해주세요.');
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  // 샘플 사용자 계정 자동 입력 (개발용)
  const fillSampleAccount = (accountType: string) => {
    const accounts = {
      'admin': {
        displayName: '관리자',
        nickname: '관리자',
        email: 'winia1370@gmail.com',
        password: 'eoqusdsl0823!'
      },
      'sample1': {
        displayName: '펫띠사용자1',
        nickname: '강아지사랑',
        email: 'sample1@example.com',
        password: 'sample123!'
      },
      'sample2': {
        displayName: '펫띠사용자2',
        nickname: '고양이집사',
        email: 'sample2@example.com',
        password: 'sample123!'
      },
      'tester': {
        displayName: '테스터',
        nickname: '테스터',
        email: 'tester@petitapp.com',
        password: 'test123!'
      }
    };

    const account = accounts[accountType];
    if (account) {
      setFormData({
        displayName: account.displayName,
        nickname: account.nickname,
        email: account.email,
        password: account.password,
        confirmPassword: account.password
      });
      setIsSignUp(false); // 로그인 모드로 설정
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailAuth();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'email') {
      setEmailCheckResult({ checked: false, available: false, message: '' });
    }

    if (field === 'confirmPassword' && isSignUp) {
      if (value && formData.password && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      } else if (value && formData.password && value === formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (field === 'password' && isSignUp && formData.confirmPassword) {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요.' }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: '올바른 이메일 형식을 입력해주세요.' }));
      return;
    }

    try {
      setEmailChecking(true);
      setErrors(prev => ({ ...prev, email: '' }));
      
      const isAvailable = await checkEmailAvailability(formData.email);
      
      if (isAvailable) {
        setEmailCheckResult({
          checked: true,
          available: true,
          message: '사용 가능한 이메일입니다.'
        });
      } else {
        setEmailCheckResult({
          checked: true,
          available: false,
          message: '이미 사용 중인 이메일입니다.'
        });
      }
    } catch (error: any) {
      setEmailCheckResult({
        checked: false,
        available: false,
        message: error.message || '이메일 확인 중 오류가 발생했습니다.'
      });
    } finally {
      setEmailChecking(false);
    }
  };

  const triggerInfo = getTriggerMessage();

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${isFullScreen ? 'bg-background' : ''}`}>
      <div className={`bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto ${isFullScreen ? 'max-w-lg' : ''}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {triggerInfo.title}
            </h2>
            <p className="text-sm text-gray-600">
              {triggerInfo.description}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {/* 개발용 계정 자동 입력 버튼들 */}
            <div className="flex space-x-1">
              <button
                onClick={() => fillSampleAccount('admin')}
                className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                title="관리자 계정"
              >
                👑
              </button>
              <button
                onClick={() => fillSampleAccount('sample1')}
                className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                title="샘플계정1"
              >
                🐕
              </button>
              <button
                onClick={() => fillSampleAccount('sample2')}
                className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                title="샘플계정2"
              >
                🐱
              </button>
              <button
                onClick={() => fillSampleAccount('tester')}
                className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                title="테스터 계정"
              >
                🧪
              </button>
            </div>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 일반 오류 메시지 */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* 이메일 로그인/회원가입 폼 */}
        <div className="space-y-4 mb-6">
          {/* 이름 입력 (회원가입 시에만) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="실명을 입력해주세요"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.displayName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.displayName && (
                <p className="text-sm text-red-600 mt-1">{errors.displayName}</p>
              )}
            </div>
          )}

          {/* 닉네임 입력 (회원가입 시에만) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="앱에서 사용할 닉네임을 입력해주세요"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.nickname ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.nickname && (
                <p className="text-sm text-red-600 mt-1">{errors.nickname}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                * 이 닉네임으로 앱 내에서 표시됩니다 (2-20자)
              </p>
            </div>
          )}

          {/* 이메일 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="이메일을 입력해주세요"
                className={`w-full pl-10 ${isSignUp ? 'pr-20' : 'pr-4'} py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? 'border-red-300' : 
                  emailCheckResult.checked && emailCheckResult.available ? 'border-green-300' :
                  emailCheckResult.checked && !emailCheckResult.available ? 'border-red-300' :
                  'border-gray-300'
                }`}
              />
              {isSignUp && (
                <button
                  type="button"
                  onClick={handleEmailCheck}
                  disabled={emailChecking || !formData.email}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {emailChecking ? '확인중...' : '중복확인'}
                </button>
              )}
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
            {isSignUp && emailCheckResult.message && (
              <p className={`text-sm mt-1 ${
                emailCheckResult.available ? 'text-green-600' : 'text-red-600'
              }`}>
                {emailCheckResult.message}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isSignUp ? '6자 이상 입력해주세요' : '비밀번호를 입력해주세요'}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 입력 (회원가입 시에만) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.confirmPassword ? 'border-red-300' : 
                    formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-300' :
                    'border-gray-300'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-sm text-green-600 mt-1">비밀번호가 일치합니다.</p>
              )}
            </div>
          )}

          {/* 이메일 로그인/회원가입 버튼 */}
          <button 
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <span>{isSignUp ? '회원가입' : '로그인'}</span>
            )}
          </button>

          {/* 로그인/회원가입 모드 전환 */}
          <div className="text-center">
            <button
              onClick={toggleAuthMode}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </div>
        </div>

        {/* 구분선 */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-sm text-gray-500">또는</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        
        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-3">
          <button 
            onClick={handleNaverLogin}
            className="w-full bg-[#03C75A] text-white py-3 rounded-lg font-medium hover:bg-[#02B351] transition-colors"
          >
            네이버로 로그인
          </button>
          
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>구글로 로그인</span>
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          {isSignUp ? '회원가입 시' : '로그인 시'} 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}