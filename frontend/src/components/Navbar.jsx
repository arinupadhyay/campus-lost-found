import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, PlusCircle, User, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl">L&F</span>
            <span className="font-bold text-xl text-gray-800">Campus Portal</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center space-x-1">
              <Search size={18} />
              <span>Browse Items</span>
            </Link>

            {user && (
              <Link to="/create-post" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center space-x-1">
                <PlusCircle size={18} />
                <span>Report Item</span>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className="text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1">
                <Shield size={18} />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* User Auth Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium">
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;