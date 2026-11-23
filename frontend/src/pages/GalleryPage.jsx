import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { fetchProjectsFromSupabase, API, BACKEND_URL } from "@/lib/supabase";

const GalleryPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "renovation", label: "Renovation" },
    { id: "interior", label: "Interior" }
  ];

  const fetchProjects = useCallback(async () => {
    try {
      let data = [];
      try {
        const response = await axios.get(`${API}/projects`);
        if (response.data && response.data.length > 0) data = response.data;
      } catch (err) {
        // Fallback to direct Supabase query
        data = await fetchProjectsFromSupabase();
      }
      if (!data || data.length === 0) {
        data = await fetchProjectsFromSupabase();
      }
      setProjects(data);
      const initialIndex = {};
      data.forEach(project => {
        initialIndex[project.id] = 0;
      });
      setCurrentImageIndex(initialIndex);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Project Gallery - Dhota Construction";
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === activeCategory));
    }
  }, [projects, activeCategory]);

  const getProjectImages = (project) => {
    const images = [project.image_url];
    if (project.images && project.images.length > 0) {
      images.push(...project.images);
    }
    return images;
  };

  const nextImage = (projectId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: (prev[projectId] + 1) % totalImages
    }));
  };

  const prevImage = (projectId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: (prev[projectId] - 1 + totalImages) % totalImages
    }));
  };

  // Sample projects if none exist
  const sampleProjects = [
    {
      id: "1",
      title: "Modern Villa in Giridih",
      description: "A beautiful 4-bedroom villa with contemporary design and premium finishes.",
      category: "residential",
      location: "Giridih, Jharkhand",
      image_url: "https://images.unsplash.com/photo-1706808049803-f61304e024ab?w=800&q=80",
      is_featured: true
    },
    {
      id: "2",
      title: "Commercial Complex",
      description: "Multi-story commercial building with modern amenities for businesses.",
      category: "commercial",
      location: "Bagodar, Jharkhand",
      image_url: "https://images.unsplash.com/photo-1637217912305-a5b25e87209b?w=800&q=80",
      is_featured: true
    },
    {
      id: "3",
      title: "Home Renovation Project",
      description: "Complete transformation of a traditional house into a modern dwelling.",
      category: "renovation",
      location: "Dhanbad, Jharkhand",
      image_url: "https://images.unsplash.com/photo-1706809019043-c16ada0165e9?w=800&q=80",
      is_featured: false
    },
    {
      id: "4",
      title: "Luxury Interior Design",
      description: "Premium interior work with modular kitchen and custom furniture.",
      category: "interior",
      location: "Ranchi, Jharkhand",
      image_url: "https://images.unsplash.com/photo-1646227655718-dd721b681d91?w=800&q=80",
      is_featured: false
    }
  ];

  const displayProjects = filteredProjects;

  return (
    <div className="pt-16 md:pt-20" data-testid="gallery-page">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1637217912305-a5b25e87209b?w=1920&q=80')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              Our Work
            </span>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              PROJECT GALLERY
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore our portfolio of completed projects across Jharkhand. 
              Each project reflects our commitment to quality and excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#D69A55] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid={`filter-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-gray-100" data-testid="projects-grid">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-gray-200 animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-2 border-gray-200 overflow-hidden group card-hover"
                  data-testid={`project-card-${project.id}`}
                >
                  <div className="relative h-64 overflow-hidden">
                    {(() => {
                      const projectImages = getProjectImages(project);
                      const currentIndex = currentImageIndex[project.id] || 0;
                      return (
                        <>
                          <img
                            src={projectImages[currentIndex]}
                            alt={`${project.title} - Image ${currentIndex + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1706808049803-f61304e024ab?w=600';
                            }}
                          />
                          
                          {/* Image Navigation */}
                          {projectImages.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  prevImage(project.id, projectImages.length);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  nextImage(project.id, projectImages.length);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                              
                              {/* Image Counter */}
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                {currentIndex + 1} / {projectImages.length}
                              </div>
                            </>
                          )}
                          
                          {project.is_featured && (
                            <div className="absolute top-4 left-4 bg-[#D69A55] text-white px-3 py-1 text-xs font-semibold uppercase">
                              Featured
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      );
                    })()}
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-[#D69A55] font-semibold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 
                      className="text-xl font-bold text-gray-900 mt-2 mb-2"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding sunrise-gradient" data-testid="gallery-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            WANT TO SEE YOUR PROJECT HERE?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Let us help you build your dream project. Get a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/estimator">
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider"
              >
                Get Cost Estimate
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#D69A55] rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
