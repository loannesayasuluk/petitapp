# 🐾 Petit 반려동물 커뮤니티 앱 - Flutter 개발 가이드

## 📋 프로젝트 개요

### 앱 정보
- **앱 이름**: Petit (쁘띠)
- **타겟**: 한국의 반려동물 소유자와 예비 소유자
- **플랫폼**: iOS, Android (Flutter)
- **주요 언어**: 한국어
- **컨셉**: Natural Luxury 디자인 컨셉

### 앱 설명
모든 종류의 반려동물 소유자와 예비 소유자들을 위한 정보 공유 및 소셜 네트워킹 플랫폼입니다. 사용자들이 반려동물과 관련된 경험, 정보, 조언을 공유하고 커뮤니티를 형성할 수 있는 공간을 제공합니다.

---

## 🎨 디자인 시스템

### 컬러 시스템 (Natural Luxury)
```dart
// Primary Colors
static const Color creamWhite = Color(0xFFFAF8F1);
static const Color sandGray = Color(0xFFEAE0D5);
static const Color lightGray = Color(0xFFF5F5F5);
static const Color warmTaupe = Color(0xFFD5C5B5);
static const Color cocoaBrown = Color(0xFF4E4A4A);
static const Color charcoalBlack = Color(0xFF212529);
static const Color goldenOchre = Color(0xFFE5B876); // 메인 액센트 컬러

// Semantic Colors
static const Color background = creamWhite;
static const Color surface = Colors.white;
static const Color primary = goldenOchre;
static const Color onPrimary = charcoalBlack;
static const Color secondary = sandGray;
static const Color onSecondary = cocoaBrown;
static const Color error = Color(0xFFd4183d);
```

### 다크 모드 컬러
```dart
// Dark Mode Colors
static const Color darkCreamWhite = Color(0xFF2A2520);
static const Color darkSandGray = Color(0xFF3A342B);
static const Color darkWarmTaupe = Color(0xFF4A453C);
static const Color darkCocoaBrown = Color(0xFFC4B8A8);
static const Color darkCharcoalBlack = Color(0xFFF5F1E8);
```

### 타이포그래피
- **폰트 패밀리**: Pretendard (https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css)
- **기본 폰트 크기**: 14px
- **폰트 웨이트**: 
  - Light: 300
  - Normal: 400
  - Medium: 500
  - Bold: 700

```dart
// Text Styles
static const TextStyle heading1 = TextStyle(
  fontFamily: 'Pretendard',
  fontSize: 24,
  fontWeight: FontWeight.w500,
  height: 1.5,
);

static const TextStyle heading2 = TextStyle(
  fontFamily: 'Pretendard',
  fontSize: 20,
  fontWeight: FontWeight.w500,
  height: 1.5,
);

static const TextStyle body1 = TextStyle(
  fontFamily: 'Pretendard',
  fontSize: 16,
  fontWeight: FontWeight.w400,
  height: 1.5,
);

static const TextStyle body2 = TextStyle(
  fontFamily: 'Pretendard',
  fontSize: 14,
  fontWeight: FontWeight.w400,
  height: 1.5,
);
```

### 컴포넌트 스타일
- **Border Radius**: 10px (기본), 12px (카드), 8px (버튼)
- **그림자**: 부드럽고 자연스러운 그림자 사용
- **간격**: 4px, 8px, 12px, 16px, 20px, 24px 시스템

---

## 🏗️ 앱 구조 및 네비게이션

### 메인 탭 구조
```dart
enum MainTab {
  home,     // 홈
  community, // 커뮤니티
  chat,     // 채팅
  profile,  // 프로필
}
```

### 홈 탭 하위 구조
```dart
enum HomeSubTab {
  home,     // 홈 (추천, 이벤트)
  latest,   // 최신글
  popular,  // 인기글
  video,    // 영상
  expert,   // 전문가
}
```

