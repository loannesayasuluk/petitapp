import { collection, addDoc, getDocs, query, where, limit, serverTimestamp, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

// 카테고리별 샘플 데이터 생성 및 업로드 함수
export const createCategorySampleData = async () => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, cannot create sample data');
    return;
  }

  try {
    // 나눔/분양 카테고리 샘플 데이터
    const shareAdoptionPosts = [
      {
        authorId: 'sample_user_1',
        authorName: '사랑이맘',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d3b8c3?w=100&h=100&fit=crop&crop=face',
        content: '우리 강아지가 새끼를 낳았어요! 건강한 아기들이 7마리나 태어났는데, 좋은 가족을 찾고 있습니다. 골든리트리버 믹스로 아주 순하고 사랑스러운 아이들이에요. 직접 보러 오시면 더 자세한 설명 드릴게요!',
        imageUrls: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop'],
        category: '나눔/분양',
        petType: '강아지',
        petName: '골든이의 새끼들',
        petBreed: '골든리트리버 믹스',
        likes: ['user1', 'user2', 'user3'],
        likesCount: 23,
        commentsCount: 8,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        authorId: 'sample_user_2',
        authorName: '냥이아빠',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        content: '사료와 간식 나눔해요! 우리 고양이가 알레르기 때문에 못 먹게 된 사료들이 많이 남았어요. 로얄캐닌 헤어볼 케어 4kg, 힐스 사이언스 2kg 포함해서 총 10kg 정도 됩니다. 유통기한도 넉넉하고 모두 미개봉 상태예요.',
        imageUrls: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop'],
        category: '나눔/분양',
        petType: '고양이',
        petName: '나비',
        petBreed: '러시안블루',
        likes: ['user4', 'user5'],
        likesCount: 15,
        commentsCount: 12,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        authorId: 'sample_user_3',
        authorName: '토끼사랑',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        content: '토끼 케이지와 용품들 무료로 나눔합니다! 이사 가게 되어서 키우던 토끼를 친척집에 보내게 되었어요. 거의 새것같은 2층 케이지, 급수기, 사료통, 장난감 등 한번에 가져가실 분 찾아요.',
        imageUrls: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop'],
        category: '나눔/분양',
        petType: '기타',
        petName: '하늘이',
        petBreed: '홀랜드 롭',
        likes: ['user6', 'user7', 'user8', 'user9'],
        likesCount: 31,
        commentsCount: 6,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // 포토 콘테스트 카테고리 샘플 데이터
    const photoContestPosts = [
      {
        authorId: 'sample_user_4',
        authorName: '포토마스터',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        content: '가장 귀여운 잠자는 모습 콘테스트에 참가합니다! 우리 댕댕이가 소파에서 자는 모습이 너무 귀여워서 찍었어요. 혀가 살짝 나온게 포인트 ㅎㅎ 많은 투표 부탁드려요!',
        imageUrls: ['https://images.unsplash.com/photo-1552053171-e6e6d4e43495?w=400&h=300&fit=crop'],
        category: '포토 콘테스트',
        petType: '강아지',
        petName: '초코',
        petBreed: '리트리버',
        likes: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
        likesCount: 47,
        commentsCount: 15,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        authorId: 'sample_user_5',
        authorName: '냥이러버',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
        content: '반려동물과 함께하는 일상 콘테스트 참가! 아침마다 저와 함께 요가하는 우리 고양이예요. 정말 신기하게도 제가 스트레칭하면 따라서 쭉쭉 늘어나더라구요 ㅋㅋ',
        imageUrls: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop'],
        category: '포토 콘테스트',
        petType: '고양이',
        petName: '요가',
        petBreed: '먼치킨',
        likes: ['user9', 'user10', 'user11', 'user12'],
        likesCount: 35,
        commentsCount: 9,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        authorId: 'sample_user_6',
        authorName: '햄스터집사',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        content: '겨울 패션쇼 콘테스트! 우리 햄스터에게 미니 목도리를 만들어줬어요. 5분만 착용하고 바로 벗겨줬는데 그 사이에 찍은 소중한 ��� 장! 너�� 귀엽지 않나요?',
        imageUrls: ['https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop'],
        category: '포토 콘테스트',
        petType: '기타',
        petName: '도토리',
        petBreed: '골든햄스터',
        likes: ['user13', 'user14', 'user15'],
        likesCount: 28,
        commentsCount: 11,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // 그룹 챌린지 카테고리 샘플 데이터
    const groupChallengePosts = [
      {
        authorId: 'sample_user_7',
        authorName: '산책러버',
        authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face',
        content: '매일 산책하기 30일 챌린지 15일차 인증! 오늘도 우리 멍뭉이와 함께 한강공원을 걸었어요. 날씨가 좋아서 더 오래 걸었네요. 함께 챌린지 하고 계신 분들 화이팅!',
        imageUrls: ['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop'],
        category: '그룹 챌린지',
        petType: '강아지',
        petName: '바둑이',
        petBreed: '시바견',
        likes: ['user1', 'user3', 'user5', 'user7'],
        likesCount: 42,
        commentsCount: 18,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        authorId: 'sample_user_8',
        authorName: '건강지킴이',
        authorAvatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face',
        content: '건강체중 만들기 챌린지 진행 중! 우리 고양이가 다이어트를 시작한지 2주째예요. 체중계 위에 올라가는 것도 이제 익숙해졌네요 ㅎㅎ 목표까지 1kg 더 가자!',
        imageUrls: ['https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=300&fit=crop'],
        category: '그룹 챌린지',
        petType: '고양이',
        petName: '통통이',
        petBreed: '브리티시숏헤어',
        likes: ['user2', 'user4', 'user6'],
        likesCount: 29,
        commentsCount: 7,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        authorId: 'sample_user_9',
        authorName: '훈련사',
        authorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face',
        content: '새로운 기술 배우기 챌린지! 우리 강아지가 드디어 하이파이브를 배웠어요! 3주 동안 꾸준히 연습한 결과입니다. 다음 목표는 돌기인데 과연 성공할 수 있을까요?',
        imageUrls: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'],
        category: '그룹 챌린지',
        petType: '강아지',
        petName: '루피',
        petBreed: '보더콜리',
        likes: ['user8', 'user9', 'user10', 'user11', 'user12'],
        likesCount: 38,
        commentsCount: 13,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // 모든 샘플 데이터를 Firebase에 업로드
    const allSamplePosts = [...shareAdoptionPosts, ...photoContestPosts, ...groupChallengePosts];
    
    let successCount = 0;
    
    for (const postData of allSamplePosts) {
      try {
        const postsRef = collection(db, 'posts');
        await addDoc(postsRef, postData);
        successCount++;
      } catch (error) {
        console.error('샘플 포스트 생성 오류:', error);
      }
    }
    
    console.log(`✅ 샘플 포스트 ${successCount}개 생성 완료`);
    return true;
  } catch (error) {
    console.error('Error creating category sample data:', error);
    return false;
  }
};

// 샘플 데이터가 이미 존재하는지 확인하는 함수
export const checkSampleDataExists = async (): Promise<boolean> => {
  try {
    if (!isFirebaseConfigured()) {
      return false;
    }

    // 각 카테고리별로 최소 1개씩 데이터가 있는지 확인
    const categories = ['나눔/분양', '포토 콘테스트', '그룹 챌린지'];
    
    for (const category of categories) {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('category', '==', category), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log(`❌ No sample data found for category: ${category}`);
        return false;
      }
    }
    
    console.log('✅ Sample data exists for all categories');
    return true;
  } catch (error) {
    console.error('Error checking sample data:', error);
    return false;
  }
};

// 샘플 사용자 데이터 생성 함수
export const createSampleUsers = async () => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, cannot create sample users');
    return;
  }

  try {
    // 다양한 가입 시점을 가진 사용자들 생성
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const sampleUsers = [
      // 새로운 관리자 계정 (winia1370@gmail.com)
      {
        uid: 'admin_user_winia1370',
        displayName: '관리자',
        nickname: '관리자',
        email: 'winia1370@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: 'Petit 앱 관리자입니다.',
        location: '서울',
        createdAt: Timestamp.fromDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * 30)), // 30일 전
        updatedAt: Timestamp.fromDate(new Date()),
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        isAdmin: true
      },
      // 기존 관리자 계정을 일반 사용자로 전환 (ahncsjyw@naver.com)
      {
        uid: 'former_admin_user_ahncsjyw',
        displayName: '전연우',
        nickname: '관리자 요한',
        email: 'ahncsjyw@naver.com',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: '반려동물을 사랑하는 일반 사용자입니다.',
        location: '서울',
        createdAt: Timestamp.fromDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * 60)), // 60일 전
        updatedAt: Timestamp.fromDate(new Date()),
        postsCount: 5,
        followersCount: 12,
        followingCount: 8,
        isAdmin: false
      },
      // 오늘 가입한 사용자들 (3명)
      {
        uid: 'sample_user_today_1',
        displayName: '새로운반려인',
        nickname: '새로운반려인',
        email: 'new1@example.com',
        photoURL: 'https://images.unsplash.com/photo-1494790108755-2616c6d3b8c3?w=100&h=100&fit=crop&crop=face',
        bio: '오늘 가입했어요! 반가워요!',
        location: '서울',
        createdAt: Timestamp.fromDate(new Date(today.getTime() + 1000 * 60 * 60 * 8)), // 오늘 오전 8시
        updatedAt: Timestamp.fromDate(new Date(today.getTime() + 1000 * 60 * 60 * 8)),
        postsCount: 0,
        followersCount: 2,
        followingCount: 5,
        isAdmin: false
      },
      {
        uid: 'sample_user_today_2',
        displayName: '댕댕이사랑',
        nickname: '댕댕이사랑',
        email: 'puppy@example.com',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: '강아지 키우기 시작했어요',
        location: '부산',
        createdAt: Timestamp.fromDate(new Date(today.getTime() + 1000 * 60 * 60 * 14)), // 오늘 오후 2시
        updatedAt: Timestamp.fromDate(new Date(today.getTime() + 1000 * 60 * 60 * 14)),
        postsCount: 1,
        followersCount: 0,
        followingCount: 3,
        isAdmin: false
      },
      {
        uid: 'sample_user_today_3',
        displayName: '냥이집사',
        nickname: '냥이집사',
        email: 'cat@example.com',
        photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        bio: '고양이 3마리 집사입니다',
        location: '대구',
        createdAt: Timestamp.fromDate(new Date(today.getTime() + 1000 * 60 * 60 * 16)), // 오늘 오후 4시
        updatedAt: Timestamp.fromDate(new Date(today.getTime() + 1000 * 60 * 60 * 16)),
        postsCount: 0,
        followersCount: 1,
        followingCount: 7,
        isAdmin: false
      },
      // 어제 가입한 사용자들 (3명)
      {
        uid: 'sample_user_yesterday_1',
        displayName: '어제가입자',
        nickname: '어제가입자',
        email: 'yesterday@example.com',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: '어제 가입했어요',
        location: '인천',
        createdAt: Timestamp.fromDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 10)), // 어제 오전 10시
        updatedAt: Timestamp.fromDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 10)),
        postsCount: 2,
        followersCount: 5,
        followingCount: 8,
        isAdmin: false
      },
      // 기존 사용자들 (더 많은 수를 위해)
      ...Array.from({ length: 20 }, (_, i) => ({
        uid: `sample_user_old_${i + 1}`,
        displayName: `반려인${i + 1}`,
        nickname: `반려인${i + 1}`,
        email: `user${i + 1}@example.com`,
        photoURL: `https://images.unsplash.com/photo-${1494790108755 + i}?w=100&h=100&fit=crop&crop=face`,
        bio: `반려동물과 함께한지 ${i + 1}년째`,
        location: ['서울', '부산', '대구', '인천', '광주', '대전', '울산'][i % 7],
        createdAt: Timestamp.fromDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * (i + 2))), // 2일 전부터 차례로
        updatedAt: Timestamp.fromDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * (i + 2))),
        postsCount: Math.floor(Math.random() * 10),
        followersCount: Math.floor(Math.random() * 50),
        followingCount: Math.floor(Math.random() * 30),
        isAdmin: false
      }))
    ];

    let adminCount = 0;
    let userCount = 0;
    
    for (const userData of sampleUsers) {
      try {
        const userRef = doc(db, 'users', userData.uid);
        await setDoc(userRef, userData);
        if (userData.isAdmin) {
          adminCount++;
        } else {
          userCount++;
        }
      } catch (error) {
        console.error('사용자 프로필 생성 오류:', error);
      }
    }
    
    console.log(`✅ 사용자 프로필 생성 완료: 관리자 ${adminCount}명, 일반사용자 ${userCount}명`);
    return true;
  } catch (error) {
    console.error('Error creating sample users:', error);
    return false;
  }
};

