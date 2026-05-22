import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase.config';
import { signOut } from 'firebase/auth';

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const status = error.response ? error.response.status : null;
        if (status === 401 || status === 403) {
          // Sign out from firebase
          await signOut(auth);
          // Optional: clear any client side state if needed
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
