import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  LogOut,
  Star,
  Check,
  X,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { 
  fetchAdminReviewsFromSupabase, 
  updateReviewStatusInSupabase, 
  updateReviewImageApprovalInSupabase, 
  deleteReviewFromSupabase, 
  signOutAdmin,
  API,
  BACKEND_URL 
} from "@/lib/supabase";

const AdminReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState(new Set());

  const handleLogout = useCallback(async () => {
    await signOutAdmin();
    navigate("/admin/login");
  }, [navigate]);

  const fetchReviews = useCallback(async () => {
    try {
      try {
        const data = await fetchAdminReviewsFromSupabase();
        setReviews(data);
        setIsLoading(false);
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase reviews fetch fallback:", sbErr);
      }

      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    document.title = "Reviews - Dhota Admin";
    fetchReviews();
  }, [fetchReviews]);

  const updateReviewStatus = async (reviewId, status) => {
    try {
      try {
        await updateReviewStatusInSupabase(reviewId, status);
        toast.success(`Review ${status} successfully`);
        fetchReviews();
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase update review status fallback:", sbErr);
      }

      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API}/admin/reviews/${reviewId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Review ${status} successfully`);
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review");
    }
  };

  const updateImageApproval = async (reviewId, imageUrl, approved) => {
    try {
      try {
        await updateReviewImageApprovalInSupabase(reviewId, imageUrl, approved);
        toast.success(`Image ${approved ? 'approved' : 'rejected'} successfully`);
        fetchReviews();
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase update image approval fallback:", sbErr);
      }

      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API}/admin/reviews/${reviewId}/images`,
        { image_url: imageUrl, approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Image ${approved ? 'approved' : 'rejected'} successfully`);
      fetchReviews();
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      try {
        await deleteReviewFromSupabase(reviewId);
        toast.success("Review deleted successfully");
        fetchReviews();
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase delete review fallback:", sbErr);
      }

      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API}/admin/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const toggleExpanded = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" data-testid="admin-reviews">
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
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-colors"
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
            className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded"
          >
            <Star className="w-5 h-5" />
            Reviews
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
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
          <div className="mb-8">
            <h1 
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              CUSTOMER REVIEWS
            </h1>
            <p className="text-gray-600 mt-1">Manage customer reviews and approve images</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 p-12 text-center">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600">Customer reviews will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{review.name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-[#D69A55] fill-[#D69A55]" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Email:</strong> {review.email} | <strong>Phone:</strong> {review.phone}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Location:</strong> {review.location} | <strong>Project:</strong> {review.project_type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {review.status !== "approved" && (
                        <Button
                          size="sm"
                          onClick={() => updateReviewStatus(review.id, "approved")}
                          className="bg-green-500 hover:bg-green-600 text-white rounded-none"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.status !== "rejected" && (
                        <Button
                          size="sm"
                          onClick={() => updateReviewStatus(review.id, "rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-none"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReview(review.id)}
                        className="border-red-500 text-red-500 hover:bg-red-50 rounded-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {/* Images Section */}
                  {review.images && review.images.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <button
                        onClick={() => toggleExpanded(review.id)}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 hover:text-[#D69A55]"
                      >
                        {expandedReviews.has(review.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {review.images.length} Image(s) - Click to {expandedReviews.has(review.id) ? 'collapse' : 'expand'}
                      </button>

                      {expandedReviews.has(review.id) && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {review.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img.url.startsWith('http') ? img.url : `${BACKEND_URL}${img.url}`}
                                alt={`Review ${idx + 1}`}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1706808049803-f61304e024ab?w=200';
                                }}
                              />
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!img.approved && (
                                  <button
                                    onClick={() => updateImageApproval(review.id, img.url, true)}
                                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                                    title="Approve Image"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                {img.approved && (
                                  <button
                                    onClick={() => updateImageApproval(review.id, img.url, false)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                    title="Reject Image"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <div className="absolute bottom-2 left-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                  img.approved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                }`}>
                                  {img.approved ? 'Approved' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReviews;
