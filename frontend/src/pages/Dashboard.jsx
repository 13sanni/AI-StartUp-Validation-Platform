import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { FileText, LogOut, Plus, Clock, Loader2, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../lib/api';

export default function Dashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch real past validations from the backend
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/analyze/history?userId=${user.id}`);
        const data = await res.json();
        if (data.history) {
          setValidations(data.history);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!isAuthenticated) return null;

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
          <Clock size={20} className="text-white" />
          Recent Validations
        </h2>

        {loading ? (
          <div className="space-y-4 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="space-y-3 w-full md:w-2/3">
                  <div className="h-6 w-3/4 rounded-md shimmer-bg"></div>
                  <div className="h-4 w-1/3 rounded-md shimmer-bg"></div>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="h-12 w-16 rounded-md shimmer-bg"></div>
                  <div className="h-10 w-32 rounded-md shimmer-bg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : validations.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Rocket size={40} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white/50 mb-2">No validations yet</h3>
            <p className="text-white/30 mb-6">Submit your first startup idea to get a comprehensive AI analysis.</p>
            <Link to="/" className="btn-primary py-2 px-6 text-sm inline-flex">
              <Plus size={16} />
              Validate Your First Idea
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {validations.map((val) => (
              <div key={val.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">{val.idea}</h3>
                  <p className="text-sm text-white/40">
                    {new Date(val.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {' • '}
                    Status: <span className="text-white font-semibold">{val.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  {val.score && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{val.score}/100</div>
                      <div className="text-xs text-white/40">Viability Score</div>
                    </div>
                  )}
                  {val.report && (
                    <button
                      onClick={() => navigate('/report', { state: { report: val.report } })}
                      className="btn-outline py-2"
                    >
                      <FileText size={16} />
                      View Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.main>
  );
}
