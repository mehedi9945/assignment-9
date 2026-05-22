import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-6 py-12 text-center select-none">
      <div className="max-w-md w-full space-y-8">
        {/* SVG Illustration of Lost Dog */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex justify-center"
        >
          <svg
            className="w-64 h-64 text-primary animate-bounce-slow"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Circle */}
            <circle cx="100" cy="100" r="80" className="fill-primary/5" />
            
            {/* Dog Head Outline */}
            <path
              d="M70 120C70 142.091 87.9086 160 110 160C132.091 160 150 142.091 150 120C150 97.9086 132.091 80 110 80C87.9086 80 70 97.9086 70 120Z"
              className="fill-base-100 stroke-primary"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Left Ear */}
            <path
              d="M75 90C65 75 50 85 55 105C60 125 72 120 72 120"
              className="fill-primary/10 stroke-primary"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Right Ear */}
            <path
              d="M145 90C155 75 170 85 165 105C160 125 148 120 148 120"
              className="fill-primary/10 stroke-primary"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Eyes */}
            <circle cx="95" cy="115" r="5" className="fill-primary" />
            <circle cx="125" cy="115" r="5" className="fill-primary" />
            
            {/* Eye Brows */}
            <path d="M90 108C93 105 97 105 100 108" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
            <path d="M120 108C123 105 127 105 130 108" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />

            {/* Nose */}
            <path
              d="M106 128C106 130.209 107.791 132 110 132C112.209 132 114 130.209 114 128H106Z"
              className="fill-secondary"
            />
            <path
              d="M110 132V140M105 142C107 144 110 144 110 142M110 142C110 144 113 144 115 142"
              className="stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Cute Question Mark */}
            <path
              d="M135 60C135 50 145 50 145 55C145 60 138 62 138 65M138 72H138.01"
              className="stroke-secondary"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-6xl font-extrabold text-primary tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-base-content">Aww, You Look Lost!</h2>
          <p className="text-base-content/65 max-w-sm mx-auto text-sm leading-relaxed">
            The page you are looking for does not exist, has been renamed, or has run away in search of a companion.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link 
            to="/" 
            className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 inline-flex items-center gap-2 group"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
