import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { FileText, LogOut, Plus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Mock data for validations
  const pastValidations = [
    { id: 1, idea: 'AI Fitness Coach for Beginners', date: '2026-06-08', score: 78, status: 'Completed' },
    { id: 2, idea: 'Smart Restaurant Inventory Management', date: '2026-06-05', score: 85, status: 'Completed' },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-12"
    >
      <div className="container max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Founder'}</h1>
            <p className="text-white/50">Manage your startup ideas and validation reports.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-primary py-2 px-5 text-sm">
              <Plus size={16} />
              New Validation
            </Link>
            <button onClick={handleLogout} className="btn-outline py-2 px-4 border-white/10 hover:border-red-500/50 hover:text-red-400">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-brand-primary" />
          Recent Validations
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {pastValidations.map((val) => (
            <div key={val.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{val.idea}</h3>
                <p className="text-sm text-white/40">{val.date} • Status: {val.status}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient-green">{val.score}/100</div>
                  <div className="text-xs text-white/40">Viability Score</div>
                </div>
                <Link to={`/report/${val.id}`} className="btn-outline py-2">
                  <FileText size={16} />
                  View Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}
