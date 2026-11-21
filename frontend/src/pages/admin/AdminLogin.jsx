import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, ArrowLeft, Mail, Shield, HelpCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite movie?",
  "What was your childhood nickname?"
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login, register, forgot, reset
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [retrievedUsername, setRetrievedUsername] = useState("");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    admin_secret: "",
    security_question: "",
    security_answer: "",
    new_password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, {
        username: formData.username,
        password: formData.password
      });
      
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.user));
      
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/admin/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        admin_secret: formData.admin_secret,
        security_question: formData.security_question,
        security_answer: formData.security_answer
      });
      
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.user));
      
      toast.success("Account created successfully!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/admin/forgot-password`, {
        email: formData.email,
        admin_secret: formData.admin_secret
      });
      
      setSecurityQuestion(response.data.security_question);
      setRetrievedUsername(response.data.username);
      setMode("reset");
      toast.success("Please answer your security question");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid email or admin secret key");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API}/admin/reset-password`, {
        email: formData.email,
        security_answer: formData.security_answer,
        new_password: formData.new_password
      });
      
      toast.success("Password reset successfully! Please login.");
      setMode("login");
      setFormData({ ...formData, password: "", security_answer: "", new_password: "", admin_secret: "" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Reset failed. Check your security answer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Website</span>
        </Link>

        <div className="bg-gray-800 border border-gray-700 p-8">
          <div className="text-center mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_construct-dhota/artifacts/u7scmm47_WhatsApp%20Image%202025-12-25%20at%2019.24.16.jpeg" 
              alt="Dhota Construction Logo" 
              className="w-16 h-16 mx-auto mb-4 rounded"
            />
            <h1 
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {mode === "login" && "ADMIN LOGIN"}
              {mode === "register" && "ADMIN REGISTER"}
              {mode === "forgot" && "FORGOT PASSWORD"}
              {mode === "reset" && "RESET PASSWORD"}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {mode === "login" && "Sign in to manage your dashboard"}
              {mode === "register" && "Create an admin account (requires secret key)"}
              {mode === "forgot" && "Enter email and admin secret key to recover"}
              {mode === "reset" && "Answer security question to reset"}
            </p>
          </div>

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter username"
                    className="pl-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                    data-testid="input-username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter password"
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none py-6 text-base font-semibold uppercase tracking-wider"
                data-testid="submit-btn"
              >
                {isLoading ? "Please wait..." : "Sign In"}
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-[#D69A55] hover:text-[#B87D3B] text-sm font-medium"
                >
                  Forgot Password?
                </button>
                <p className="text-gray-400 text-sm">
                  Don't have an account?
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-[#D69A55] hover:text-[#B87D3B] ml-2 font-medium"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Choose username"
                    className="pl-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email"
                    className="pl-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Create password"
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Secret Key</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    name="admin_secret"
                    value={formData.admin_secret}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter admin secret key"
                    className="pl-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">Contact system administrator for the secret key</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Security Question</label>
                <Select
                  value={formData.security_question}
                  onValueChange={(value) => setFormData({ ...formData, security_question: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white rounded-none h-12">
                    <SelectValue placeholder="Select a security question" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECURITY_QUESTIONS.map((q) => (
                      <SelectItem key={q} value={q}>{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Security Answer</label>
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    name="security_answer"
                    value={formData.security_answer}
                    onChange={handleInputChange}
                    required
                    placeholder="Your answer (for password recovery)"
                    className="pl-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none py-6 text-base font-semibold uppercase tracking-wider"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </Button>

              <p className="text-gray-400 text-sm text-center">
                Already have an account?
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[#D69A55] hover:text-[#B87D3B] ml-2 font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your registered email"
                    className="pl-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Admin Secret Key</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    name="admin_secret"
                    value={formData.admin_secret}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter admin secret key"
                    className="pl-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">Required for security verification</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none py-6 text-base font-semibold uppercase tracking-wider"
              >
                {isLoading ? "Verifying..." : "Continue"}
              </Button>

              <p className="text-gray-400 text-sm text-center">
                Remember your password?
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[#D69A55] hover:text-[#B87D3B] ml-2 font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* Reset Password Form */}
          {mode === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-300 text-sm font-medium">Username:</p>
                <p className="text-white mt-1">{retrievedUsername}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <p className="text-gray-300 text-sm font-medium">Security Question:</p>
                <p className="text-white mt-1">{securityQuestion}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Answer</label>
                <Input
                  type="text"
                  name="security_answer"
                  value={formData.security_answer}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your answer"
                  className="bg-gray-700 border-gray-600 text-white rounded-none h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter new password"
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white rounded-none h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D69A55] hover:bg-[#B87D3B] text-white rounded-none py-6 text-base font-semibold uppercase tracking-wider"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <p className="text-gray-400 text-sm text-center">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[#D69A55] hover:text-[#B87D3B] font-medium"
                >
                  Back to Login
                </button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
