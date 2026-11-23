import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://eaqgzpigbwortoeeqjjv.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhcWd6cGlnYndvcnRvZWVxamp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxOTMzNjYsImV4cCI6MjExMDc2OTM2Nn0.U_399en92oPBlduU0XgjYS77Y534bvLgVOUNPkKeqVM";
export const SUPABASE_BUCKET = "dhota-construction";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fallback Company Info
export const COMPANY_INFO = {
  name: "Dhota Construction",
  tagline: "Building Trust. Constructing Quality.",
  established: 2019,
  years_of_experience: 5,
  projects_completed: 250,
  happy_clients: 200,
  team_members: 20,
  mission: "To deliver exceptional construction services that transform visions into reality, while maintaining the highest standards of quality, safety, and customer satisfaction.",
  vision: "To be the most trusted and innovative construction company in Jharkhand, known for building structures that stand the test of time and create lasting value for our clients.",
  values: [
    { title: "Quality", description: "Uncompromising commitment to superior craftsmanship" },
    { title: "Integrity", description: "Transparent dealings and honest communication" },
    { title: "Safety", description: "Zero-compromise approach to workplace safety" },
    { title: "Innovation", description: "Embracing modern techniques and technologies" }
  ],
  contact: {
    phone: "+91 91109 86889",
    email: "email@dhotaconstruction.com",
    email_secondary: "dhotaconstructions@gmail.com",
    address: "Jainagar, Koderma, Jharkhand - 825109",
    address_secondary: "Bagodar, Giridih, Jharkhand - 825322",
    whatsapp: "+919110986889"
  },
  social: {
    facebook: "https://www.facebook.com/share/17mg2tZn1S/",
    instagram: "https://www.instagram.com/dhota_construction?igsh=aHU3N3lmMmFpamo0",
    linkedin: "https://www.linkedin.com/in/er-subhash-kumar-mahto-75991a368",
    youtube: "https://www.youtube.com/@dhotaconstruction"
  },
  office_location: {
    lat: 24.1965,
    lng: 86.1310,
    address: "Bagodar, Giridih, Jharkhand - 825322"
  }
};

// Fallback Services
export const SERVICES = [
  {
    id: "residential",
    title: "Residential Construction",
    description: "Building your dream home from foundation to finish. We specialize in villas, apartments, and row houses with modern amenities and timeless designs.",
    icon: "Home",
    features: ["Custom Home Design", "Villas & Bungalows", "Apartments", "Row Houses", "Farm Houses"]
  },
  {
    id: "commercial",
    title: "Commercial Buildings",
    description: "State-of-the-art commercial spaces designed for productivity and growth. From offices to retail spaces, we build structures that make a statement.",
    icon: "Building2",
    features: ["Office Buildings", "Retail Spaces", "Warehouses", "Industrial Units", "Shopping Complexes"]
  },
  {
    id: "renovation",
    title: "Renovation & Remodeling",
    description: "Transform your existing space with our expert renovation services. We breathe new life into old structures while preserving their character.",
    icon: "Hammer",
    features: ["Home Renovation", "Office Makeover", "Structural Repairs", "Extensions", "Modernization"]
  },
  {
    id: "interior",
    title: "Interior & Exterior Work",
    description: "Complete interior and exterior solutions including painting, flooring, false ceilings, landscaping, and facade treatments.",
    icon: "Paintbrush",
    features: ["Interior Design", "Modular Kitchens", "Flooring", "Painting", "Landscaping"]
  },
  {
    id: "consultation",
    title: "Project Management",
    description: "End-to-end project management services ensuring your construction project stays on track, on budget, and meets all quality standards.",
    icon: "ClipboardList",
    features: ["Project Planning", "Cost Estimation", "Vendor Management", "Quality Control", "Timeline Management"]
  }
];

// Fallback FAQs
export const FAQS = [
  {
    id: "1",
    question: "What is the typical construction timeline?",
    answer: "For a standard residential project, the timeline is usually 8-12 months depending on the size and complexity. Commercial projects may take 12-18 months. We provide a detailed timeline during the planning phase."
  },
  {
    id: "2",
    question: "What are the payment terms?",
    answer: "We follow a milestone-based payment structure: 10% on booking, 20% on foundation completion, 30% on structure completion, 25% on finishing work, and 15% on handover. This ensures transparency and protects both parties."
  },
  {
    id: "3",
    question: "What materials do you use?",
    answer: "We use only ISI-certified and branded materials from trusted suppliers. This includes TMT steel bars, high-grade cement, quality aggregates, and premium fittings. Material specifications are shared with clients before procurement."
  },
  {
    id: "4",
    question: "Do you provide architectural designs?",
    answer: "Yes, we have an in-house team of architects and designers who work closely with clients to create customized designs. We also collaborate with external architects if clients have specific preferences."
  },
  {
    id: "5",
    question: "Is there a warranty on construction?",
    answer: "We provide a 30-year structural warranty and 1-year warranty on finishing work. Our commitment to quality means we stand behind our work long after project completion."
  },
  {
    id: "6",
    question: "How do you ensure quality control?",
    answer: "We have a dedicated quality control team that conducts regular inspections at every stage. We also provide progress reports with photographs and allow clients to visit the site at any time."
  }
];