### 카테고리 시스템
```dart
enum Category {
  dailyBoast,      // 일상자랑
  curiousQA,       // 궁금해요
  knowledgeWiki,   // 지식위키
  productReview,   // 제품후기
  petPlaces,       // 펫플레이스
  photoContest,    // 포토콘테스트
  sharingAdoption, // 나눔입양
  groupChallenge,  // 그룹챌린지
}
```

### 라우팅 구조
```dart
// Main Routes
'/': HomePage
'/community': CommunityPage
'/chat': ChatPage
'/profile': ProfilePage

// Category Routes
'/category/daily-boast': DailyBoastPage
'/category/curious-qa': CuriousQAPage
'/category/knowledge-wiki': KnowledgeWikiPage
'/category/product-review': ProductReviewPage
'/category/pet-places': PetPlacePage
'/category/photo-contest': PhotoContestPage
'/category/sharing-adoption': ShareAdoptionPage
'/category/group-challenge': GroupChallengePage

// Detail Routes
'/post/:id': PostDetailPage
'/profile/:id': ProfileDetailPage
'/write': WritePostPage
'/login': LoginPage

// Admin Routes (권한 필요)
'/admin': AdminDashboardPage
'/admin/users': UserManagementPage
'/admin/content': ContentModerationPage
'/admin/settings': AdminSettingsPage

// Settings Routes
'/settings': SettingsPage
'/support': SupportPage
```

---

## 🔥 Firebase 백엔드 구조

### Firestore Collections

#### Users Collection
```dart
class User {
  String id;
  String email;
  String displayName;
  String? profileImageUrl;
  DateTime createdAt;
  DateTime lastLoginAt;
  bool isAdmin;
  List<String> likedPosts;
  List<String> bookmarkedPosts;
  Map<String, dynamic> settings;
  
  // 반려동물 정보
  List<Pet> pets;
}

class Pet {
  String name;
  String species; // 강아지, 고양이, 새, 물고기 등
  String? breed;
  int? age;
  String? imageUrl;
  String? description;
}
```

#### Posts Collection
```dart
class Post {
  String id;
  String authorId;
  String authorName;
  String? authorProfileImage;
  String title;
  String content;
  List<String> imageUrls;
  String category;
  List<String> tags;
  DateTime createdAt;
  DateTime updatedAt;
  int likeCount;
  int commentCount;
  int viewCount;
  bool isPublished;
  bool isFeatured;
  Map<String, dynamic> metadata;
}
```

#### Comments Collection
```dart
class Comment {
  String id;
  String postId;
  String authorId;
  String authorName;
  String? authorProfileImage;
  String content;
  DateTime createdAt;
  int likeCount;
  String? parentCommentId; // 대댓글용
  bool isDeleted;
}
```

#### Events Collection
```dart
class Event {
  String id;
  String title;
  String description;
  String imageUrl;
  String category;
  DateTime startDate;
  DateTime endDate;
  String? actionUrl;
  bool isActive;
  int priority;
}
```

### Firebase Auth 설정
```dart
// 지원 로그인 방법
- Google Sign-In
- Naver Sign-In (네이버 로그인)
- 익명 로그인 (게스트)

// 보안 규칙 예시
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts are readable by all, writable by authenticated users
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Comments are readable by all, writable by authenticated users
    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📱 주요 화면 및 기능

### 1. 스플래시 & 온보딩
- 앱 로고와 브랜딩
- 첫 방문자용 온보딩 슬라이드
- 권한 요청 (알림, 카메라, 갤러리)

### 2. 메인 홈 화면
```dart
class HomePage extends StatefulWidget {
  // 상단 헤더
  - 햄버거 메뉴
  - 검색 바
  - 알림 버튼
  - 북마크 버튼
  
  // 메인 탭 네비게이션
  - 홈, 최신글, 인기글, 영상, 전문가
  
  // 콘텐츠 영역
  - 이벤트 배너 (가로 스크롤)
  - 추천 콘텐츠
  - 인기 스토리
  - 전문가 콘텐츠
  
