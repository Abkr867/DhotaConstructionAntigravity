import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Award, Shield, Lightbulb, Users } from "lucide-react";
import axios from "axios";
import { COMPANY_INFO } from "@/lib/supabase";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const AboutPage = () => {
  const [companyInfo, setCompanyInfo] = useState(COMPANY_INFO);

  useEffect(() => {
    document.title = "About Us - Dhota Construction";
    const fetchCompanyInfo = async () => {
      try {
        const response = await axios.get(`${API}/company-info`);
        if (response.data) setCompanyInfo(response.data);
      } catch (error) {
        setCompanyInfo(COMPANY_INFO);
      }
    };
    fetchCompanyInfo();
  }, []);

  const valueIcons = {
    Quality: Award,
    Integrity: Shield,
    Safety: Users,
    Innovation: Lightbulb,
  };

  const projectTypes = [
    {
      title: "Residential Projects",
      description: "Custom homes, villas, apartments, and housing complexes designed for modern living.",
      image: "https://images.unsplash.com/photo-1706808049803-f61304e024ab?w=600&q=80"
    },
    {
      title: "Commercial Projects",
      description: "Office buildings, retail spaces, and commercial complexes built for business success.",
      image: "https://images.unsplash.com/photo-1637217912305-a5b25e87209b?w=600&q=80"
    },
    {
      title: "Renovation Projects",
      description: "Complete makeovers and structural upgrades that transform existing spaces.",
      image: "https://images.unsplash.com/photo-1706809019043-c16ada0165e9?w=600&q=80"
    },
    {
      title: "Turnkey Projects",
      description: "End-to-end solutions from design to handover, ready for immediate use.",
      image: "https://images.unsplash.com/photo-1545186070-de624ed19875?w=600&q=80"
    }
  ];

  return (
    <div className="pt-16 md:pt-20" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1765371512336-99c2b1c6975f?w=1920&q=80')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              About Dhota Construction
            </span>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              BUILDING THE FUTURE<br />
              <span className="text-[#D69A55]">SINCE 2019</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {companyInfo?.tagline || "Building Trust. Constructing Quality."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white" data-testid="company-story">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://customer-assets.emergentagent.com/job_local-img-upload/artifacts/v5lr4oo2_Untitled%20design.png"
                alt="Dhota Construction team"
                className="w-full h-[400px] object-contain"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
                Our Story
              </span>
              <h2 
                className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                {companyInfo?.years_of_experience || 5} YEARS OF EXCELLENCE
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2019, Dhota Construction has quickly grown to become one 
                of Jharkhand's trusted construction companies. Our journey has been marked 
                by a relentless commitment to quality, innovation, and customer satisfaction.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                In just 5 years, we have successfully delivered more than {companyInfo?.projects_completed || 250} projects, 
                ranging from individual homes to commercial buildings. Our team of {companyInfo?.team_members || 20}+ 
                skilled professionals works tirelessly to transform visions into reality.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-[#D69A55] pl-4">
                  <p className="stat-number text-3xl font-bold text-gray-900">
                    {companyInfo?.projects_completed || 250}+
                  </p>
                  <p className="text-gray-600 text-sm">Projects Completed</p>
                </div>
                <div className="border-l-4 border-[#D69A55] pl-4">
                  <p className="stat-number text-3xl font-bold text-gray-900">
                    {companyInfo?.happy_clients || 200}+
                  </p>
                  <p className="text-gray-600 text-sm">Happy Clients</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-100" data-testid="mission-vision">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 p-8 md:p-12"
            >
              <div className="w-14 h-14 bg-[#D69A55] flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                OUR MISSION
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {companyInfo?.mission || "To deliver exceptional construction services that transform visions into reality, while maintaining the highest standards of quality, safety, and customer satisfaction."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="sunrise-gradient-soft p-8 md:p-12 emerald-glow"
            >
              <div className="w-14 h-14 bg-gray-900 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-[#D69A55]" />
              </div>
              <h3 
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                OUR VISION
              </h3>
              <p className="text-white/90 leading-relaxed">
                {companyInfo?.vision || "To be the most trusted and innovative construction company, known for building structures that stand the test of time and create lasting value for our clients."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white" data-testid="core-values">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              What Drives Us
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mt-2"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              OUR CORE VALUES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(companyInfo?.values || [
              { title: "Quality", description: "Uncompromising commitment to superior craftsmanship" },
              { title: "Integrity", description: "Transparent dealings and honest communication" },
              { title: "Safety", description: "Zero-compromise approach to workplace safety" },
              { title: "Innovation", description: "Embracing modern techniques and technologies" }
            ]).map((value, index) => {
              const IconComponent = valueIcons[value.title] || Award;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-gray-200 p-6 text-center card-hover"
                  data-testid={`value-card-${value.title.toLowerCase()}`}
                >
                  <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-[#D69A55]" />
                  </div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="section-padding bg-gray-900" data-testid="project-types">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              Our Expertise
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold text-white mt-2"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              TYPES OF PROJECTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectTypes.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group overflow-hidden"
                data-testid={`project-type-${index}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