// 샘플 사용자가 이미 존재하는지 확인하는 함수
export const checkSampleUsersExist = async (): Promise<boolean> => {
  try {
    if (!isFirebaseConfigured()) {
      return false;
    }

    // 새로운 관리자 계정이 있는지 확인
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', 'winia1370@gmail.com'), limit(1));
    const snapshot = await getDocs(q);
    
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking sample users:', error);
    return false;
  }
};

// Firebase Authentication에 관리자 계정을 수동으로 생성하는 함수 (자동 실행 안됨)
export const createAdminAuthAccount = async () => {
  console.log('⚠️ 관리자 계정 생성 함수는 더 이상 자동 실행되지 않습니다.');
  console.log('필요시 수동으로 회원가입해주세요.');
  return null;
};

// Firebase Authentication에 샘플 사용자 계정들을 수동으로 생성하는 함수 (자동 실행 안됨)
export const createSampleAuthAccounts = async () => {
  console.log('⚠️ 샘플 계정 생성 함수는 더 이상 자동 실행되지 않습니다.');
  console.log('필요시 수동으로 회원가입해주세요.');
  return false;
};

// 관리자 계정 업데이트 함수 (더 이상 자동 실행 안됨)
export const updateAdminAccount = async () => {
  console.log('⚠️ 계정 자동 생성 기능이 비활성화되었습니다.');
  console.log('필요시 수동으로 회원가입을 진행해주세요.');
  return false;
};

