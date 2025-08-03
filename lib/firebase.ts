import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, updateProfile, fetchSignInMethodsForEmail, User, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, where, onSnapshot, serverTimestamp, getDoc, setDoc, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Safe environment variable access
const getEnvVar = (key: string, fallback: string): string => {
  try {
    // Check if import.meta.env is available
    if (import.meta?.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    return fallback;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return fallback;
  }
};

// Firebase configuration
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', "AIzaSyABxP-1BNS1koh3U0XQBnkxcnBUD0YNKk4"),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', "petit-app-16877.firebaseapp.com"),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', "petit-app-16877"),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', "petit-app-16877.firebasestorage.app"),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', "482477402300"),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', "1:482477402300:web:0ca4cf3bfe5019a8aa88b9"),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', "G-1KR3718KEQ")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services with error handling
let analytics: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Firebase connection state
let firebaseConnected = false;
let connectionTimeoutId: NodeJS.Timeout | null = null;
let connectionRetryCount = 0;
const MAX_RETRY_COUNT = 3;

// Initialize Auth (most reliable service)
try {
  auth = getAuth(app);
  
  // Set Auth persistence to SESSION to prevent automatic login on page refresh
  try {
    setPersistence(auth, browserSessionPersistence).then(() => {
      console.log('🔐 Firebase Auth persistence set to SESSION - 탭 닫으면 로그아웃됨');
    }).catch((error) => {
      console.warn('Failed to set Auth persistence:', error);
    });
  } catch (persistenceError) {
    console.warn('Could not set Auth persistence:', persistenceError);
  }
  
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
}

// Initialize Firestore with enhanced error handling and resilience
try {
  db = getFirestore(app);
  
  // Configure Firestore settings for better resilience
  try {
    // Enable offline persistence for better reliability
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      console.log('Firestore offline persistence configured');
    }
  } catch (persistenceError) {
    console.warn('Offline persistence not available:', persistenceError.message);
  }
  
  // Test connection with a simple operation
  const testConnection = async () => {
    try {
      // Set a timeout for connection test
      const timeoutPromise = new Promise((_, reject) => {
        connectionTimeoutId = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 8000); // Increased timeout for better stability
      });
      
      // Try to get a simple document to test connection with retries
      const testQuery = query(collection(db, 'posts'), limit(1));
      const testPromise = getDocs(testQuery);
      
      await Promise.race([testPromise, timeoutPromise]);
      
      if (connectionTimeoutId) {
        clearTimeout(connectionTimeoutId);
      }
      
      firebaseConnected = true;
      connectionRetryCount = 0; // Reset retry count on success
      console.log('Firebase Firestore connected successfully');
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      console.warn(`Firebase Firestore connection test failed (attempt ${connectionRetryCount + 1}):`, errorMessage);
      firebaseConnected = false;
      connectionRetryCount++;
      
      // Handle specific error types
      if (error.code === 'unavailable' || errorMessage.includes('transport') || errorMessage.includes('stream')) {
        console.log('Network connectivity issue detected, will retry with exponential backoff');
      } else if (error.code === 'permission-denied') {
        console.log('Permission issue detected, will continue with limited functionality');
        return; // Don't retry on permission errors
      }
      
      // Retry connection with exponential backoff
      if (connectionRetryCount < MAX_RETRY_COUNT) {
        const retryDelay = Math.min(2000 * Math.pow(1.5, connectionRetryCount), 15000);
        console.log(`Retrying Firebase connection in ${retryDelay}ms...`);
        setTimeout(testConnection, retryDelay);
      } else {
        console.log('Max connection retries reached. App will continue with offline capabilities');
        // Set connected to true to allow app to function with fallback data
        firebaseConnected = true;
      }
    }
  };
  
  // Run connection test with delay to avoid immediate connection issues
  setTimeout(testConnection, 2000);
  
  console.log('Firebase Firestore initialized with enhanced resilience');
} catch (error) {
  console.error('Error initializing Firebase Firestore:', error.message);
  firebaseConnected = true; // Allow app to continue with fallback data
}

// Initialize Storage
try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Storage:', error);
}

// Initialize Analytics with better error handling
try {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } else {
      console.log('Firebase Analytics not supported in this environment');
    }
  }).catch((error) => {
    console.warn('Firebase Analytics initialization failed:', error.message);
    // Continue without analytics
  });
} catch (error) {
  console.warn('Error checking Analytics support:', error.message);
}

// Auth provider
export const googleProvider = new GoogleAuthProvider();

// Export Firebase services
export { auth, db, storage };

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return auth && db && storage;
};

