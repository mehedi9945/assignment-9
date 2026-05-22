import { createContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
import useAxiosPublic from '../hooks/useAxiosPublic';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await axiosPublic.post('/api/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout cookie clear error", err);
    }
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    }).then(() => {
      // Refresh current user state
      setUser({ ...auth.currentUser });
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        // Send email to backend to get token in cookie
        try {
          await axiosPublic.post('/api/jwt', { email: currentUser.email }, { withCredentials: true });
        } catch (err) {
          console.error("JWT creation error", err);
        }
      } else {
        // Clear token cookie
        try {
          await axiosPublic.post('/api/logout', {}, { withCredentials: true });
        } catch (err) {
          console.error("JWT clearing error", err);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [axiosPublic]);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    signInWithGoogle,
    logOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
