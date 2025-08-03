import React from 'react';
import { ArrowLeft, User, Calendar, MapPin, Mail, Phone, Edit3, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileDetailPageProps {
  onBack: () => void;
}

export function ProfileDetailPage({ onBack }: ProfileDetailPageProps) {
  const { currentUser, userProfile } = useAuth();

  const handleEditProfile = () => {
    alert('📝 프로필 편집 기능이 곧 업데이트됩니다!\n\n편집 가능한 항목:\n• 닉네임\n• 프로필 사진\n• 자기소개\n• 위치 정보\n• 반려동물 정보');
  };

  const handleChangeProfilePhoto = () => {
    alert('📷 프로필 사진 변경 기능이 곧 업데이트됩니다!\n\n• 갤러리에서 선택\n• 카메라로 촬영\n• 기본 이미지로 변경');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">내 프로필</h1>
          </div>
          <button
            onClick={handleEditProfile}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Edit3 className="w-4 h-4" />
            <span>편집</span>
          </button>
        </div>
      </div>

      {/* 프로필 콘텐츠 */}
      <div className="p-4">
        {/* 프로필 헤더 */}
        <div className="bg-card rounded-xl p-6 mb-4">
          <div className="flex flex-col items-center text-center">
            {/* 프로필 이미지 */}
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                {userProfile?.photoURL ? (
                  <img 
                    src={userProfile.photoURL} 
                    alt="프로필" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-foreground" />
                )}
              </div>
              <button
                onClick={handleChangeProfilePhoto}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-card hover:bg-primary/90"
              >
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>

            {/* 기본 정보 */}
            <h2 className="text-xl font-semibold mb-1">
              {userProfile?.displayName || currentUser?.displayName || '펫띠 유저'}
            </h2>
            <p className="text-muted-foreground mb-2">
              @{userProfile?.nickname || userProfile?.displayName || '펫띠유저'}
            </p>
            {userProfile?.bio && (
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                {userProfile.bio}
              </p>
            )}

            {/* 통계 */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="font-semibold text-lg">{userProfile?.postsCount || 0}</div>
                <div className="text-xs text-muted-foreground">게시물</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{userProfile?.followersCount || 0}</div>
                <div className="text-xs text-muted-foreground">팔로워</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{userProfile?.followingCount || 0}</div>
                <div className="text-xs text-muted-foreground">팔로잉</div>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="bg-card rounded-xl p-4 mb-4">
          <h3 className="font-semibold mb-4">개인 정보</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">이메일</div>
                <div>{currentUser?.email || '등록된 이메일이 없습니다'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">가입일</div>
                <div>
                  {userProfile?.createdAt 
                    ? new Date(userProfile.createdAt.toDate?.() || userProfile.createdAt).toLocaleDateString('ko-KR')
                    : '정보 없음'
                  }
                </div>
              </div>
            </div>

            {userProfile?.location && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">위치</div>
                  <div>{userProfile.location}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 관리자 배지 */}
        {userProfile?.isAdmin && (
          <div className="bg-primary/10 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="font-medium text-primary">관리자</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Petit 커뮤니티 관리자입니다
            </p>
          </div>
        )}

        {/* 활동 내역 */}
        <div className="bg-card rounded-xl p-4">
          <h3 className="font-semibold mb-4">활동 내역</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <span>내가 쓴 게시물</span>
              <span className="text-muted-foreground">{userProfile?.postsCount || 0}개</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <span>좋아요한 게시물</span>
              <span className="text-muted-foreground">0개</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <span>댓글 수</span>
              <span className="text-muted-foreground">0개</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span>북마크</span>
              <span className="text-muted-foreground">0개</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}