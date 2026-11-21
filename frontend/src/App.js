import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import EstimatorPage from "@/pages/EstimatorPage";
import ContactPage from "@/pages/ContactPage";
import GalleryPage from "@/pages/GalleryPage";
import ReviewPage from "@/pages/ReviewPage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminInquiries from "@/pages/admin/AdminInquiries";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminReviews from "@/pages/admin/AdminReviews";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><main className="flex-1"><HomePage /></main><Footer /><WhatsAppButton /></>} />
          <Route path="/about" element={<><Navbar /><main className="flex-1"><AboutPage /></main><Footer /><WhatsAppButton /></>} />
          <Route path="/services" element={<><Navbar /><main className="flex-1"><ServicesPage /></main><Footer /><WhatsAppButton /></>} />
          <Route path="/estimator" element={<><Navbar /><main className="flex-1"><EstimatorPage /></main><Footer /><WhatsAppButton /></>} />
          <Route path="/contact" element={<><Navbar /><main className="flex-1"><ContactPage /></main><Footer /><WhatsAppButton /></>} />
          <Route path="/gallery" element={<><Navbar /><main className="flex-1"><GalleryPage /></main><Footer /><WhatsAppButton /></>} />
          <Route path="/reviews" element={<><Navbar /><main className="flex-1"><ReviewPage /></main><Footer /><WhatsAppButton /></>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