  // 플로팅 글쓰기 버튼
}
```

### 3. 커뮤니티 피드
```dart
class CommunityFeed extends StatefulWidget {
  // 기능
  - 무한 스크롤 포스트 목록
  - 카테고리별 필터링
  - 좋아요, 댓글, 공유 기능
  - 이미지 갤러리 뷰
  - Pull-to-refresh
}
```

### 4. 글쓰기 화면
```dart
class WritePostPage extends StatefulWidget {
  // 기능
  - 제목, 내용 입력
  - 이미지 업로드 (최대 5장)
  - 카테고리 선택
  - 태그 추가
  - 임시저장 기능
  - 미리보기
}
```

### 5. 게시물 상세 화면
```dart
class PostDetailPage extends StatefulWidget {
  // 기능
  - 게시물 전체 내용 표시
  - 이미지 풀스크린 뷰
  - 좋아요, 북마크, 공유
  - 댓글 목록 및 작성
  - 대댓글 지원
  - 작성자 프로필 이동
}
```

### 6. 프로필 화면
```dart
class ProfilePage extends StatefulWidget {
  // 로그인 전
  - 로그인 유도 UI
  - 게스트 모드 제한된 기능
  
  // 로그인 후
  - 사용자 정보 표시
  - 반려동물 정보
  - 작성한 게시물 목록
  - 좋아요한 게시물
  - 북마크한 게시물
  - 설정 메뉴
}
```

### 7. 카테고리별 페이지
각 카테고리마다 특화된 UI와 기능:

#### 일상자랑 (DailyBoastPage)
- 반려동물 사진 중심의 갤러리 뷰
- 좋아요가 많은 순 정렬

#### 궁금해요 (CuriousQAPage)  
- Q&A 형식의 게시물
- 질문/답변 태그 구분
- 채택된 답변 표시

#### 지식위키 (KnowledgeWikiPage)
- 정보성 콘텐츠 중심
- 카테고리별 분류 (사료, 병원, 훈련 등)
- 전문가 인증 표시

#### 제품후기 (ProductReviewPage)
- 별점 시스템
- 제품 정보 메타데이터
- 구매 링크 연결

#### 펫플레이스 (PetPlacePage)
- 장소 정보 (이름, 주소, 연락처)
- 지도 연동
- 리뷰 및 평점

#### 포토콘테스트 (PhotoContestPage)
- 월별/주별 콘테스트
- 투표 시스템
- 순위 표시

#### 나눔입양 (ShareAdoptionPage)
- 입양/분양 정보
- 연락처 정보
- 상태 관리 (진행중/완료)

#### 그룹챌린지 (GroupChallengePage)
- 챌린지 참여 시스템
- 진행률 표시
- 참여자 목록

### 8. 채팅 (추후 구현)
```dart
class ChatPage extends StatefulWidget {
  // 기능
  - 1:1 채팅
  - 그룹 채팅
  - 이미지 전송
  - 읽음 표시
}
```

### 9. 사이드 메뉴
```dart
class SideMenu extends StatelessWidget {
  // 로그인 전
  - 로그인 버튼
  - 앱 정보
  - 고객지원
  
  // 로그인 후
  - 프로필 정보
  - 설정
  - 북마크
  - 로그아웃
  - 관리자 메뉴 (관리자만)
}
```

---

## 🔐 인증 시스템

### 로그인 방식
```dart
enum LoginType {
  google,
  naver,
  guest, // 익명 로그인
}

class AuthService {
  // Google 로그인
  Future<User?> signInWithGoogle();
  
  // Naver 로그인  
  Future<User?> signInWithNaver();
  
  // 익명 로그인
  Future<User?> signInAnonymously();
  
  // 로그아웃
  Future<void> signOut();
  
