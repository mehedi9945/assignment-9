import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { PawPrint, LogOut, LayoutDashboard, Sun, Moon, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navLinks = (
    <>
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-base-content/80 hover:text-primary'}`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/all-pets" 
          className={({ isActive }) => 
            `font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-base-content/80 hover:text-primary'}`
          }
        >
          All Pets
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink 
              to="/dashboard/my-requests" 
              className={({ isActive }) => 
                `font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-base-content/80 hover:text-primary'}`
              }
            >
              My Requests
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/add-pet" 
              className={({ isActive }) => 
                `font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-base-content/80 hover:text-primary'}`
              }
            >
              Add Pet
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 md:px-8">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden p-1 mr-2 text-base-content" aria-label="Menu">
            <Menu className="h-6 w-6" />
          </label>
          <ul 
            tabIndex={0} 
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 gap-1 border border-base-200"
          >
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
          <div className="p-2 bg-primary/10 rounded-xl">
            <PawPrint className="h-6 w-6 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FurEver Home
          </span>
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-6">
          {navLinks}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end gap-3">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="btn btn-ghost btn-circle text-base-content" 
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-neutral-content/70 hover:text-primary transition-colors" />
          ) : (
            <Sun className="h-5 w-5 text-warning transition-colors" />
          )}
        </button>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar online ring-2 ring-primary/20 hover:ring-primary transition-all">
              <div className="w-10 rounded-full">
                <img 
                  src={user.photoURL || 'https://i.ibb.co.com/8m4Xkwc/avatar-placeholder.png'} 
                  alt={user.displayName || 'User Profile'} 
                  referrerPolicy="no-referrer"
                />
              </div>
            </label>
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-base-100 rounded-2xl w-60 border border-base-200 gap-1"
            >
              <li className="px-3 py-2 border-b border-base-200 mb-2">
                <p className="font-semibold text-base-content">{user.displayName || 'Adopter'}</p>
                <p className="text-xs text-base-content/60 truncate">{user.email}</p>
              </li>
              <li>
                <Link to="/dashboard/my-listings" className="flex items-center gap-2 py-2">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 py-2 text-error hover:bg-error/10 hover:text-error rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm md:btn-md rounded-xl shadow-md hover:shadow-primary/20">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
