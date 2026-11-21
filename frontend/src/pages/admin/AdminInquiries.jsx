import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  LogOut,
  Search,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  X,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const AdminInquiries = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  }, [navigate]);

  const fetchInquiries = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/admin/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(response.data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  const filterInquiries = useCallback(() => {
    let filtered = [...inquiries];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (inq) =>
          inq.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inq.phone.includes(searchTerm)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((inq) => inq.status === statusFilter);
    }
    
    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter]);

  useEffect(() => {
    document.title = "Inquiries - Dhota Admin";
    fetchInquiries();
  }, [fetchInquiries]);

  useEffect(() => {
    filterInquiries();
  }, [filterInquiries]);

  const updateStatus = async (inquiryId, status, notes = null) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API}/admin/inquiries/${inquiryId}`,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated successfully");
      fetchInquiries();
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status, notes });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteInquiry = async (inquiryId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API}/admin/inquiries/${inquiryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Inquiry deleted successfully");
      fetchInquiries();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-700';
      case 'contacted': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" data-testid="admin-inquiries">
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
            className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded"
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
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-colors"
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                INQUIRIES
              </h1>
              <p className="text-gray-600 mt-1">Manage customer inquiries</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border-2 border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-none border-gray-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-none border-gray-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No inquiries found
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{inquiry.full_name}</p>
                            <p className="text-sm text-gray-500">{inquiry.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{inquiry.project_type}</p>
                          {inquiry.estimated_area && (
                            <p className="text-sm text-gray-500">{inquiry.estimated_area} sq ft</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {inquiry.project_location}
                        </td>
                        <td className="px-6 py-4">
                          <Select
                            value={inquiry.status}
                            onValueChange={(value) => updateStatus(inquiry.id, value)}
                          >
                            <SelectTrigger className={`w-32 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(inquiry.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInquiry(inquiry);
                                setIsModalOpen(true);
                              }}
                              className="rounded-none"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="rounded-none text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Inquiry Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Oswald, sans-serif' }}>
              INQUIRY DETAILS
            </DialogTitle>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="font-semibold">{selectedInquiry.full_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedInquiry.status)}`}>
                    {selectedInquiry.status}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <a href={`tel:${selectedInquiry.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-[#D69A55]">
                  <Phone className="w-4 h-4" />
                  {selectedInquiry.phone}
                </a>
                <a href={`mailto:${selectedInquiry.email}`} className="flex items-center gap-2 text-gray-600 hover:text-[#D69A55]">
                  <Mail className="w-4 h-4" />
                  {selectedInquiry.email}
                </a>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {selectedInquiry.project_location}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm text-gray-500">Project Type</label>
                  <p className="font-semibold">{selectedInquiry.project_type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Estimated Area</label>
                  <p className="font-semibold">{selectedInquiry.estimated_area || 'Not specified'} sq ft</p>
                </div>
              </div>

              {selectedInquiry.message && (
                <div className="pt-4 border-t">
                  <label className="text-sm text-gray-500">Message</label>
                  <p className="text-gray-700 mt-1">{selectedInquiry.message}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <label className="text-sm text-gray-500 mb-2 block">Update Status</label>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(value) => updateStatus(selectedInquiry.id, value)}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <a 
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-none">
                    WhatsApp
                  </Button>
                </a>
                <a href={`tel:${selectedInquiry.phone}`} className="flex-1">
                  <Button className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none">
                    Call Now
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInquiries;