  // 계정 연동 (익명 → 소셜)
  Future<User?> linkAccount(LoginType type);
}
```

### 권한 관리
```dart
class PermissionService {
  // 필요한 권한들
  - 카메라 (사진 촬영)
  - 갤러리 (사진 선택)
  - 알림 (푸시 알림)
  - 위치 (펫플레이스 기능)
  
  Future<bool> requestCameraPermission();
  Future<bool> requestStoragePermission();
  Future<bool> requestNotificationPermission();
  Future<bool> requestLocationPermission();
}
```

---

## 🗂️ 상태 관리

### Provider 패턴 사용 (권장)
```dart
// Auth State
class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _currentUser != null;
  
  Future<void> signIn(LoginType type);
  Future<void> signOut();
}

// Posts State  
class PostsProvider extends ChangeNotifier {
  List<Post> _posts = [];
  bool _isLoading = false;
  String? _error;
  
  List<Post> get posts => _posts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> fetchPosts({String? category});
  Future<void> likePost(String postId);
  Future<void> bookmarkPost(String postId);
}

// Navigation State
class NavigationProvider extends ChangeNotifier {
  MainTab _currentTab = MainTab.home;
  HomeSubTab _currentHomeTab = HomeSubTab.home;
  
  MainTab get currentTab => _currentTab;
  HomeSubTab get currentHomeTab => _currentHomeTab;
  
  void setTab(MainTab tab);
  void setHomeTab(HomeSubTab tab);
}
```

---

## 📊 데이터 모델

### Post Model
```dart
class Post {
  final String id;
  final String authorId;
  final String authorName;
  final String? authorProfileImage;
  final String title;
  final String content;
  final List<String> imageUrls;
  final String category;
  final List<String> tags;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int likeCount;
  final int commentCount;
  final int viewCount;
  final bool isPublished;
  final bool isFeatured;
  final Map<String, dynamic> metadata;
  
  Post({
    required this.id,
    required this.authorId,
    required this.authorName,
    this.authorProfileImage,
    required this.title,
    required this.content,
    required this.imageUrls,
    required this.category,
    required this.tags,
    required this.createdAt,
    required this.updatedAt,
    required this.likeCount,
    required this.commentCount,
    required this.viewCount,
    required this.isPublished,
    required this.isFeatured,
    required this.metadata,
  });
  
  factory Post.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return Post(
      id: doc.id,
      authorId: data['authorId'] ?? '',
      authorName: data['authorName'] ?? '',
      authorProfileImage: data['authorProfileImage'],
      title: data['title'] ?? '',
      content: data['content'] ?? '',
      imageUrls: List<String>.from(data['imageUrls'] ?? []),
      category: data['category'] ?? '',
      tags: List<String>.from(data['tags'] ?? []),
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: (data['updatedAt'] as Timestamp).toDate(),
      likeCount: data['likeCount'] ?? 0,
      commentCount: data['commentCount'] ?? 0,
      viewCount: data['viewCount'] ?? 0,
      isPublished: data['isPublished'] ?? false,
      isFeatured: data['isFeatured'] ?? false,
      metadata: data['metadata'] ?? {},
    );
  }
  
  Map<String, dynamic> toFirestore() {
    return {
      'authorId': authorId,
      'authorName': authorName,
      'authorProfileImage': authorProfileImage,
      'title': title,
      'content': content,
      'imageUrls': imageUrls,
      'category': category,
      'tags': tags,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
      'likeCount': likeCount,
      'commentCount': commentCount,
      'viewCount': viewCount,
      'isPublished': isPublished,
      'isFeatured': isFeatured,
      'metadata': metadata,
    };
  }
}
```

### Comment Model
```dart
class Comment {
  final String id;
  final String postId;
  final String authorId;
  final String authorName;
  final String? authorProfileImage;
  final String content;
  final DateTime createdAt;
  final int likeCount;
  final String? parentCommentId;
  final bool isDeleted;
  
