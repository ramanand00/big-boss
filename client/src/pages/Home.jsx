import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { toast } from 'react-hot-toast';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { loading } = useAuthRedirect(true);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <nav className="bg-white shadow-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary-600">AuthApp</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Welcome, {user?.name}!</span>
        <button
          onClick={() => navigate('/profile')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="btn-secondary"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            You have successfully logged in with OTP verification
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h3>
              <p className="text-gray-600">Email: {user?.email}</p>
              <p className="text-gray-600">Contact: {user?.contact}</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Status</h3>
              <p className="text-green-600 font-medium">✓ Email Verified</p>
              <p className="text-gray-600 mt-2">Last login: Today</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              <button className="w-full mb-2 btn-secondary">Update Profile</button>
              <button className="w-full btn-secondary">Change Password</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;