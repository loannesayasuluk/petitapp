import React, { useState } from 'react';
import { X, Camera, MapPin, Upload, Trash2 } from 'lucide-react';
import { uploadImage, createPost } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface WritePostProps {
  onClose: () => void;
}

export function WritePost({ onClose }: WritePostProps) {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [petInfo, setPetInfo] = useState({
    petName: '',
    petType: '',
    petBreed: ''
  });

  const { currentUser } = useAuth();

  const categories = [
    '일상 자랑',
    '궁금 Q&A',
    '용품 리뷰',
    '건강 정보',
    '훈련 팁',
    '기타',
  ];

  const petTypes = ['강아지', '고양이', '햄스터', '토끼', '새', '파충류', '기타'];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // 최대 4개 이미지만 선택 가능
    const remainingSlots = 4 - selectedImages.length;
    const newFiles = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`최대 4개의 사진만 업로드할 수 있습니다.`);
    }

    // 이미지 미리보기 생성
    const newPreviewUrls: string[] = [];
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewUrls.push(e.target?.result as string);
        if (newPreviewUrls.length === newFiles.length) {
          setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      alert('로그인이 필요합니다!');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }

    if (!selectedCategory) {
      alert('카테고리를 선택해주세요!');
      return;
    }

    setUploading(true);

    try {
      console.log('게시물 작성 시작:', {
        content: content.substring(0, 50) + '...',
        category: selectedCategory,
        imageCount: selectedImages.length,
        petInfo
      });

      // 이미지 업로드
      const imageUrls: string[] = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        console.log(`이미지 업로드 중 ${i + 1}/${selectedImages.length}: ${image.name}`);
        const fileName = `posts/${currentUser.uid}/${Date.now()}_${image.name}`;
        const imageUrl = await uploadImage(image, fileName);
        imageUrls.push(imageUrl);
        console.log(`이미지 업로드 완료 ${i + 1}/${selectedImages.length}: ${imageUrl}`);
      }

      // 게시물 생성
      const postData = {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email?.split('@')[0] || '익명',
        authorAvatar: currentUser.photoURL || '',
        content: content.trim(),
        imageUrls,
        category: selectedCategory,
        petType: petInfo.petType || undefined,
        petName: petInfo.petName || undefined,
        petBreed: petInfo.petBreed || undefined,
        likes: [],
        likesCount: 0,
        commentsCount: 0
      };

      console.log('Firebase에 게시물 저장 중...', postData);
      const postId = await createPost(postData);
      console.log('게시물 저장 완료! ID:', postId);
      
      alert(`게시물이 성공적으로 작성되었습니다! 🎉\n사진 ${imageUrls.length}개 포함`);
      onClose();
    } catch (error) {
      console.error('게시물 작성 오류:', error);
      alert(`게시물 작성에 실패했습니다.\n오류: ${error.message}\n다시 시도해주세요.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">글쓰기</h1>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            uploading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-600'
          }`}
        >
          {uploading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>업로드 중...</span>
            </div>
          ) : (
            '게시'
          )}
        </button>
      </div>

      {/* 내용 */}
      <div className="p-4">
        {/* 카테고리 선택 */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">카테고리</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 반려동물 정보 입력 */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">반려동물 정보 (선택사항)</p>
          <div className="grid grid-cols-1 gap-2">
            <select
              value={petInfo.petType}
              onChange={(e) => setPetInfo(prev => ({ ...prev, petType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
            >
              <option value="">반려동물 종류 선택</option>
              {petTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={petInfo.petName}
                onChange={(e) => setPetInfo(prev => ({ ...prev, petName: e.target.value }))}
                placeholder="이름 (예: 뽀둥이)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              />
              <input
                type="text"
                value={petInfo.petBreed}
                onChange={(e) => setPetInfo(prev => ({ ...prev, petBreed: e.target.value }))}
                placeholder="품종 (예: 골든리트리버)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              />
            </div>
          </div>
        </div>

        {/* 텍스트 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="반려동물과의 특별한 순간을 공유해보세요!"
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
        />

        {/* 선택된 이미지 미리보기 */}
        {imagePreviewUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">선택된 사진</p>
            <div className="grid grid-cols-2 gap-2">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`선택된 사진 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추가 옵션 */}
        <div className="mt-4 flex space-x-4">
          <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Camera className="w-4 h-4" />
            <span>사진 {selectedImages.length > 0 && `(${selectedImages.length}/4)`}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={selectedImages.length >= 4}
            />
          </label>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <MapPin className="w-4 h-4" />
            <span>위치</span>
          </button>
        </div>
      </div>
    </div>
  );
}