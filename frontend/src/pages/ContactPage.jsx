import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import axios from "axios";
import { submitInquiryToSupabase, FAQS } from "@/lib/supabase";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    project_location: "",
    project_type: "",
    estimated_area: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    document.title = "Contact Us - Dhota Construction";
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${API}/faqs`);
        if (response.data && response.data.length > 0) {
          setFaqs(response.data);
          return;
        }
      } catch (error) {
        // Fallback to embedded FAQs
      }
      setFaqs(FAQS);
    };
    fetchFaqs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, project_type: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        estimated_area: formData.estimated_area ? parseInt(formData.estimated_area, 10) : null
      };
      
      // Submit directly to Supabase over HTTPS (guaranteed on GitHub Pages & mobile)
      try {
        await submitInquiryToSupabase(submitData);
      } catch (sbErr) {
        console.warn("Direct Supabase submit warning, trying API fallback:", sbErr);
        await axios.post(`${API}/inquiries`, submitData);
      }

      setIsSubmitted(true);
      toast.success("Inquiry submitted successfully! We'll contact you soon.");
      setFormData({
        full_name: "",
        phone: "",
        email: "",
        project_location: "",
        project_type: "",
        estimated_area: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    "Residential Construction",
    "Commercial Building",
    "Renovation",
    "Interior Work",
    "Project Consultation",
    "Other"
  ];

  return (
    <div className="pt-16 md:pt-20" data-testid="contact-page">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
              Get in Touch
            </span>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              CONTACT US
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gray-100" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 p-8 text-white h-full">
                <h2 
                  className="text-2xl font-bold mb-8"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  CONTACT INFORMATION
                </h2>

                <div className="space-y-6">
                  <a 
                    href="tel:+919110986889"
                    className="flex items-start gap-4 group"
                    data-testid="contact-phone"
                  >
                    <div className="w-12 h-12 bg-[#D69A55] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="font-semibold group-hover:text-[#D69A55] transition-colors">
                        +91 91109 86889
                      </p>
                    </div>
                  </a>

                  <a 
                    href="mailto:email@dhotaconstruction.com"
                    className="flex items-start gap-4 group"
                    data-testid="contact-email"
                  >
                    <div className="w-12 h-12 bg-[#D69A55] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="font-semibold group-hover:text-[#D69A55] transition-colors">
                        email@dhotaconstruction.com
                      </p>
                      <p className="text-sm text-gray-400 group-hover:text-[#D69A55] transition-colors">
                        dhotaconstructions@gmail.com
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#D69A55] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="font-semibold">
                        Jainagar, Koderma,<br />
                        Jharkhand - 825109
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Bagodar, Giridih,<br />
                        Jharkhand - 825322
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#D69A55] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Working Hours</p>
                      <p className="font-semibold">Mon - Sat: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Google Maps - Jainagar, Koderma */}
                <div className="mt-8">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d85.6513!3d24.3703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDIyJzEzLjIiTiA4NcKwMzknMDQuNSJF!5e0!3m2!1sen!2sin!4v1703658524019!5m2!1sen!2sin"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location - Jainagar, Koderma"
                    className="map-container"
                    data-testid="google-map"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border-2 border-gray-200 p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                    data-testid="form-success"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 
                      className="text-2xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      THANK YOU!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your inquiry has been submitted successfully. Our team will contact you within 24 hours.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none px-6"
                    >
                      Submit Another Inquiry
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <h2 
                      className="text-2xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      SEND US A MESSAGE
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                            placeholder="Your full name"
                            className="rounded-none border-2 border-gray-300 focus:border-[#D69A55] h-12"
                            data-testid="input-full-name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="+91 XXXXX XXXXX"
                            className="rounded-none border-2 border-gray-300 focus:border-[#D69A55] h-12"
                            data-testid="input-phone"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="your@email.com"
                            className="rounded-none border-2 border-gray-300 focus:border-[#D69A55] h-12"
                            data-testid="input-email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Location *
                          </label>
                          <Input
                            type="text"
                            name="project_location"
                            value={formData.project_location}
                            onChange={handleInputChange}
                            required
                            placeholder="City, Area"
                            className="rounded-none border-2 border-gray-300 focus:border-[#D69A55] h-12"
                            data-testid="input-location"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Type *
                          </label>
                          <Select 
                            value={formData.project_type} 
                            onValueChange={handleSelectChange}
                            required
                          >
                            <SelectTrigger 
                              className="rounded-none border-2 border-gray-300 focus:border-[#D69A55] h-12"
                              data-testid="select-project-type"
                            >
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Area (sq ft)
                          </label>
                          <Input
                            type="number"
                            name="estimated_area"
                            value={formData.estimated_area}
                            onChange={handleInputChange}
                            placeholder="e.g., 2000"
                            className="rounded-none border-2 border-gray-300 focus:border-[#D69A55] h-12"
                            data-testid="input-area"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message / Requirements
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about your project requirements..."
                          className="rounded-none border-2 border-gray-300 focus:border-[#D69A55]"
                          data-testid="input-message"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none py-6 text-base font-semibold uppercase tracking-wider"
                        data-testid="submit-btn"
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            Send Inquiry
                            <Send className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="section-padding bg-white" data-testid="faq-section">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
                FAQ
              </span>
              <h2 
                className="text-3xl md:text-4xl font-bold text-gray-900 mt-2"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                FREQUENTLY ASKED QUESTIONS
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${faq.id}`}
                  className="border-2 border-gray-200 px-6"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#D69A55] py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  );
};

export default ContactPage;