  Comment({
    required this.id,
    required this.postId,
    required this.authorId,
    required this.authorName,
    this.authorProfileImage,
    required this.content,
    required this.createdAt,
    required this.likeCount,
    this.parentCommentId,
    required this.isDeleted,
  });
  
  factory Comment.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return Comment(
      id: doc.id,
      postId: data['postId'] ?? '',
      authorId: data['authorId'] ?? '',
      authorName: data['authorName'] ?? '',
      authorProfileImage: data['authorProfileImage'],
      content: data['content'] ?? '',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      likeCount: data['likeCount'] ?? 0,
      parentCommentId: data['parentCommentId'],
      isDeleted: data['isDeleted'] ?? false,
    );
  }
}
```

### User Model
```dart
class User {
  final String id;
  final String email;
  final String displayName;
  final String? profileImageUrl;
  final DateTime createdAt;
  final DateTime lastLoginAt;
  final bool isAdmin;
  final List<String> likedPosts;
  final List<String> bookmarkedPosts;
  final Map<String, dynamic> settings;
  final List<Pet> pets;
  
  User({
    required this.id,
    required this.email,
    required this.displayName,
    this.profileImageUrl,
    required this.createdAt,
    required this.lastLoginAt,
    required this.isAdmin,
    required this.likedPosts,
    required this.bookmarkedPosts,
    required this.settings,
    required this.pets,
  });
}

class Pet {
  final String name;
  final String species;
  final String? breed;
  final int? age;
  final String? imageUrl;
  final String? description;
  
  Pet({
    required this.name,
    required this.species,
    this.breed,
    this.age,
    this.imageUrl,
    this.description,
  });
}
```

---

## 🚀 주요 기능 구현 가이드

### 1. 이미지 업로드
```dart
class ImageUploadService {
  Future<List<String>> uploadImages(List<File> images) async {
    List<String> urls = [];
    
    for (File image in images) {
      // 이미지 압축
      File compressedImage = await compressImage(image);
      
      // Firebase Storage 업로드
      String fileName = '${DateTime.now().millisecondsSinceEpoch}.jpg';
      Reference ref = FirebaseStorage.instance.ref().child('images/$fileName');
      UploadTask uploadTask = ref.putFile(compressedImage);
      TaskSnapshot snapshot = await uploadTask;
      String url = await snapshot.ref.getDownloadURL();
      
      urls.add(url);
    }
    
    return urls;
  }
  
  Future<File> compressImage(File image) async {
    // 이미지 압축 로직
    // flutter_image_compress 패키지 사용 권장
  }
}
```

### 2. 푸시 알림
```dart
class NotificationService {
  Future<void> initialize() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;
    
    // 권한 요청
    NotificationSettings settings = await messaging.requestPermission();
    
    // FCM 토큰 가져오기
    String? token = await messaging.getToken();
    
    // 토큰을 서버에 저장
    await saveTokenToServer(token);
    
    // 포그라운드 메시지 처리
    FirebaseMessaging.onMessage.listen(handleForegroundMessage);
    
    // 백그라운드 메시지 처리
    FirebaseMessaging.onBackgroundMessage(handleBackgroundMessage);
  }
}
```

### 3. 오프라인 지원
```dart
class OfflineService {
  // Hive 또는 SQLite 사용하여 로컬 캐싱
  Future<void> cachePost(Post post) async {
    // 게시물 로컬 저장
  }
  
  Future<List<Post>> getCachedPosts() async {
    // 캐시된 게시물 반환
  }
  
