import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  LogOut,
  Users,
  AlertCircle,
  Clock,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { fetchAdminStatsFromSupabase, signOutAdmin, API, BACKEND_URL } from "@/lib/supabase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    await signOutAdmin();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    try {
      try {
        const statsData = await fetchAdminStatsFromSupabase();
        setStats(statsData);
        setIsLoading(false);
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase stats query fallback:", sbErr);
      }

      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    document.title = "Dashboard - Dhota Admin";
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchStats();
  }, [fetchStats]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 text-white p-6">
        <div className="flex items-center gap-3 mb-8">
          <img 
            src="https://customer-assets.emergentagent.com/job_construct-dhota/artifacts/u7scmm47_WhatsApp%20Image%202025-12-25%20at%2019.24.16.jpeg" 
            alt="Logo" 
            className="w-10 h-10 rounded"
          />
          <span className="text-lg font-bold" style={{ fontFamily: 'Oswald, sans-serif' }}>
            DHOTA ADMIN
          </span>
        </div>

        <nav className="space-y-2">
          <Link 
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            to="/admin/inquiries"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Inquiries
            {stats?.new_inquiries > 0 && (
              <span className="ml-auto bg-[#D69A55] text-white text-xs px-2 py-1 rounded-full">
                {stats.new_inquiries}
              </span>
            )}
          </Link>
          <Link 
            to="/admin/projects"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <FolderOpen className="w-5 h-5" />
            Project Gallery
          </Link>
          <Link 
            to="/admin/reviews"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <Star className="w-5 h-5" />
            Reviews
            {stats?.pending_reviews > 0 && (
              <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.pending_reviews}
              </span>
            )}
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-gray-700 pt-4 mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold">{user?.username || 'Admin'}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white rounded-none"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                DASHBOARD
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.username || 'Admin'}!</p>
            </div>
            <Link to="/" target="_blank">
              <Button 
                variant="outline"
                className="border-gray-300 rounded-none"
              >
                View Website
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 border border-gray-200 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 text-sm font-medium">Total Inquiries</span>
                  <MessageSquare className="w-5 h-5 text-[#D69A55]" />
                </div>
                <p className="stat-number text-4xl font-bold text-gray-900">
                  {stats?.total_inquiries || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 text-sm font-medium">New Inquiries</span>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className="stat-number text-4xl font-bold text-gray-900">
                  {stats?.new_inquiries || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 text-sm font-medium">Gallery Projects</span>
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                </div>
                <p className="stat-number text-4xl font-bold text-gray-900">
                  {stats?.total_projects || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 text-sm font-medium">Pending Reviews</span>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="stat-number text-4xl font-bold text-gray-900">
                  {stats?.pending_reviews || 0}
                </p>
              </motion.div>
            </div>
          )}

          {/* Recent Inquiries */}
          <div className="bg-white border-2 border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                RECENT INQUIRIES
              </h2>
              <Link to="/admin/inquiries" className="text-[#D69A55] hover:underline text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {stats?.recent_inquiries?.length > 0 ? (
                stats.recent_inquiries.map((inquiry, index) => (
                  <div key={inquiry.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{inquiry.full_name}</p>
                        <p className="text-sm text-gray-500">{inquiry.project_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        inquiry.status === 'new' 
                          ? 'bg-green-100 text-green-700'
                          : inquiry.status === 'contacted'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {inquiry.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(inquiry.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No inquiries yet
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
