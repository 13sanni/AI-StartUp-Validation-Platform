import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call for now since backend is not fully connected
    try {
      const mockUser = { id: '1', email, name: 'Founder' };
      const mockToken = 'mock_jwt_token_123';
      
      dispatch(setCredentials({ user: mockUser, token: mockToken }));
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to log in.');
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center pt-20"
    >
      <div className="container max-w-md">
        <div className="glass-card p-8">
          <h2 className="section-heading text-3xl mb-2">Welcome <span className="text-gradient">Back</span></h2>
          <p className="text-white/40 text-center mb-8">Login to view your startup validations.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-white/30" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-white/30" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-4">
              <LogIn size={18} />
              Login
            </button>
          </form>
          
          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account? <Link to="/signup" className="text-brand-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </motion.main>
  );
}
