import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Toasts */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: 'bg-base-100 text-base-content border border-base-200 shadow-xl rounded-xl font-medium',
          duration: 3000,
          style: {
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary, #641ae6)',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
