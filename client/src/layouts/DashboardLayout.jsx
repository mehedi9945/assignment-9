import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { 
  ClipboardList, PlusCircle, HeartHandshake, Home, 
  Menu, X, PawPrint, LogOut, ArrowLeftRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    {
      label: 'My Listings',
      path: '/dashboard/my-listings',
      icon: ClipboardList,
    },
    {
      label: 'Add Pet',
      path: '/dashboard/add-pet',
      icon: PlusCircle,
    },
    {
      label: 'My Requests',
      path: '/dashboard/my-requests',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-base-100 border-r border-base-300 shrink-0">
        {/* Brand header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-base-200">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <PawPrint className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FurEver Console
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-content shadow-md shadow-primary/15'
                    : 'text-base-content/75 hover:bg-base-200 hover:text-base-content'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-base-200 space-y-3 bg-base-100/50">
          <div className="flex items-center gap-3 px-2">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user?.photoURL || 'https://i.ibb.co.com/8m4Xkwc/avatar-placeholder.png'} alt={user?.displayName || 'User'} />
              </div>
            </div>
            <div className="truncate">
              <h4 className="font-bold text-sm text-base-content truncate">{user?.displayName || 'Adopter'}</h4>
              <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/" className="btn btn-outline btn-sm rounded-lg text-xs flex gap-1 items-center">
              <Home className="h-3 w-3" />
              Home
            </Link>
            <button 
              onClick={handleLogout}
              className="btn btn-error btn-outline btn-sm rounded-lg text-xs flex gap-1 items-center"
            >
              <LogOut className="h-3 w-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer / Slide-over */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-base-100 h-full shadow-2xl border-r border-base-200 transition-transform duration-300">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 px-6 py-5 border-b border-base-200 mt-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <PawPrint className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FurEver Console
              </span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-content shadow-md shadow-primary/15'
                        : 'text-base-content/75 hover:bg-base-200 hover:text-base-content'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-base-200 space-y-3 bg-base-100/50">
              <div className="flex items-center gap-3 px-2">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={user?.photoURL || 'https://i.ibb.co.com/8m4Xkwc/avatar-placeholder.png'} alt={user?.displayName || 'User'} />
                  </div>
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-sm text-base-content truncate">{user?.displayName || 'Adopter'}</h4>
                  <p className="text-xs text-base-content/50 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/" className="btn btn-outline btn-sm rounded-lg text-xs flex gap-1 items-center">
                  <Home className="h-3 w-3" />
                  Home
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-error btn-outline btn-sm rounded-lg text-xs flex gap-1 items-center"
                >
                  <LogOut className="h-3 w-3" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main content body */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Top Header (Visible on Mobile, or for Title) */}
        <header className="flex lg:hidden items-center justify-between px-6 py-4 bg-base-100 border-b border-base-300 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="btn btn-ghost btn-circle"
            aria-label="Open Sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link to="/" className="flex items-center gap-1 text-md font-bold text-primary">
            <PawPrint className="h-5 w-5" />
            <span>FurEver Home</span>
          </Link>

          <div className="avatar">
            <div className="w-8 rounded-full ring-2 ring-primary/20">
              <img src={user?.photoURL || 'https://i.ibb.co.com/8m4Xkwc/avatar-placeholder.png'} alt="Profile" />
            </div>
          </div>
        </header>

        {/* Content Nested Router Outlet */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