  Future<void> syncWithServer() async {
    // 네트워크 연결 시 서버와 동기화
  }
}
```

---

## 📦 필요한 Flutter 패키지

### 필수 패키지
```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Firebase
  firebase_core: ^2.15.0
  firebase_auth: ^4.7.2
  cloud_firestore: ^4.8.4
  firebase_storage: ^11.2.5
  firebase_messaging: ^14.6.5
  
  # 상태 관리
  provider: ^6.0.5
  
  # UI/UX
  cached_network_image: ^3.2.3
  flutter_svg: ^2.0.7
  shimmer: ^3.0.0
  pull_to_refresh: ^2.0.0
  photo_view: ^0.14.0
  
  # 이미지 처리
  image_picker: ^1.0.2
  flutter_image_compress: ^2.0.4
  
  # 소셜 로그인
  google_sign_in: ^6.1.4
  flutter_naver_login: ^1.8.0
  
  # 로컬 저장소
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  shared_preferences: ^2.2.0
  
  # 네트워킹
  dio: ^5.3.0
  connectivity_plus: ^4.0.2
  
  # 유틸리티
  intl: ^0.18.1
  url_launcher: ^6.1.12
  share_plus: ^7.1.0
  permission_handler: ^10.4.3
  
  # 애니메이션
  lottie: ^2.6.0
  
  # 지도 (펫플레이스용)
  google_maps_flutter: ^2.4.0
  geolocator: ^9.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0
  hive_generator: ^2.0.0
  build_runner: ^2.4.6
```

---

## 🔧 개발 환경 설정

### Android 설정
```gradle
// android/app/build.gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.petit.app"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
    }
}

dependencies {
    implementation 'com.android.support:multidex:1.0.3'
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
}
```

### iOS 설정
```plist
<!-- ios/Runner/Info.plist -->
<key>NSCameraUsageDescription</key>
<string>사진을 촬영하여 게시물에 첨부하기 위해 카메라 권한이 필요합니다.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>사진을 선택하여 게시물에 첨부하기 위해 갤러리 권한이 필요합니다.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>펫플레이스 기능을 위해 위치 권한이 필요합니다.</string>
```

---

## 🎯 UI/UX 가이드라인

### 디자인 원칙
1. **Natural Luxury**: 자연스럽고 고급스러운 느낌
2. **Warm & Friendly**: 따뜻하고 친근한 분위기
3. **Pet-Centered**: 반려동물 중심의 디자인
4. **Korean-First**: 한국 사용자 친화적 UX

### 컴포넌트 가이드라인

#### 버튼
```dart
// Primary Button
Container(
  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
  decoration: BoxDecoration(
    color: PetitColors.goldenOchre,
    borderRadius: BorderRadius.circular(8),
  ),
  child: Text(
    '버튼 텍스트',
    style: TextStyle(
      color: PetitColors.charcoalBlack,
      fontWeight: FontWeight.w500,
    ),
  ),
)

// Secondary Button  
Container(
  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
  decoration: BoxDecoration(
    border: Border.all(color: PetitColors.goldenOchre),
    borderRadius: BorderRadius.circular(8),
  ),
  child: Text(
    '버튼 텍스트',
    style: TextStyle(
      color: PetitColors.goldenOchre,
      fontWeight: FontWeight.w500,
    ),
  ),
)
```

#### 카드
```dart
Container(
  margin: EdgeInsets.all(8),
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.1),
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 카드 내용
    ],
  ),
)
```

#### 입력 필드
```dart
TextField(
  decoration: InputDecoration(
    hintText: '힌트 텍스트',
    filled: true,
    fillColor: PetitColors.sandGray,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: PetitColors.goldenOchre),
    ),
  ),
)
```

---

## 📱 애니메이션 가이드

### 페이지 전환
```dart
// 자연스러운 슬라이드 전환
PageRouteBuilder(
  pageBuilder: (context, animation, secondaryAnimation) => NextPage(),
  transitionsBuilder: (context, animation, secondaryAnimation, child) {
    return SlideTransition(
      position: animation.drive(
        Tween(begin: Offset(1.0, 0.0), end: Offset.zero).chain(
          CurveTween(curve: Curves.easeInOut),
        ),
      ),
      child: child,
    );
  },
  transitionDuration: Duration(milliseconds: 300),
)
```

### 로딩 애니메이션
```dart
// Shimmer 로딩 효과
Shimmer.fromColors(
  baseColor: PetitColors.sandGray,
  highlightColor: PetitColors.lightGray,
  child: Container(
    width: double.infinity,
    height: 200,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
    ),
  ),
)
```

---

## 🔒 보안 가이드라인

### 데이터 보호
1. **개인정보 최소 수집**: 필요한 정보만 수집
2. **데이터 암호화**: 민감한 데이터는 암호화 저장
3. **권한 최소화**: 필요한 권한만 요청
4. **입력값 검증**: 모든 사용자 입력 검증

### Firebase 보안 규칙
```javascript
// Firestore 보안 규칙
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 수정 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시물은 모두 읽기 가능, 인증된 사용자만 작성 가능
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (resource == null || resource.data.authorId == request.auth.uid);
    }
    
    // 댓글은 모두 읽기 가능, 인증된 사용자만 작성 가능
    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (resource == null || resource.data.authorId == request.auth.uid);
    }
    
    // 관리자만 접근 가능한 컬렉션
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

