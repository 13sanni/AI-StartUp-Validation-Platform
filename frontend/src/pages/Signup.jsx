import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../lib/api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to sign up.');
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
          <h2 className="section-heading text-3xl mb-2">Create <span className="text-gradient">Account</span></h2>
          <p className="text-white/40 text-center mb-8">Join to start validating your startup ideas.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3 text-white/30" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
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
              <UserPlus size={18} />
              Sign Up
            </button>
          </form>
          
          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </motion.main>
  );
}
