import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Home, 
  Building2, 
  Hammer, 
  Paintbrush, 
  ClipboardList,
  CheckCircle,
  Users,
  Award,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { SERVICES, COMPANY_INFO, fetchReviewsFromSupabase, API, BACKEND_URL } from "@/lib/supabase";

const iconMap = {
  Home: Home,
  Building2: Building2,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  ClipboardList: ClipboardList,
};

const COMPANY_LOGO = "https://customer-assets.emergentagent.com/job_construct-dhota/artifacts/u7scmm47_WhatsApp%20Image%202025-12-25%20at%2019.24.16.jpeg";

const HomePage = () => {
  const [services, setServices] = useState(SERVICES.slice(0, 4));
  const [testimonials, setTestimonials] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(COMPANY_INFO);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    document.title = "Dhota Construction - Premier Construction Services";
    const fetchData = async () => {
      try {
        const [servicesRes, testimonialsRes, companyRes] = await Promise.all([
          axios.get(`${API}/services`).catch(() => ({ data: SERVICES })),
          axios.get(`${API}/testimonials`).catch(() => fetchReviewsFromSupabase().then(r => ({ data: r }))),
          axios.get(`${API}/company-info`).catch(() => ({ data: COMPANY_INFO }))
        ]);
        if (servicesRes.data && servicesRes.data.length > 0) setServices(servicesRes.data.slice(0, 4));
        if (testimonialsRes.data && testimonialsRes.data.length > 0) setTestimonials(testimonialsRes.data);
        if (companyRes.data) setCompanyInfo(companyRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="pt-16 md:pt-20" data-testid="home-page">
      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center bg-gray-900"
        data-testid="hero-section"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://customer-assets-39nsmqrw.emergentagent.net/job_d3d6816a-3edc-4947-add8-b54f4b94ffe2/artifacts/dxd7ds35_1.jpeg')`
          }}
        />
        <div className="hero-overlay absolute inset-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <img src={COMPANY_LOGO} alt="Dhota Construction" width="64" height="64" className="w-16 h-16 rounded-lg border-2 border-[#D69A55]" />
              <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
                Since 2019 &bull; 250+ Projects Delivered
              </span>
            </div>
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              BUILDING TRUST.<br />
              <span className="text-[#D69A55]">CONSTRUCTING QUALITY.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Transform your vision into reality with Jharkhand's trusted construction partner. 
              From residential dreams to commercial landmarks, we build structures that stand the test of time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/estimator">
                <Button 
                  className="bg-gradient-to-r from-[#D69A55] to-[#B87D3B] hover:from-[#B87D3B] hover:to-[#065f46] text-white rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider emerald-glow transition-all"
                  data-testid="hero-cta-estimate"
                >
                  Get Cost Estimate
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider bg-transparent"
                  data-testid="hero-cta-contact"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="sunrise-gradient-soft py-8" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: companyInfo?.years_of_experience || 5, label: "Years Experience", suffix: "+" },
              { number: companyInfo?.projects_completed || 250, label: "Projects Completed", suffix: "+" },
              { number: companyInfo?.happy_clients || 200, label: "Happy Clients", suffix: "+" },
              { number: companyInfo?.team_members || 20, label: "Team Members", suffix: "+" },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <p className="stat-number text-3xl md:text-4xl lg:text-5xl font-bold">
                  {stat.number}{stat.suffix}
                </p>
                <p className="text-white/80 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-100" data-testid="services-preview">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              What We Do
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              OUR SERVICES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Home;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border-2 border-gray-200 p-6 card-hover"
                  data-testid={`service-card-${service.id}`}
                >
                  <div className="w-14 h-14 bg-gray-900 flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-[#D69A55]" />
                  </div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description.slice(0, 100)}...
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <Button 
                variant="outline"
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-none px-8 py-4 font-semibold uppercase tracking-wider"
                data-testid="view-all-services"
              >
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white" data-testid="why-us-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
                Why Choose Dhota
              </span>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-6"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                BUILDING EXCELLENCE<br />SINCE 2021
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                With 5+ years of experience in the construction industry, we've built a 
                reputation for delivering exceptional quality, on-time completion, and transparent 
                communication. Our commitment to excellence has made us the preferred choice for 
                homeowners and businesses across Jharkhand.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: CheckCircle, title: "Quality Assured", desc: "ISI certified materials" },
                  { icon: Clock, title: "On-Time Delivery", desc: "Milestone-based tracking" },
                  { icon: Users, title: "Expert Team", desc: "20+ skilled professionals" },
                  { icon: Award, title: "30 Year Warranty", desc: "Structural guarantee" },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-[#D69A55] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://customer-assets.emergentagent.com/job_local-img-upload/artifacts/v5lr4oo2_Untitled%20design.png"
                alt="Dhota Construction Team"
                loading="lazy"
                decoding="async"
                className="w-full h-[500px] object-contain"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#D69A55] p-6 text-white">
                <p className="stat-number text-4xl font-bold">5+</p>
                <p className="text-sm uppercase tracking-wider">Years of Trust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-gray-900" data-testid="testimonials-section">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              Testimonials
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold text-white mt-2 mb-12"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              WHAT OUR CLIENTS SAY
            </h2>

            <div className="relative">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-8 md:p-12 testimonial-card"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#D69A55] fill-[#D69A55]" />
                  ))}
                </div>
                <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial]?.comment}"
                </p>
                
                {/* Image Carousel */}
                {testimonials[currentTestimonial]?.images && testimonials[currentTestimonial]?.images.length > 0 && (
                  <div className="flex gap-2 justify-center mb-6 flex-wrap">
                    {testimonials[currentTestimonial]?.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url.startsWith('http') ? img.url : `${BACKEND_URL}${img.url}`}
                        alt={`Project ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-24 h-24 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{testimonials[currentTestimonial]?.name}</p>
                    <p className="text-gray-400 text-sm">
                      {testimonials[currentTestimonial]?.project_type} &bull; {testimonials[currentTestimonial]?.location}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 border-2 border-gray-700 text-gray-400 hover:border-[#D69A55] hover:text-[#D69A55] flex items-center justify-center transition-colors"
                  data-testid="testimonial-prev"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 border-2 border-gray-700 text-gray-400 hover:border-[#D69A55] hover:text-[#D69A55] flex items-center justify-center transition-colors"
                  data-testid="testimonial-next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding sunrise-gradient" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            READY TO BUILD YOUR DREAM?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Get a free cost estimate for your construction project today. 
            Our team is ready to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/estimator">
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider"
                data-testid="cta-estimate"
              >
                Calculate Cost
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#D69A55] rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider bg-transparent"
                data-testid="cta-contact"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
