import { useCallback, useEffect, useState, useRef } from "react";
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
import { 
  fetchAdminProjectsFromSupabase, 
  createProjectInSupabase, 
  updateProjectInSupabase, 
  deleteProjectFromSupabase, 
  uploadImageToSupabase, 
  signOutAdmin 
} from "@/lib/supabase";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const fileInputRef = useRef(null);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "residential",
    location: "",
    image_url: "",
    images: [],
    is_featured: false
  });

  const handleLogout = useCallback(async () => {
    await signOutAdmin();
    navigate("/admin/login");
  }, [navigate]);

  const fetchProjects = useCallback(async () => {
    try {
      try {
        const data = await fetchAdminProjectsFromSupabase();
        setProjects(data);
        setIsLoading(false);
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase projects fetch fallback:", sbErr);
      }

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

  const handleFilesAdded = (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const incoming = Array.from(filesList);

    const currentTotal = existingImages.length + selectedFiles.length;
    const maxAllowed = 15;

    if (currentTotal >= maxAllowed) {
      toast.error(`Maximum limit of ${maxAllowed} images reached for this project.`);
      return;
    }

    const validFiles = [];
    const previews = [];

    for (const file of incoming) {
      if (currentTotal + validFiles.length >= maxAllowed) {
        toast.warning(`Only up to ${maxAllowed} images can be added.`);
        break;
      }

      // Check if image
      const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);
      if (!isImage) {
        toast.error(`"${file.name}" is not a recognized image format.`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 10MB limit.`);
        continue;
      }

      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setNewPreviews((prev) => [...prev, ...previews]);
      toast.success(`Added ${validFiles.length} image${validFiles.length > 1 ? "s" : ""}. Total: ${currentTotal + validFiles.length}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeExistingImage = (index) => {
    const toRemove = existingImages[index];
    if (toRemove) {
      setRemovedImages((prev) => [...prev, toRemove]);
    }
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("Image marked for removal. Click Update Project to save changes.");
  };

  const removeNewFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => {
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    toast.info("Image removed");
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];
    
    setIsUploading(true);
    try {
      // 1. Direct Supabase Storage upload
      try {
        const uploadPromises = selectedFiles.map(file => uploadImageToSupabase(file, "projects"));
        const uploadedUrls = await Promise.all(uploadPromises);
        return uploadedUrls;
      } catch (sbErr) {
        console.warn("Direct Supabase storage upload fallback:", sbErr);
      }

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
      
      return response.data.image_urls || [];
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
    
    const totalImagesCount = existingImages.length + selectedFiles.length;
    if (totalImagesCount === 0) {
      toast.error("Please add at least one image for the project");
      return;
    }
    
    setIsUploading(true);
    try {
      let newlyUploadedUrls = [];
      
      if (selectedFiles.length > 0) {
        toast.info(`Uploading ${selectedFiles.length} new image(s)...`);
        newlyUploadedUrls = await uploadImages();
        if (newlyUploadedUrls.length === 0) {
          toast.error("Failed to upload new images. Please try again.");
          setIsUploading(false);
          return;
        }
      }

      const allFinalImages = [...existingImages, ...newlyUploadedUrls];
      if (allFinalImages.length === 0) {
        toast.error("No images available to save");
        setIsUploading(false);
        return;
      }
      
      const projectData = {
        ...formData,
        image_url: allFinalImages[0],
        images: allFinalImages.length > 1 ? allFinalImages.slice(1) : []
      };
      
      // 1. Direct Supabase Save
      try {
        if (editingProject) {
          await updateProjectInSupabase(editingProject.id, projectData, removedImages);
          toast.success("Project updated successfully");
        } else {
          await createProjectInSupabase(projectData);
          toast.success("Project created successfully");
        }
        fetchProjects();
        closeModal();
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase save fallback:", sbErr);
      }

      const token = localStorage.getItem("adminToken");
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
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const projectToDelete = projects.find((p) => p.id === projectId);
    const imagesToDelete = projectToDelete
      ? [projectToDelete.image_url, ...(projectToDelete.images || [])].filter(Boolean)
      : [];

    try {
      try {
        await deleteProjectFromSupabase(projectId, imagesToDelete);
        toast.success("Project deleted successfully");
        fetchProjects();
        return;
      } catch (sbErr) {
        console.warn("Direct Supabase delete fallback:", sbErr);
      }

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
    setRemovedImages([]);
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || "",
        description: project.description || "",
        category: project.category || "residential",
        location: project.location || "",
        image_url: project.image_url || "",
        images: project.images || [],
        is_featured: !!project.is_featured
      });
      const allImages = [project.image_url, ...(project.images || [])].filter(Boolean);
      setExistingImages(allImages);
      setSelectedFiles([]);
      setNewPreviews([]);
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
      setExistingImages([]);
      setSelectedFiles([]);
      setNewPreviews([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setExistingImages([]);
    newPreviews.forEach(url => {
      try { URL.revokeObjectURL(url); } catch (_) {}
    });
    setSelectedFiles([]);
    setNewPreviews([]);
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Project Images * ({existingImages.length + selectedFiles.length} of 15 added)
                </label>
                {(existingImages.length > 0 || selectedFiles.length > 0) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 gap-1 border-[#D69A55] text-[#D69A55] hover:bg-[#D69A55] hover:text-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add More Images
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {/* Drag and Drop / Click Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer?.files) handleFilesAdded(e.dataTransfer.files);
                  }}
                  className={`flex flex-col items-center justify-center w-full min-h-[110px] p-4 border-2 border-dashed rounded cursor-pointer transition-colors ${
                    isDragging 
                      ? "border-[#D69A55] bg-amber-50" 
                      : "border-gray-300 hover:border-[#D69A55] hover:bg-gray-50"
                  }`}
                >
                  {isUploading ? (
                    <div className="text-center py-2">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#D69A55] mx-auto mb-2"></div>
                      <p className="text-xs font-medium text-gray-600">Uploading images to Supabase...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-[#D69A55] mb-1.5" />
                      <p className="text-sm font-semibold text-gray-700 text-center">
                        <span className="text-[#D69A55] underline">Click to choose images</span> or drag & drop here
                      </p>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Select multiple images at once (hold <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px]">Ctrl</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[10px]">Shift</kbd>) or click again to add more
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Supports JPG, PNG, WEBP, GIF (up to 10MB each, max 15)</p>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
                  multiple
                  onChange={(e) => handleFilesAdded(e.target.files)}
                  className="hidden"
                />

                {/* Thumbnails Gallery Grid */}
                {(existingImages.length > 0 || newPreviews.length > 0) && (
                  <div className="border border-gray-200 p-3 bg-gray-50/70 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Project Gallery Preview ({existingImages.length + newPreviews.length} images)
                      </span>
                      <span className="text-[11px] text-gray-500">First image will be the Cover photo</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                      {/* Existing saved images */}
                      {existingImages.map((url, idx) => (
                        <div key={`exist-${idx}`} className="relative group rounded overflow-hidden border border-gray-300 bg-white shadow-sm aspect-square">
                          <img 
                            src={url} 
                            alt={`Existing ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#D69A55] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                              Cover
                            </span>
                          )}
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                            Saved
                          </span>
                          <button
                            type="button"
                            title="Remove image"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExistingImage(idx);
                            }}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Newly selected files */}
                      {newPreviews.map((preview, idx) => {
                        const isCover = existingImages.length === 0 && idx === 0;
                        return (
                          <div key={`new-${idx}`} className="relative group rounded overflow-hidden border-2 border-emerald-500 bg-white shadow-sm aspect-square">
                            <img 
                              src={preview} 
                              alt={`New upload ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            {isCover && (
                              <span className="absolute top-1 left-1 bg-[#D69A55] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                Cover
                              </span>
                            )}
                            <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-semibold px-1 rounded">
                              New
                            </span>
                            <button
                              type="button"
                              title="Remove image"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNewFile(idx);
                              }}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Add more tile in the grid */}
                      {existingImages.length + newPreviews.length < 15 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 hover:border-[#D69A55] rounded text-gray-500 hover:text-[#D69A55] hover:bg-white transition-all"
                        >
                          <Plus className="w-5 h-5 mb-0.5" />
                          <span className="text-[11px] font-medium">Add More</span>
                        </button>
                      )}
                    </div>
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