---

## 📈 성능 최적화

### 이미지 최적화
```dart
class ImageOptimization {
  static Widget optimizedNetworkImage(String url) {
    return CachedNetworkImage(
      imageUrl: url,
      placeholder: (context, url) => Shimmer.fromColors(
        baseColor: PetitColors.sandGray,
        highlightColor: PetitColors.lightGray,
        child: Container(color: Colors.white),
      ),
      errorWidget: (context, url, error) => Icon(Icons.error),
      memCacheWidth: 600, // 메모리 사용량 제한
      memCacheHeight: 600,
    );
  }
}
```

### 리스트 최적화
```dart
// ListView.builder로 무한 스크롤 구현
ListView.builder(
  physics: BouncingScrollPhysics(),
  itemCount: posts.length + (hasMore ? 1 : 0),
  itemBuilder: (context, index) {
    if (index == posts.length) {
      // 로딩 인디케이터
      loadMorePosts();
      return Center(child: CircularProgressIndicator());
    }
    
    return PostCard(post: posts[index]);
  },
)
```

---

## 🧪 테스트 전략

### 단위 테스트
```dart
// test/models/post_test.dart
void main() {
  group('Post Model Tests', () {
    test('should create Post from Firestore data', () {
      // Given
      Map<String, dynamic> data = {
        'authorId': 'test_author',
        'title': 'Test Title',
        'content': 'Test Content',
        // ... 기타 필드
      };
      
      // When
      Post post = Post.fromFirestore(MockDocumentSnapshot(data));
      
      // Then
      expect(post.authorId, 'test_author');
      expect(post.title, 'Test Title');
    });
  });
}
```

### 위젯 테스트
```dart
// test/widgets/post_card_test.dart
void main() {
  testWidgets('PostCard displays post information', (WidgetTester tester) async {
    // Given
    Post testPost = Post(/* test data */);
    
    // When
    await tester.pumpWidget(
      MaterialApp(
        home: PostCard(post: testPost),
      ),
    );
    
    // Then
    expect(find.text(testPost.title), findsOneWidget);
    expect(find.text(testPost.authorName), findsOneWidget);
  });
}
```

---

## 🚀 배포 가이드

### Android 배포 (Google Play Store)
```bash
# 1. Release APK 빌드
flutter build apk --release

# 2. App Bundle 빌드 (권장)
flutter build appbundle --release

# 3. 서명된 APK 생성
flutter build apk --release --target-platform android-arm,android-arm64,android-x64 --split-per-abi
```

### iOS 배포 (App Store)
```bash
# 1. iOS 빌드
flutter build ios --release

# 2. Xcode에서 Archive 및 업로드
# 3. App Store Connect에서 검토 제출
```

### 버전 관리
```yaml
# pubspec.yaml
version: 1.0.0+1
# 1.0.0: 버전 이름 (semantic versioning)
# +1: 빌드 번호 (매 빌드마다 증가)
```