// 계정 생성 상태 확인 함수 (비활성화됨)
const checkAuthAccountsExist = async (): Promise<boolean> => {
  // 더 이상 자동 계정 생성을 하지 않으므로 항상 true 반환
  return true;
};

// 앱 초기화 시 호출할 함수 (자동 계정 생성 제거됨)
export const initializeSampleData = async () => {
  try {
    console.log('🔍 Petit 앱 데이터 초기화 시작...');
    
    // 자동 계정 생성 기능 제거됨 - 더 이상 사용자를 자동으로 생성하지 않음
    console.log('ℹ️ 자동 계정 생성 기능이 비활성화되었습니다.');
    
    // 샘플 사용자 확인 및 생성 (Firestore 프로필만)
    console.log('👥 Firestore 사용자 프로필 확인 중...');
    const usersExist = await checkSampleUsersExist();
    if (!usersExist) {
      console.log('📝 Firestore 사용자 프로필 생성 중...');
      await createSampleUsers();
    } else {
      console.log('✅ Firestore 사용자 프로필이 이미 존재합니다.');
    }
    
    // 샘플 포스트 확인 및 생성
    console.log('📄 샘플 포스트 확인 중...');
    const postsExist = await checkSampleDataExists();
    if (!postsExist) {
      console.log('📝 샘플 포스트 생성 중...');
      await createCategorySampleData();
    } else {
      console.log('✅ 샘플 포스트가 이미 존재합니다.');
    }
    
    console.log('🎉 Petit 앱 데이터 초기화 완료!');
    console.log('💡 로그인하려면 수동으로 회원가입을 진행해주세요.');
  } catch (error) {
    console.error('❌ 앱 초기화 중 오류 발생:', error);
  }
};