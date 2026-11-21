import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  Building2, 
  Hammer, 
  Paintbrush, 
  ClipboardList,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const iconMap = {
  Home: Home,
  Building2: Building2,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
  ClipboardList: ClipboardList,
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    document.title = "Our Services - Dhota Construction";
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-16 md:pt-20" data-testid="services-page">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1545186070-de624ed19875?w=1920&q=80')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              What We Offer
            </span>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              OUR SERVICES
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Comprehensive construction solutions tailored to your needs. 
              From residential dreams to commercial landmarks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-gray-100" data-testid="services-list">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Home;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                  data-testid={`service-detail-${service.id}`}
                >
                  <div className={`${!isEven ? "lg:order-2" : ""}`}>
                    <div className="bg-white border-2 border-gray-200 p-8 md:p-12">
                      <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mb-6">
                        <IconComponent className="w-8 h-8 text-[#D69A55]" />
                      </div>
                      <h2 
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                        style={{ fontFamily: 'Oswald, sans-serif' }}
                      >
                        {service.title}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        {service.features?.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-[#D69A55] flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link to="/estimator">
                        <Button 
                          className="bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none px-6 font-semibold uppercase tracking-wider"
                          data-testid={`service-cta-${service.id}`}
                        >
                          Get Estimate
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className={`${!isEven ? "lg:order-1" : ""}`}>
                    <div className="relative">
                      <img
                        src={getServiceImage(service.id)}
                        alt={service.title}
                        className="w-full h-[400px] object-scale-down"
                      />
                      <div className="absolute top-4 left-4 bg-[#D69A55] text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider">
                        {service.title.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-white" data-testid="process-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              How We Work
            </span>
            <h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mt-2"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              OUR PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Understanding your vision, requirements, and budget" },
              { step: "02", title: "Planning", desc: "Detailed architectural designs and cost estimation" },
              { step: "03", title: "Execution", desc: "Quality construction with regular progress updates" },
              { step: "04", title: "Handover", desc: "Final inspection and documentation completion" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
                data-testid={`process-step-${item.step}`}
              >
                <div className="stat-number text-5xl md:text-6xl font-bold text-gray-200 mb-4">
                  {item.step}
                </div>
                <h3 
                  className="text-xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#D69A55]" data-testid="services-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            READY TO START YOUR PROJECT?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Let us help you bring your construction vision to life. 
            Get a free consultation and cost estimate today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/estimator">
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider"
                data-testid="services-cta-estimate"
              >
                Get Cost Estimate
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#D69A55] rounded-none px-8 py-6 text-base font-semibold uppercase tracking-wider bg-transparent"
                data-testid="services-cta-contact"
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

// Helper function to get service images
const getServiceImage = (serviceId) => {
  const images = {
    residential: "https://customer-assets.emergentagent.com/job_local-img-upload/artifacts/eqsskqeb_residen.png",
    commercial: "https://customer-assets.emergentagent.com/job_local-img-upload/artifacts/lzsc290a_comer.png",
    renovation: "https://images.unsplash.com/photo-1706809019043-c16ada0165e9?w=800&q=80",
    interior: "https://customer-assets.emergentagent.com/job_local-img-upload/artifacts/srrdrwv8_Exterior.png",
    consultation: "https://images.unsplash.com/photo-1765371512336-99c2b1c6975f?w=800&q=80"
  };
  return images[serviceId] || images.residential;
};

export default ServicesPage;
