import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { fetchReviewsFromSupabase, submitReviewToSupabase, API, BACKEND_URL } from "@/lib/supabase";

const ReviewPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    project_type: "",
    rating: 5,
    comment: ""
  });

  const fetchTestimonials = useCallback(async () => {
    try {
      let data = [];
      try {
        const response = await axios.get(`${API}/reviews`);
        if (response.data && response.data.length > 0) data = response.data;
      } catch (err) {
        data = await fetchReviewsFromSupabase();
      }
      if (!data || data.length === 0) {
        data = await fetchReviewsFromSupabase();
      }
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }, []);

  useEffect(() => {
    document.title = "Share Your Experience - Dhota Construction";
    fetchTestimonials();
  }, [fetchTestimonials]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      try {
        await submitReviewToSupabase({
          ...reviewFormData,
          image_urls: []
        });
      } catch (sbErr) {
        await axios.post(`${API}/reviews`, {
          ...reviewFormData,
          image_urls: []
        });
      }

      toast.success("Review submitted successfully! It will be visible after admin approval.");
      
      setReviewFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        project_type: "",
        rating: 5,
        comment: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative sunrise-gradient text-white py-24" data-testid="reviews-hero">
        <div className="absolute inset-0 opacity-90"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest"
            >
              Customer Testimonials
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              WHAT OUR CLIENTS SAY
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto"
            >
              Read reviews from our satisfied customers and share your own experience
            </motion.p>
          </div>
        </div>
      </section>

      {/* Approved Reviews Display */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-gray-900" data-testid="testimonials-section">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 p-8 md:p-12 relative">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#D69A55]"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#D69A55]"></div>

                <div className="flex gap-1 justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < testimonials[currentTestimonial]?.rating
                          ? "text-[#D69A55] fill-[#D69A55]"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial]?.comment}"
                </p>
                
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

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 flex items-center justify-center bg-[#D69A55] hover:bg-[#B87D3B] text-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 flex items-center justify-center bg-[#D69A55] hover:bg-[#B87D3B] text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial ? "bg-[#D69A55] w-8" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Review Submission Form */}
      <section className="section-padding bg-gray-100" data-testid="review-submission-section">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#D69A55] text-sm font-semibold uppercase tracking-widest">
                Share Your Experience
              </span>
              <h2 
                className="text-3xl md:text-4xl font-bold text-gray-900 mt-2"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                SHARE YOUR EXPERIENCE
              </h2>
              <p className="text-gray-600 mt-4">
                We value your feedback! Share your experience with our services and help others make informed decisions.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="bg-white border-2 border-gray-200 p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={reviewFormData.name}
                    onChange={handleReviewInputChange}
                    required
                    placeholder="Enter your full name"
                    className="rounded-none"
                    data-testid="review-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={reviewFormData.email}
                    onChange={handleReviewInputChange}
                    required
                    placeholder="your.email@example.com"
                    className="rounded-none"
                    data-testid="review-email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={reviewFormData.phone}
                    onChange={handleReviewInputChange}
                    required
                    placeholder="+91 xxxxx xxxxx"
                    className="rounded-none"
                    data-testid="review-phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <Input
                    type="text"
                    name="location"
                    value={reviewFormData.location}
                    onChange={handleReviewInputChange}
                    required
                    placeholder="City, State"
                    className="rounded-none"
                    data-testid="review-location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type *
                </label>
                <Input
                  type="text"
                  name="project_type"
                  value={reviewFormData.project_type}
                  onChange={handleReviewInputChange}
                  required
                  placeholder="e.g., Residential Villa, Commercial Building"
                  className="rounded-none"
                  data-testid="review-project-type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewFormData({ ...reviewFormData, rating })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= reviewFormData.rating
                            ? "text-[#D69A55] fill-[#D69A55]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <Textarea
                  name="comment"
                  value={reviewFormData.comment}
                  onChange={handleReviewInputChange}
                  required
                  placeholder="Share your experience with our services..."
                  className="rounded-none min-h-[120px]"
                  data-testid="review-comment"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none py-6 text-base font-semibold uppercase tracking-wider"
                data-testid="submit-review-btn"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                * Your review will be visible on the website after admin approval
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewPage;