---

## 📚 추가 개발 가이드

### 상태 관리 패턴
```dart
// Provider 패턴 사용 예시
class PostsProvider extends ChangeNotifier {
  List<Post> _posts = [];
  bool _isLoading = false;
  String? _error;
  
  // Getters
  List<Post> get posts => _posts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // Methods
  Future<void> fetchPosts({String? category}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      QuerySnapshot snapshot = await FirebaseFirestore.instance
          .collection('posts')
          .where('category', isEqualTo: category ?? '')
          .orderBy('createdAt', descending: true)
          .limit(20)
          .get();
      
      _posts = snapshot.docs
          .map((doc) => Post.fromFirestore(doc))
          .toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> likePost(String postId) async {
    // 좋아요 토글 로직
  }
  
  Future<void> bookmarkPost(String postId) async {
    // 북마크 토글 로직
  }
}
```

### 에러 처리
```dart
class ErrorHandler {
  static void handleError(dynamic error, StackTrace stackTrace) {
    // 로깅
    print('Error: $error');
    print('Stack trace: $stackTrace');
    
    // 사용자에게 친화적인 메시지 표시
    if (error is FirebaseException) {
      _showFirebaseError(error);
    } else if (error is DioError) {
      _showNetworkError(error);
    } else {
      _showGenericError();
    }
  }
  
  static void _showFirebaseError(FirebaseException error) {
    String message;
    switch (error.code) {
      case 'permission-denied':
        message = '권한이 없습니다.';
        break;
      case 'unavailable':
        message = '서비스가 일시적으로 사용할 수 없습니다.';
        break;
      default:
        message = '오류가 발생했습니다.';
    }
    _showSnackBar(message);
  }
}
```

---

## 🎨 디자인 시스템 상세

### 컬러 팔레트 확장
```dart
class PetitColors {
  // Primary Colors
  static const Color creamWhite = Color(0xFFFAF8F1);
  static const Color sandGray = Color(0xFFEAE0D5);
  static const Color lightGray = Color(0xFFF5F5F5);
  static const Color warmTaupe = Color(0xFFD5C5B5);
  static const Color cocoaBrown = Color(0xFF4E4A4A);
  static const Color charcoalBlack = Color(0xFF212529);
  static const Color goldenOchre = Color(0xFFE5B876);
  
  // Semantic Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  
  // Opacity Variants
  static Color get goldenOchre10 => goldenOchre.withOpacity(0.1);
  static Color get goldenOchre20 => goldenOchre.withOpacity(0.2);
  static Color get goldenOchre50 => goldenOchre.withOpacity(0.5);
  
  // Gradient
  static LinearGradient get primaryGradient => LinearGradient(
    colors: [goldenOchre, goldenOchre.withOpacity(0.8)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
```

### 타이포그래피 시스템
```dart
class PetitTextStyles {
  static const String fontFamily = 'Pretendard';
  
  // Headings
  static const TextStyle h1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.5,
    color: PetitColors.charcoalBlack,
  );
  
  static const TextStyle h2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.5,
    color: PetitColors.charcoalBlack,
  );
  
  static const TextStyle h3 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: PetitColors.charcoalBlack,
  );
  
  // Body Text
  static const TextStyle body1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.6,
    color: PetitColors.charcoalBlack,
  );
  
  static const TextStyle body2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: PetitColors.cocoaBrown,
  );
  
  // Caption
  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.4,
    color: PetitColors.cocoaBrown,
  );
  
  // Button Text
  static const TextStyle button = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: PetitColors.charcoalBlack,
  );
}
```

---

이 가이드를 바탕으로 Gemini AI가 Petit 앱을 Flutter로 완벽하게 구현할 수 있을 것입니다. 추가적인 세부사항이나 특정 기능에 대한 구체적인 요구사항이 있다면 언제든 알려주세요! 🐾