// Submit Inquiry to Supabase
export async function submitInquiryToSupabase(formData) {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `inq_${Date.now()}`;
  const payload = {
    id,
    full_name: formData.full_name,
    phone: formData.phone,
    email: formData.email,
    project_location: formData.project_location,
    project_type: formData.project_type,
    estimated_area: formData.estimated_area ? parseInt(formData.estimated_area, 10) : null,
    message: formData.message || null,
    status: "new",
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("inquiries").insert([payload]);
  if (error) {
    throw error;
  }
  return { id, ...payload };
}

// Fetch Projects from Supabase
export async function fetchProjectsFromSupabase() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching projects from Supabase:", error);
    return [];
  }
  return data || [];
}

// Fetch Approved Reviews from Supabase
export async function fetchReviewsFromSupabase() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, location, project_type, rating, comment, images, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching reviews from Supabase:", error);
    return [];
  }
  return data || [];
}

// Submit Review to Supabase
export async function submitReviewToSupabase(reviewData) {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `rev_${Date.now()}`;
  const images = (reviewData.image_urls || []).map((url) => ({ url, approved: false }));
  
  const payload = {
    id,
    name: reviewData.name,
    email: reviewData.email,
    phone: reviewData.phone,
    location: reviewData.location,
    project_type: reviewData.project_type,
    rating: reviewData.rating || 5,
    comment: reviewData.comment,
    images,
    status: "pending",
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("reviews").insert([payload]);
  if (error) {
    throw error;
  }
  return { id, ...payload };
}

// ==================== ADMIN SUPABASE AUTH & OPERATIONS ====================

// Admin Sign In via Supabase Auth
export async function signInAdmin(emailOrUsername, password) {
  let email = emailOrUsername.trim();
  if (!email.includes("@")) {
    email = `${email}@dhotaconstruction.com`;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  const token = data.session?.access_token;
  const user = {
    id: data.user?.id,
    username: data.user?.user_metadata?.username || email.split("@")[0],
    email: data.user?.email,
    role: data.user?.app_metadata?.role || "admin"
  };

  if (token) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
  }

  return { session: data.session, user, token };
}

// Admin Sign Out
export async function signOutAdmin() {
  await supabase.auth.signOut().catch(() => {});
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

// Get Current Admin Session
export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    return data.session;
  }
  const token = localStorage.getItem("adminToken");
  return token ? { access_token: token } : null;
}

// Fetch Admin Stats
export async function fetchAdminStatsFromSupabase() {
  const [inqRes, newInqRes, projRes, revRes, recentInqRes] = await Promise.all([
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  return {
    total_inquiries: inqRes.count || 0,
    new_inquiries: newInqRes.count || 0,
    total_projects: projRes.count || 0,
    pending_reviews: revRes.count || 0,
    recent_inquiries: recentInqRes.data || []
  };
}

// Fetch Admin Inquiries
export async function fetchAdminInquiriesFromSupabase() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;
  return data || [];
}

// Update Inquiry Status
export async function updateInquiryStatusInSupabase(inquiryId, status, notes = null) {
  const updatePayload = { status };
  if (notes !== null) {
    updatePayload.notes = notes;
  }
  const { data, error } = await supabase
    .from("inquiries")
    .update(updatePayload)
    .eq("id", inquiryId);

  if (error) throw error;
  return data;
}

// Delete Inquiry
export async function deleteInquiryFromSupabase(inquiryId) {
  const { data, error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", inquiryId);

  if (error) throw error;
  return data;
}

// Helper: Extract storage file path from Supabase public URL
export function getStoragePathFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("projects/") || url.startsWith("review_images/")) {
    return url;
  }
  const marker = `/${SUPABASE_BUCKET}/`;
  if (url.includes(marker)) {
    const parts = url.split(marker);
    return parts[1] ? parts[1].split("?")[0] : null;
  }
  return null;
}

// Delete images from Supabase Storage bucket
export async function deleteImagesFromSupabaseStorage(urlsOrPaths) {
  if (!urlsOrPaths || !Array.isArray(urlsOrPaths) || urlsOrPaths.length === 0) return [];
  const paths = urlsOrPaths
    .map(getStoragePathFromUrl)
    .filter(Boolean);

  if (paths.length === 0) return [];

  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .remove(paths);

    if (error) {
      console.warn("Storage deletion warning:", error);
    }
    return data || [];
  } catch (err) {
    console.warn("Storage deletion error:", err);
    return [];
  }
}