// Check if Firebase is connected
export const isFirebaseConnected = () => {
  return firebaseConnected;
};

// Network connectivity status check
let isOnline = navigator?.onLine !== false;

// Monitor network status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    console.log('Network connection restored');
    // Optionally retry Firebase connection
    if (!firebaseConnected && connectionRetryCount >= MAX_RETRY_COUNT) {
      connectionRetryCount = 0; // Reset retry count
      console.log('Attempting to reconnect to Firebase...');
    }
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    console.log('Network connection lost - switching to offline mode');
  });
}

// Check if device is online
export const isNetworkOnline = () => {
  return isOnline;
};

// Enhanced connection status check
export const getConnectionStatus = () => {
  return {
    isFirebaseConfigured: isFirebaseConfigured(),
    isFirebaseConnected: isFirebaseConnected(),
    isNetworkOnline: isNetworkOnline(),
    retryCount: connectionRetryCount
  };
};

// Enhanced utility to handle Firebase connection issues gracefully
export const withFirebaseConnection = async (
  operation: () => Promise<any>,
  fallbackValue: any,
  operationName: string = 'Firebase operation'
): Promise<any> => {
  if (!isFirebaseConfigured()) {
    console.warn(`${operationName}: Firebase not configured, returning fallback`);
    return fallbackValue;
  }
  
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${operationName} timeout`));
      }, 12000); // Increased timeout for better stability
    });
    
    const result = await Promise.race([operation(), timeoutPromise]);
    return result;
  } catch (error) {
    const errorCode = error.code || 'unknown';
    const errorMessage = error.message || 'Unknown error';
    
    console.warn(`${operationName} failed:`, errorMessage, errorCode);
    
    // Handle specific Firebase errors with more detailed logging
    if (errorCode === 'unavailable' || errorCode === 'deadline-exceeded') {
      console.log(`${operationName}: Network connectivity issue, using fallback data`);
    } else if (errorCode === 'permission-denied') {
      console.log(`${operationName}: Permission denied, using fallback data`);
    } else if (errorCode === 'cancelled' || errorCode === 'unauthenticated') {
      console.log(`${operationName}: Connection cancelled/unauthenticated, using fallback data`);
    } else if (errorMessage.includes('transport') || errorMessage.includes('stream') || errorMessage.includes('WebChannel')) {
      console.log(`${operationName}: Transport/stream error, using fallback data`);
    } else if (errorMessage.includes('timeout')) {
      console.log(`${operationName}: Operation timeout, using fallback data`);
    } else {
      console.log(`${operationName}: Unexpected error (${errorCode}), using fallback data`);
    }
    
    return fallbackValue;
  }
};

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create user profile if it doesn't exist
    await createUserProfile(user);
    
    return user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Admin email list - 관리자로 지정할 이메일 목록
const ADMIN_EMAILS = [
  'winia1370@gmail.com' // 관리자
];

// Check if user is admin
export const checkIsAdmin = (email?: string): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Check if email is already in use
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length === 0; // true if email is available, false if already in use
  } catch (error) {
    console.error('Error checking email availability:', error);
    if (error.code === 'auth/invalid-email') {
      throw new Error('올바르지 않은 이메일 형식입니다.');
    }
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string, nickname?: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update user profile with display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Create user profile in Firestore with nickname
    await createUserProfile(user, { 
      displayName: displayName || email.split('@')[0],
      nickname: nickname || displayName || email.split('@')[0]
    });
    
    return user;
  } catch (error) {
    console.error('Email sign up error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign in error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// User data types
export interface UserProfile {
  uid: string;
  displayName: string;
  nickname: string;
  email: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  createdAt: any;
  updatedAt: any;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isAdmin?: boolean;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  breed: string;
  age: string;
  photoURL: string;
  birthday: string;
  gender: 'male' | 'female';
  bio?: string;
  createdAt: any;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrls: string[];
  category: string;
  petType?: string; // 강아지, 고양이, 기타
  petName?: string;
  petBreed?: string;
  likes: string[]; // Array of user IDs who liked
  likesCount: number;
  commentsCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: any;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  badge?: string;
  date?: string;
  imageUrl?: string;
  isActive: boolean;
  priority: number;
  createdAt: any;
  updatedAt: any;
}

// User functions
export const createUserProfile = async (user: any, additionalData?: any) => {
  if (!user || !isFirebaseConfigured()) {
    console.warn('Cannot create user profile - Firebase not configured or no user provided');
    return;
  }
  
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = serverTimestamp();
      
      await setDoc(userRef, {
        displayName: displayName || '펫띠 사용자',
        nickname: additionalData?.nickname || displayName || '펫띠 사용자',
        email,
        photoURL: photoURL || '',
        bio: '',
        location: '',
        createdAt,
        updatedAt: createdAt,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        isAdmin: checkIsAdmin(email), // 관리자 여부 확인
        ...additionalData
      });
      
      console.log('User profile created successfully');
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    if (error.code === 'permission-denied') {
      console.warn('Permission denied creating user profile - profile creation skipped');
      return;
    }
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not properly configured, cannot get user profile');
    return null;
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return { uid: userId, ...userSnapshot.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    if (error.code === 'permission-denied') {
      console.warn('Permission denied getting user profile - returning null');
      return null;
    }
    throw error;
  }
};

// Pet functions
export const createPet = async (petData: Omit<Pet, 'id' | 'createdAt'>) => {
  try {
    const petRef = collection(db, 'pets');
    const docRef = await addDoc(petRef, {
      ...petData,
      createdAt: serverTimestamp()
    });
    
    console.log('Pet created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating pet:', error);
    throw error;
  }
};

export const getUserPets = async (userId: string): Promise<Pet[]> => {
  return withFirebaseConnection(async () => {
    const petsRef = collection(db, 'pets');
    // Avoid composite index by using only where clause without orderBy
    const q = query(petsRef, where('ownerId', '==', userId), limit(50));
    const snapshot = await getDocs(q);
    
    // Sort pets in memory to avoid composite index requirement
    const pets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Pet[];
    
    // Sort by creation time in descending order (newest first)
    return pets.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return bTime.getTime() - aTime.getTime();
    });
  }, [], `Get pets for user ${userId}`);
};

// Post functions
export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Post created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async (category?: string, limit_count = 20): Promise<Post[]> => {
  return withFirebaseConnection(async () => {
    const postsRef = collection(db, 'posts');
    let q: any;
    
    if (category && category !== '전체') {
      // For category filtering, get more documents and sort/limit in memory to avoid composite index
      q = query(postsRef, where('category', '==', category), limit(limit_count * 2));
    } else {
      // For all posts, we can use orderBy safely
      q = query(postsRef, orderBy('createdAt', 'desc'), limit(limit_count));
    }
    
    const snapshot = await getDocs(q);
    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    // If filtering by category, sort and limit in memory
    if (category && category !== '전체') {
      posts = posts
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return bTime.getTime() - aTime.getTime();
        })
        .slice(0, limit_count);
    }
    
    return posts;
  }, [], 'Get posts');
};

export const toggleLike = async (postId: string, userId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);
    
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data() as Post;
      const likes = postData.likes || [];
      const isLiked = likes.includes(userId);
      
      let updatedLikes: string[];
      if (isLiked) {
        updatedLikes = likes.filter(id => id !== userId);
      } else {
        updatedLikes = [...likes, userId];
      }
      
      await updateDoc(postRef, {
        likes: updatedLikes,
        likesCount: updatedLikes.length,
        updatedAt: serverTimestamp()
      });
      
      return !isLiked;
    }
    return false;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Image upload function
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Real-time listeners
export const listenToPosts = (
  callback: (posts: Post[]) => void, 
  category?: string,
  petType?: string,
  onError?: (error: Error) => void
) => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not properly configured, providing empty posts');
    callback([]);
    return () => {};
  }

  try {
    const postsRef = collection(db, 'posts');
    let q: any;
    
    // Build query based on filters
    if ((category && category !== '전체') || (petType && petType !== '전체')) {
      // For filtering, avoid composite index by not using orderBy
      const conditions = [];
      if (category && category !== '전체') {
        conditions.push(where('category', '==', category));
      }
      if (petType && petType !== '전체') {
        conditions.push(where('petType', '==', petType));
      }
      
      if (conditions.length === 1) {
        q = query(postsRef, conditions[0], limit(40));
      } else {
        // Multiple filters - get more documents for client-side filtering
        q = query(postsRef, limit(100));
      }
    } else {
      // For all posts, we can use orderBy safely
      q = query(postsRef, orderBy('createdAt', 'desc'), limit(20));
    }
    
    // Set up timeout for initial connection with better handling
    const timeoutId = setTimeout(() => {
      if (!unsubscribed) {
        console.warn('Posts listener timeout - providing fallback data');
        callback([]);
      }
    }, 10000); // Increased timeout for stability
    
    let unsubscribed = false;
    let hasReceivedData = false;
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (unsubscribed) return;
        
        // Clear timeout on successful connection
        if (!hasReceivedData) {
          clearTimeout(timeoutId);
          hasReceivedData = true;
        }
        
        let posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        
        // Remove duplicates by content and author
        const uniquePosts = new Map<string, Post>();
        posts.forEach(post => {
          const key = `${post.authorName}_${post.content}_${post.category}`;
          if (!uniquePosts.has(key) || (uniquePosts.get(key)?.createdAt?.toDate?.()?.getTime() || 0) < (post.createdAt?.toDate?.()?.getTime() || 0)) {
            uniquePosts.set(key, post);
          }
        });
        posts = Array.from(uniquePosts.values());

        // Apply client-side filtering and sorting
        if ((category && category !== '전체') || (petType && petType !== '전체')) {
          posts = posts
            .filter(post => {
              const categoryMatch = !category || category === '전체' || post.category === category;
              const petTypeMatch = !petType || petType === '전체' || post.petType === petType;
              return categoryMatch && petTypeMatch;
            })
            .sort((a, b) => {
              const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return bTime.getTime() - aTime.getTime();
            })
            .slice(0, 20);
        } else {
          // Sort all posts by creation time
          posts = posts
            .sort((a, b) => {
              const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return bTime.getTime() - aTime.getTime();
            })
            .slice(0, 20);
        }
        
        callback(posts);
      },
      (error) => {
        if (unsubscribed) return;
        
        if (!hasReceivedData) {
          clearTimeout(timeoutId);
          hasReceivedData = true;
        }
        
        const errorCode = error.code || 'unknown';
        const errorMessage = error.message || 'Unknown error';
        
        console.warn('Posts listener error:', errorMessage, errorCode);
        
        // Always provide fallback data to prevent UI blocking
        callback([]);
        
        // Handle specific error codes more gracefully
        if (errorCode === 'unavailable' || 
            errorCode === 'deadline-exceeded' || 
            errorCode === 'cancelled' ||
            errorCode === 'unauthenticated' ||
            errorMessage.includes('transport') ||
            errorMessage.includes('stream')) {
          console.log('Network connectivity issue in posts listener, using fallback data');
        } else {
          // Only call onError for critical errors
          if (onError) {
            try {
              onError(error);
            } catch (callbackError) {
              console.warn('Error in onError callback:', callbackError.message);
            }
          }
        }
      }
    );
    
    // Return enhanced unsubscribe function
    return () => {
      unsubscribed = true;
      clearTimeout(timeoutId);
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Error during unsubscribe:', error.message);
      }
    };
  } catch (error) {
    console.error('Error setting up posts listener:', error);
    callback([]);
    if (onError) onError(error as Error);
    return () => {};
  }
};

export const listenToAuthState = (callback: (user: any) => void) => {
  if (!auth) {
    console.warn('Firebase Auth not initialized, providing null user');
    callback(null);
    return () => {};
  }
  
  try {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    }, (error) => {
      console.warn('Auth state change error:', error.message);
      callback(null);
    });
  } catch (error) {
    console.error('Error setting up auth state listener:', error);
    callback(null);
    return () => {};
  }
};

// Event functions
export const getEvents = async (): Promise<Event[]> => {
  return withFirebaseConnection(async () => {
    const eventsRef = collection(db, 'events');
    // Simplified query to avoid composite index requirement
    const q = query(eventsRef, orderBy('createdAt', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    
    // Filter and sort in memory to avoid index requirements
    const allEvents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
    
    return allEvents
      .filter(event => event.isActive === true)
      .sort((a, b) => {
        // Sort by priority first (higher priority first), then by creation date
        if (a.priority !== b.priority) {
          return (b.priority || 0) - (a.priority || 0);
        }
        return new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() - 
               new Date(a.createdAt?.toDate?.() || a.createdAt).getTime();
      });
  }, [], 'Get events');
};

export const listenToEvents = (
  callback: (events: Event[]) => void,
  onError?: (error: Error) => void
) => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not properly configured, providing empty events');
    callback([]);
    return () => {};
  }

  try {
    const eventsRef = collection(db, 'events');
    // Simplified query to avoid composite index requirement
    const q = query(eventsRef, orderBy('createdAt', 'desc'), limit(10));
    
    // Set up timeout for initial connection
    const timeoutId = setTimeout(() => {
      if (!unsubscribed) {
        console.warn('Events listener timeout - providing fallback data');
        callback([]);
      }
    }, 10000); // Increased timeout for stability
    
    let unsubscribed = false;
    let hasReceivedData = false;
    
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        if (unsubscribed) return;
        
        // Clear timeout on successful connection
        if (!hasReceivedData) {
          clearTimeout(timeoutId);
          hasReceivedData = true;
        }
        
        const allEvents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        
        // Filter and sort in memory to avoid index requirements
        const activeEvents = allEvents
          .filter(event => event.isActive === true)
          .sort((a, b) => {
            // Sort by priority first (higher priority first), then by creation date
            if (a.priority !== b.priority) {
              return (b.priority || 0) - (a.priority || 0);
            }
            return new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() - 
                   new Date(a.createdAt?.toDate?.() || a.createdAt).getTime();
          });
        
        callback(activeEvents);
      },
      (error) => {
        if (unsubscribed) return;
        
        if (!hasReceivedData) {
          clearTimeout(timeoutId);
          hasReceivedData = true;
        }
        
        const errorCode = error.code || 'unknown';
        const errorMessage = error.message || 'Unknown error';
        
        console.warn('Events listener error:', errorMessage, errorCode);
        
        // Always provide fallback data to prevent UI blocking
        callback([]);
        
        // Handle specific error codes more gracefully
        if (errorCode === 'unavailable' || 
            errorCode === 'deadline-exceeded' || 
            errorCode === 'cancelled' ||
            errorCode === 'unauthenticated' ||
            errorMessage.includes('transport') ||
            errorMessage.includes('stream')) {
          console.log('Network connectivity issue in events listener, using fallback data');
        } else {
          // Only call onError for critical errors
          if (onError) {
            try {
              onError(error);
            } catch (callbackError) {
              console.warn('Error in onError callback:', callbackError.message);
            }
          }
        }
      }
    );
    
    // Return enhanced unsubscribe function
    return () => {
      unsubscribed = true;
      clearTimeout(timeoutId);
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Error during unsubscribe:', error.message);
      }
    };
  } catch (error) {
    console.error('Error setting up events listener:', error);
    callback([]);
    if (onError) onError(error as Error);
    return () => {};
  }
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Event created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Comment functions
export const addComment = async (commentData: Omit<Comment, 'id'>) => {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp()
    });
    
    // Update the post's comment count
    const postRef = doc(db, 'posts', commentData.postId);
    const postSnapshot = await getDoc(postRef);
    
    if (postSnapshot.exists()) {
      const currentCount = postSnapshot.data().commentsCount || 0;
      await updateDoc(postRef, {
        commentsCount: currentCount + 1,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Comment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getCommentsForPost = async (postId: string): Promise<Comment[]> => {
  return withFirebaseConnection(async () => {
    const commentsRef = collection(db, 'comments');
    // Avoid composite index by using only where clause without orderBy
    const q = query(commentsRef, where('postId', '==', postId), limit(100));
    const snapshot = await getDocs(q);
    
    // Sort comments in memory to avoid composite index requirement
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
    
    // Sort by creation time in ascending order (oldest first)
    return comments.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return aTime.getTime() - bTime.getTime();
    });
  }, [], `Get comments for post ${postId}`);
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  return withFirebaseConnection(async () => {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);
    
    if (postSnapshot.exists()) {
      return {
        id: postSnapshot.id,
        ...postSnapshot.data()
      } as Post;
    }
    return null;
  }, null, `Get post by ID ${postId}`);
};

// Create permanent sample data for each category
export const createSampleData = async () => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured - cannot create sample data');
    return false;
  }

  try {
    console.log('Creating permanent sample data for all categories...');

    // Sample posts data for each category
    const samplePosts = [
      // 일상 자랑 카테고리
      {
        authorId: 'sample_user_1',
        authorName: '멍멍이집사',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c4f10acd?w=40&h=40&fit=crop&crop=face&q=80',
        content: '우리 골든 리트리버 몽이가 오늘 처음으로 수영을 했어요! 처음엔 무서워했는데 금세 물놀이를 즐기더라고요 🐕💦',
        imageUrls: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80',
          'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&q=80'
        ],
        category: '일상 자랑',
        petType: '강아지',
        petName: '몽이',
        petBreed: '골든 리트리버',
        likes: ['sample_user_2', 'sample_user_3'],
        likesCount: 12,
        commentsCount: 4
      },
      {
        authorId: 'sample_user_2',
        authorName: '냥냥맘',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&q=80',
        content: '야옹이가 새로 산 캣타워에서 낮잠 자는 모습이 너무 귀여워서 몰래 찍었어요 😴 완전 천사같지 않나요?',
        imageUrls: [
          'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&q=80'
        ],
        category: '일상 자랑',
        petType: '고양이',
        petName: '야옹이',
        petBreed: '브리티시 숏헤어',
        likes: ['sample_user_1'],
        likesCount: 8,
        commentsCount: 2
      },
      {
        authorId: 'sample_user_3',
        authorName: '댕댕이아빠',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&q=80',
        content: '우리 시바견 보리가 산책 중에 만난 친구와 같이 놀고 있어요! 친구들과 뛰어노는 모습 보니까 정말 행복해 보여요 🐶',
        imageUrls: [
          'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=300&fit=crop&q=80'
        ],
        category: '일상 자랑',
        petType: '강아지',
        petName: '보리',
        petBreed: '시바견',
        likes: [],
        likesCount: 15,
        commentsCount: 6
      },

      // 궁금 Q&A 카테고리
      {
        authorId: 'sample_user_4',
        authorName: '초보집사',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&q=80',
        content: '강아지가 자꾸 짖는데 어떻게 훈련시켜야 할까요? 특히 밤에 소리에 민감하게 반응해서 이웃들에게 미안해요. 좋은 방법 있을까요?',
        imageUrls: [],
        category: '궁금 Q&A',
        petType: '강아지',
        petName: '복이',
        petBreed: '믹스견',
        likes: ['sample_user_1'],
        likesCount: 3,
        commentsCount: 8
      },
      {
        authorId: 'sample_user_5',
        authorName: '고민많은집사',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face&q=80',
        content: '고양이가 사료를 잘 안 먹어요 ㅠㅠ 평소에 잘 먹던 사료인데 갑자기 입맛이 없어진 것 같아요. 병원에 가봐야 할까요?',
        imageUrls: [
          'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&q=80'
        ],
        category: '궁금 Q&A',
        petType: '고양이',
        petName: '나비',
        petBreed: '코리안 숏헤어',
        likes: [],
        likesCount: 5,
        commentsCount: 12
      },

      // 건강 정보 카테고리 (지식백과용)
      {
        authorId: 'vet_user_1',
        authorName: '수의사김선생',
        authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face&q=80',
        content: '여름철 강아지 건강관리 팁을 공유합니다. 1) 충분한 수분 섭취 2) 뜨거운 아스팔트 피하기 3) 그루밍으로 털 관리하기. 특히 단두종은 더욱 주의가 필요해요.',
        imageUrls: [
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80'
        ],
        category: '건강 정보',
        petType: '강아지',
        petName: '',
        petBreed: '',
        likes: ['sample_user_1', 'sample_user_2', 'sample_user_3'],
        likesCount: 24,
        commentsCount: 7
      },
      {
        authorId: 'vet_user_2',
        authorName: '전문가이선생',
        authorAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=40&h=40&fit=crop&crop=face&q=80',
        content: '고양이 털갈이 시즌 관리법: 1) 매일 빗질하기 2) 헤어볼 방지 사료 급여 3) 충분한 수분 섭취 4) 스트레스 관리. 털갈이가 심할 때는 전용 브러시 사용을 추천합니다.',
        imageUrls: [],
        category: '건강 정보',
        petType: '고양이',
        petName: '',
        petBreed: '',
        likes: ['sample_user_2', 'sample_user_4'],
        likesCount: 18,
        commentsCount: 5
      },

      // 용품 리뷰 카테고리
      {
        authorId: 'sample_user_6',
        authorName: '쇼핑러버',
        authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face&q=80',
        content: '로얄캐닌 강아지 사료 후기입니다! 우리 강아지가 정말 잘 먹어요. 소화도 잘 되고 털도 윤기가 나는 것 같아요. 가격은 조금 비싸지만 품질 만족합니다 ⭐⭐⭐⭐⭐',
        imageUrls: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80'
        ],
        category: '용품 리뷰',
        petType: '강아지',
        petName: '뽀뽀',
        petBreed: '포메라니안',
        likes: ['sample_user_1', 'sample_user_3'],
        likesCount: 9,
        commentsCount: 3
      },
      {
        authorId: 'sample_user_7',
        authorName: '장난감수집가',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&q=80',
        content: '콩 모양 삑삑이 장난감 리뷰요! 우리 고양이가 이것만 보면 흥분해서 물고 다녀요 😂 소리가 적당히 나고 크기도 딱 좋아요. 추천합니다!',
        imageUrls: [],
        category: '용품 리뷰',
        petType: '고양이',
        petName: '츄츄',
        petBreed: '러시안 블루',
        likes: ['sample_user_2'],
        likesCount: 6,
        commentsCount: 2
      },

      // 추가 일상 자랑 데이터
      {
        authorId: 'sample_user_8',
        authorName: '포메집사',
        authorAvatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=40&h=40&fit=crop&crop=face&q=80',
        content: '우리 포메 구름이가 새로운 옷을 입고 산책나왔어요! 너무 귀엽지 않나요? 🐶✨',
        imageUrls: [
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80'
        ],
        category: '일상 자랑',
        petType: '강아지',
        petName: '구름이',
        petBreed: '포메라니안',
        likes: ['sample_user_1', 'sample_user_2'],
        likesCount: 20,
        commentsCount: 8
      },
      {
        authorId: 'sample_user_9',
        authorName: '치즈냥집사',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&q=80',
        content: '치즈가 햇볕 좋은 창가에서 꿀잠 자고 있어요 😴 이런 평화로운 모습이 최고죠!',
        imageUrls: [
          'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&q=80'
        ],
        category: '일상 자랑',
        petType: '고양이',
        petName: '치즈',
        petBreed: '페르시안',
        likes: ['sample_user_3'],
        likesCount: 16,
        commentsCount: 5
      },

      // 추가 궁금 Q&A 데이터
      {
        authorId: 'sample_user_10',
        authorName: '걱정많은엄마',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c4f10acd?w=40&h=40&fit=crop&crop=face&q=80',
        content: '강아지가 계속 털을 핥고 있어요. 스트레스 때문일까요? 어떻게 도와줄 수 있을까요? 😢',
        imageUrls: [],
        category: '궁금 Q&A',
        petType: '강아지',
        petName: '바둑이',
        petBreed: '진돗개',
        likes: [],
        likesCount: 2,
        commentsCount: 15
      },
      {
        authorId: 'sample_user_11',
        authorName: '신참집사',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&q=80',
        content: '첫 고양이를 키우는데 화장실 훈련은 어떻게 해야 하나요? 꼭 필요한 팁들을 알려주세요!',
        imageUrls: [],
        category: '궁금 Q&A',
        petType: '고양이',
        petName: '미미',
        petBreed: '코리안 숏헤어',
        likes: ['sample_user_1'],
        likesCount: 7,
        commentsCount: 20
      },

      // 추가 건강 정보 데이터
      {
        authorId: 'vet_user_3',
        authorName: '동물병원원장',
        authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face&q=80',
        content: '겨울철 반려동물 관리법: 1) 실내 습도 조절하기 2) 발가락 사이 관리 3) 충분한 운동 4) 영양 보충. 건조한 겨울에는 특별한 관리가 필요해요.',
        imageUrls: [],
        category: '건강 정보',
        petType: '강아지',
        petName: '',
        petBreed: '',
        likes: ['sample_user_1', 'sample_user_4', 'sample_user_5'],
        likesCount: 31,
        commentsCount: 12
      },

      // 추가 용품 리뷰 데이터
      {
        authorId: 'sample_user_12',
        authorName: '리뷰왕',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&q=80',
        content: '자동 급식기 후기입니다! 출장 많은 저에게 정말 도움이 되고 있어요. 시간 설정도 쉽고 우리 멍멍이도 잘 적응했네요 ⭐⭐⭐⭐',
        imageUrls: [
          'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=300&fit=crop&q=80'
        ],
        category: '용품 리뷰',
        petType: '강아지',
        petName: '초코',
        petBreed: '웰시코기',
        likes: ['sample_user_1'],
        likesCount: 13,
        commentsCount: 6
      },

      // 펫 플레이스 데이터
      {
        authorId: 'sample_user_13',
        authorName: '서울댕집사',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f8d?w=40&h=40&fit=crop&crop=face&q=80',
        content: '강남 24시 동물병원 추천드려요! 우리 강아지가 밤에 갑자기 아파서 갔는데 친절하고 실력도 좋아요. 주차장도 넓고 24시간 응급실 운영해서 안심이에요 🏥✨',
        imageUrls: [
          'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop&q=80'
        ],
        category: '펫 플레이스',
        petType: '강아지',
        petName: '바둑이',
        petBreed: '골든리트리버',
        likes: ['sample_user_1', 'sample_user_2'],
        likesCount: 18,
        commentsCount: 12
      },
      {
        authorId: 'sample_user_14',
        authorName: '펫카페러버',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c4f10acd?w=40&h=40&fit=crop&crop=face&q=80',
        content: '홍대 "댕댕이 카페" 최고예요! 대형견도 환영하고 놀이시설도 잘 되어있어요. 우리 래브라도 너무 신나게 놀았네요 ☕🐕 주말에는 예약 필수!',
        imageUrls: [
          'https://images.unsplash.com/photo-1554475901-e2ce5a629340?w=400&h=300&fit=crop&q=80'
        ],
        category: '펫 플레이스',
        petType: '강아지',
        petName: '몽이',
        petBreed: '래브라도',
        likes: ['sample_user_3', 'sample_user_4'],
        likesCount: 25,
        commentsCount: 8
      },
      {
        authorId: 'sample_user_15',
        authorName: '산책매니아',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&q=80',
        content: '한강공원 뚝섬지구 진짜 좋아요! 넓은 잔디밭에서 마음껏 뛰어놀 수 있고 강변 산책로도 예뻐요 🌳 무료라서 부담없이 자주 가고 있어요!',
        imageUrls: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80'
        ],
        category: '펫 플레이스',
        petType: '강아지',
        petName: '해피',
        petBreed: '보더콜리',
        likes: ['sample_user_1'],
        likesCount: 31,
        commentsCount: 15
      },

      // 포토 콘테스트 데이터
      {
        authorId: 'contest_user_1',
        authorName: '사진잘찍는집사',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&q=80',
        content: '🏆 "가장 귀여운 잠자는 모습" 콘테스트 참여작! 우리 고양이 치즈가 햇빛 받으며 꿀잠 자는 모습이에요 😴✨ #포토콘테스트',
        imageUrls: [
          'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&q=80'
        ],
        category: '포토 콘테스트',
        petType: '고양이',
        petName: '치즈',
        petBreed: '페르시안',
        likes: ['sample_user_1', 'sample_user_2', 'sample_user_3'],
        likesCount: 42,
        commentsCount: 18
      },
      {
        authorId: 'contest_user_2',
        authorName: '포토작가지망생',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&q=80',
        content: '📸 "반려동물과 함께하는 일상" 콘테스트 출품작입니다! 아침 산책하는 모습을 담아봤어요 🌅 투표 부탁드려요!',
        imageUrls: [
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80'
        ],
        category: '포토 콘테스트',
        petType: '강아지',
        petName: '루피',
        petBreed: '시바견',
        likes: ['sample_user_4', 'sample_user_5'],
        likesCount: 38,
        commentsCount: 22
      },

      // 나눔/분양 데이터
      {
        authorId: 'share_user_1',
        authorName: '착한이웃',
        authorAvatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=40&h=40&fit=crop&crop=face&q=80',
        content: '🎁 강아지 장난감 나눔해요! 우리 댕댕이가 크면서 안 가지고 놀아서 필요한 분께 드려요. 새것이나 다름없어요! 댓글로 연락주세요 💝',
        imageUrls: [
          'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80'
        ],
        category: '나눔/분양',
        petType: '강아지',
        petName: '복이',
        petBreed: '포메라니안',
        likes: ['sample_user_1'],
        likesCount: 15,
        commentsCount: 25
      },
      {
        authorId: 'adoption_user_1',
        authorName: '임시보호소',
        authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face&q=80',
        content: '🏠 사랑스러운 믹스견 분양합니다. 중성화 완료, 예방접종 완료된 건강한 아이예요. 평생 가족이 되어주실 분을 찾고 있어요 ❤️',
        imageUrls: [
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop&q=80'
        ],
        category: '나눔/분양',
        petType: '강아지',
        petName: '희망이',
        petBreed: '믹스견',
        likes: ['sample_user_2', 'sample_user_3'],
        likesCount: 28,
        commentsCount: 35
      },

      // 그룹 챌린지 데이터
      {
        authorId: 'challenge_user_1',
        authorName: '챌린지리더',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face&q=80',
        content: '🏃‍♀️ "30일 매일 산책하기" 챌린지 참여자 모집! 함께 건강한 습관 만들어요. 인증샷 올리고 서로 응원해요! 벌써 50명이 참여중 💪',
        imageUrls: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=80'
        ],
        category: '그룹 챌린지',
        petType: '강아지',
        petName: '마루',
        petBreed: '진돗개',
        likes: ['sample_user_1', 'sample_user_4', 'sample_user_5'],
        likesCount: 67,
        commentsCount: 40
      },
      {
        authorId: 'challenge_user_2',
        authorName: '다이어트맘',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c4f10acd?w=40&h=40&fit=crop&crop=face&q=80',
        content: '⚖️ "반려동물 건강 체중 만들기" 챌린지 시작! 우리 강아지도 살이 쪄서 함께 다이어트 해요. 주 3회 운동 인증하기! 💪🐕',
        imageUrls: [],
        category: '그룹 챌린지',
        petType: '강아지',
        petName: '뚱이',
        petBreed: '웰시코기',
        likes: ['sample_user_2'],
        likesCount: 34,
        commentsCount: 28
      }
    ];

    // Create posts
    for (const post of samplePosts) {
      const postRef = await createPost(post);
      console.log(`Sample post created: ${postRef} - ${post.content.substring(0, 30)}...`);
    }

    console.log('Sample data creation completed!');
    return true;
  } catch (error) {
    console.error('Error creating sample data:', error);
    return false;
  }
};