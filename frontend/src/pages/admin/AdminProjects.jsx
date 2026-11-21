import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  LogOut,
  Plus,
  Trash2,
  Edit,
  Star,
  X,
  Upload,
  Image as ImageIcon
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "residential",
    location: "",
    image_url: "",
    images: [],
    is_featured: false
  });

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  }, [navigate]);

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API}/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    document.title = "Project Gallery - Dhota Admin";
    fetchProjects();
  }, [fetchProjects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Validate file count
    if (files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    
    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const validFiles = [];
    const previews = [];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Please upload JPG, PNG, or GIF images only.`);
        continue;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        continue;
      }
      
      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === validFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    }
    
    setSelectedFiles(validFiles);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const formDataUpload = new FormData();
      
      selectedFiles.forEach(file => {
        formDataUpload.append("files", file);
      });
      
      const response = await axios.post(`${API}/admin/upload-images`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data.image_urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if image is provided
    if (!editingProject && selectedFiles.length === 0) {
      toast.error("Please select at least one image for the project");
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      let projectData = { ...formData };
      
      // Upload new images if files are selected
      if (selectedFiles.length > 0) {
        const imageUrls = await uploadImages();
        
        if (imageUrls.length === 0) {
          return; // Upload failed
        }
        
        projectData = {
          ...formData,
          image_url: imageUrls[0],
          images: imageUrls.length > 1 ? imageUrls.slice(1) : []
        };
      }
      
      if (editingProject) {
        await axios.put(
          `${API}/admin/projects/${editingProject.id}`,
          projectData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Project updated successfully");
      } else {
        await axios.post(
          `${API}/admin/projects`,
          projectData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Project created successfully");
      }
      
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API}/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        location: project.location,
        image_url: project.image_url,
        images: project.images || [],
        is_featured: project.is_featured
      });
      const allImages = [project.image_url, ...(project.images || [])];
      setImagePreviews(allImages);
      setSelectedFiles([]);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        category: "residential",
        location: "",
        image_url: "",
        images: [],
        is_featured: false
      });
      setImagePreviews([]);
      setSelectedFiles([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setSelectedFiles([]);
    setImagePreviews([]);
    setFormData({
      title: "",
      description: "",
      category: "residential",
      location: "",
      image_url: "",
      images: [],
      is_featured: false
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      residential: "Residential",
      commercial: "Commercial",
      renovation: "Renovation",
      interior: "Interior"
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-100" data-testid="admin-projects">
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
            className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded"
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
                PROJECT GALLERY
              </h1>
              <p className="text-gray-600 mt-1">Manage your project showcase</p>
            </div>
            <Button 
              onClick={() => openModal()}
              className="bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600 mb-6">Add your first project to showcase in the gallery</p>
              <Button 
                onClick={() => openModal()}
                className="bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-gray-200 overflow-hidden group"
                >
                  <div className="relative h-48">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1706808049803-f61304e024ab?w=600';
                      }}
                    />
                    {project.is_featured && (
                      <div className="absolute top-2 left-2 bg-[#D69A55] text-white px-2 py-1 text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openModal(project)}
                        className="bg-white text-gray-900 hover:bg-gray-100 rounded-none"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        className="bg-red-500 text-white hover:bg-red-600 rounded-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[#D69A55] font-semibold uppercase">
                      {getCategoryLabel(project.category)}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-1">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Project Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Oswald, sans-serif' }}>
              {editingProject ? 'EDIT PROJECT' : 'ADD NEW PROJECT'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Modern Villa Construction"
                className="rounded-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Brief description of the project"
                className="rounded-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="interior">Interior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Giridih, Jharkhand"
                  className="rounded-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Images * (Select multiple images)
              </label>
              
              {/* File Upload Area */}
              <div className="space-y-3">
                <label 
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-none cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D69A55] mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Uploading...</p>
                      </div>
                    ) : imagePreviews.length > 0 ? (
                      <div className="text-center">
                        <div className="flex gap-2 flex-wrap justify-center mb-2">
                          {imagePreviews.slice(0, 3).map((preview, idx) => (
                            <img 
                              key={idx}
                              src={preview} 
                              alt={`Preview ${idx + 1}`} 
                              className="h-20 w-20 object-cover"
                            />
                          ))}
                          {imagePreviews.length > 3 && (
                            <div className="h-20 w-20 bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                              +{imagePreviews.length - 3}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{imagePreviews.length} image(s) selected</p>
                        <p className="text-xs text-gray-400 mt-1">Click to change images</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold text-[#D69A55]">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">Select multiple images (max 10, 5MB each)</p>
                        <p className="text-xs text-gray-400">JPG, PNG, GIF</p>
                      </>
                    )}
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const newFiles = selectedFiles.filter((_, i) => i !== idx);
                            const newPreviews = imagePreviews.filter((_, i) => i !== idx);
                            setSelectedFiles(newFiles);
                            setImagePreviews(newPreviews);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="text-sm font-medium text-gray-700">
                Featured Project
              </label>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1 rounded-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none"
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
