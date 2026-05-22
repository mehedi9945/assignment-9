import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const { signInUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path or default to Home page
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signInUser(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        toast.error('Invalid email or password.');
      } else {
        toast.error(error.message || 'Failed to login. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Logged in with Google successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Google Login failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-base-200/50">
      <div className="card bg-base-100 w-full max-w-md shadow-xl border border-base-200 rounded-3xl overflow-hidden">
        <div className="card-body p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-base-content">Welcome Back</h2>
            <p className="text-sm text-base-content/60">Log in to manage your listings and adoption requests</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`input input-bordered w-full pl-10 rounded-xl focus:outline-primary ${errors.email ? 'input-error' : ''}`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-error text-xs mt-1">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 rounded-xl focus:outline-primary ${errors.password ? 'input-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
              </div>
              {errors.password && (
                <span className="text-error text-xs mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full rounded-xl mt-4 font-bold shadow-md shadow-primary/10"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Log In
                  <LogIn className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-xs text-base-content/40">OR CONTINUE WITH</div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-base-200"
          >
            <FaGoogle className="text-primary h-4 w-4" />
            Google Login
          </button>

          {/* Footer Navigation */}
          <p className="text-center text-sm text-base-content/75 mt-4">
            New to FurEver Home?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              Create an account
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