// Fetch Admin Projects
export async function fetchAdminProjectsFromSupabase() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Create Project in Supabase
export async function createProjectInSupabase(projectData) {
  const id = projectData.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `proj_${Date.now()}`);
  const payload = {
    id,
    title: projectData.title,
    description: projectData.description,
    category: projectData.category || "residential",
    location: projectData.location,
    image_url: projectData.image_url,
    images: projectData.images || [],
    project_folder: projectData.project_folder || null,
    is_featured: !!projectData.is_featured,
    created_at: new Date().toISOString()
  };

  // 1. Try RPC admin_upsert_project first for guaranteed admin sync
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("admin_upsert_project", {
      project_data: payload
    });
    if (!rpcError && rpcData) {
      return rpcData;
    }
  } catch (_) {}

  // 2. Direct table insert fallback
  const { data, error } = await supabase.from("projects").insert([payload]).select();
  if (error) throw error;
  return data?.[0] || { id, ...payload };
}

// Update Project in Supabase & delete any removed images from storage
export async function updateProjectInSupabase(projectId, projectData, removedImageUrls = []) {
  const payload = {
    id: projectId,
    title: projectData.title,
    description: projectData.description,
    category: projectData.category,
    location: projectData.location,
    image_url: projectData.image_url,
    images: projectData.images || [],
    is_featured: !!projectData.is_featured
  };

  // 1. Delete removed images from Supabase Storage
  if (removedImageUrls && removedImageUrls.length > 0) {
    await deleteImagesFromSupabaseStorage(removedImageUrls);
  }

  // 2. Try RPC admin_upsert_project first
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("admin_upsert_project", {
      project_data: payload
    });
    if (!rpcError && rpcData) {
      return rpcData;
    }
  } catch (_) {}

  // 3. Direct table update fallback
  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", projectId)
    .select();

  if (error) throw error;
  return data?.[0] || payload;
}

// Delete Project from Supabase & cleanup its images from Storage
export async function deleteProjectFromSupabase(projectId, imagesToDelete = []) {
  // 1. Delete associated image files from Supabase Storage
  if (imagesToDelete && imagesToDelete.length > 0) {
    await deleteImagesFromSupabaseStorage(imagesToDelete);
  }

  // 2. Delete row from projects table
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
  return data;
}

// Fetch Admin Reviews
export async function fetchAdminReviewsFromSupabase() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Update Review Status in Supabase
export async function updateReviewStatusInSupabase(reviewId, status) {
  const { data, error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", reviewId);

  if (error) throw error;
  return data;
}

// Approve/Reject Review Image
export async function updateReviewImageApprovalInSupabase(reviewId, imageUrl, approved) {
  const { data: revData, error: fetchErr } = await supabase
    .from("reviews")
    .select("images")
    .eq("id", reviewId)
    .single();

  if (fetchErr) throw fetchErr;

  const images = (revData.images || []).map((img) =>
    img.url === imageUrl ? { ...img, approved } : img
  );

  const { data, error } = await supabase
    .from("reviews")
    .update({ images })
    .eq("id", reviewId);

  if (error) throw error;
  return data;
}

// Delete Review from Supabase
export async function deleteReviewFromSupabase(reviewId) {
  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
  return data;
}

// Upload file directly to Supabase Storage
export async function uploadImageToSupabase(file, folder = "projects") {
  const fileExt = file.name ? file.name.split(".").pop() : "jpg";
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// ==================== ADMIN SECRET KEY & RECOVERY ====================

// Verify Admin Secret Key
export async function verifyAdminSecretInSupabase(secret) {
  const { data, error } = await supabase.rpc("verify_admin_secret", {
    secret_attempt: (secret || "").trim()
  });
  if (error) throw error;
  return !!data;
}

// Forgot Password via Supabase
export async function forgotPasswordInSupabase(email, secret) {
  const { data, error } = await supabase.rpc("admin_forgot_password", {
    admin_email: (email || "").trim(),
    secret_attempt: (secret || "").trim()
  });
  if (error) throw error;
  if (!data?.success) {
    throw new Error(data?.detail || data?.message || "Invalid email or admin secret key");
  }
  return data;
}

// Reset Password via Supabase
export async function resetPasswordInSupabase(email, newPassword, securityAnswer = "", secret = "") {
  const { data, error } = await supabase.rpc("admin_reset_password", {
    admin_email: (email || "").trim(),
    new_password: newPassword,
    security_ans: (securityAnswer || "").trim(),
    secret_attempt: (secret || "").trim()
  });
  if (error) throw error;
  if (!data?.success) {
    throw new Error(data?.detail || data?.message || "Failed to reset password");
  }
  return data;
}

// Register Admin User via Supabase
export async function registerAdminInSupabase(username, email, password, secret, securityQuestion, securityAnswer) {
  const { data, error } = await supabase.rpc("admin_register_user", {
    admin_username: (username || "").trim(),
    admin_email: (email || "").trim(),
    admin_password: password,
    secret_attempt: (secret || "").trim(),
    security_q: securityQuestion || "What is the company name?",
    security_ans: (securityAnswer || "").trim()
  });
  if (error) throw error;
  if (!data?.success) {
    throw new Error(data?.detail || data?.message || "Registration failed");
  }
  return data;
}
