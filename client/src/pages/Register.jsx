import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { User, Mail, Link as LinkIcon, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch password field to validate confirm password matches
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      // 1. Create User
      const userCredential = await createUser(data.email, data.password);
      
      // 2. Update Profile with Name and Photo URL
      await updateUserProfile(data.name, data.photoUrl);
      
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        toast.error('Email is already registered.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Logged in with Google successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Google Login failed.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-base-200/50">
      <div className="card bg-base-100 w-full max-w-lg shadow-xl border border-base-200 rounded-3xl overflow-hidden">
        <div className="card-body p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-base-content">Create Account</h2>
            <p className="text-sm text-base-content/60">Join us to start listing or adopting pets</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`input input-bordered w-full pl-10 rounded-xl focus:outline-primary ${errors.name ? 'input-error' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && (
                <span className="text-error text-xs mt-1">{errors.name.message}</span>
              )}
            </div>

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

            {/* Photo URL Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Photo URL</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                  <LinkIcon className="h-5 w-5" />
                </span>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  className={`input input-bordered w-full pl-10 rounded-xl focus:outline-primary ${errors.photoUrl ? 'input-error' : ''}`}
                  {...register('photoUrl', {
                    required: 'Photo URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Invalid URL format',
                    },
                  })}
                />
              </div>
              {errors.photoUrl && (
                <span className="text-error text-xs mt-1">{errors.photoUrl.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 characters',
                      },
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) || 'Must contain at least one uppercase letter',
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) || 'Must contain at least one lowercase letter',
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <span className="text-error text-xs mt-1">{errors.password.message}</span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Confirm Password</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 rounded-xl focus:outline-primary ${errors.confirmPassword ? 'input-error' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="text-error text-xs mt-1">{errors.confirmPassword.message}</span>
                )}
              </div>
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
                  Register Account
                  <UserPlus className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-xs text-base-content/40">OR REGISTER WITH</div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-base-200"
          >
            <FaGoogle className="text-primary h-4 w-4" />
            Google Registration
          </button>

          {/* Footer Navigation */}
          <p className="text-center text-sm text-base-content/75 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
              <ArrowLeft className="h-3.5 w-3.5 mr-0.5" />
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
