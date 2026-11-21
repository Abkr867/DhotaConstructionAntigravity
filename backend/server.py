from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
import uvicorn
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://eaqgzpigbwortoeeqjjv.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "dhota-construction")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'dhota-construction-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Admin Registration Secret
ADMIN_SECRET_KEY = os.environ.get('ADMIN_SECRET_KEY', 'DHOTA@ADMIN#2024')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Allowed image types and sizes
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# ==================== COMPANY INFO ====================

COMPANY_INFO = {
    "name": "Dhota Construction",
    "tagline": "Building Trust. Constructing Quality.",
    "established": 2019,
    "years_of_experience": 5,
    "projects_completed": 250,
    "happy_clients": 200,
    "team_members": 20,
    "mission": "To deliver exceptional construction services that transform visions into reality, while maintaining the highest standards of quality, safety, and customer satisfaction.",
    "vision": "To be the most trusted and innovative construction company in Jharkhand, known for building structures that stand the test of time and create lasting value for our clients.",
    "values": [
        {"title": "Quality", "description": "Uncompromising commitment to superior craftsmanship"},
        {"title": "Integrity", "description": "Transparent dealings and honest communication"},
        {"title": "Safety", "description": "Zero-compromise approach to workplace safety"},
        {"title": "Innovation", "description": "Embracing modern techniques and technologies"}
    ],
    "contact": {
        "phone": "+91 91109 86889",
        "email": "email@dhotaconstruction.com",
        "email_secondary": "dhotaconstructions@gmail.com",
        "address": "Jainagar, Koderma, Jharkhand - 825109",
        "address_secondary": "Bagodar, Giridih, Jharkhand - 825322",
        "whatsapp": "+919110986889"
    },
    "social": {
        "facebook": "https://www.facebook.com/share/17mg2tZn1S/",
        "instagram": "https://www.instagram.com/dhota_construction?igsh=aHU3N3lmMmFpamo0",
        "linkedin": "https://www.linkedin.com/in/er-subhash-kumar-mahto-75991a368",
        "youtube": "https://www.youtube.com/@dhotaconstruction"
    },
    "office_location": {
        "lat": 24.1965,
        "lng": 86.1310,
        "address": "Bagodar, Giridih, Jharkhand - 825322"
    }
}

# ==================== MODELS ====================

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    password_hash: str
    security_question: str
    security_answer_hash: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    admin_secret: str
    security_question: str
    security_answer: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    admin_secret: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    security_answer: str
    new_password: str

class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    phone: str
    email: EmailStr
    project_location: str
    project_type: str
    estimated_area: Optional[int] = None
    message: Optional[str] = None
    status: str = "new"
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactInquiryCreate(BaseModel):
    full_name: str
    phone: str
    email: EmailStr
    project_location: str
    project_type: str
    estimated_area: Optional[int] = None
    message: Optional[str] = None

class InquiryStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class ProjectGallery(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    location: str
    image_url: str
    images: Optional[List[str]] = []
    project_folder: Optional[str] = None
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectGalleryCreate(BaseModel):
    title: str
    description: str
    category: str
    location: str
    image_url: str
    images: Optional[List[str]] = []
    project_folder: Optional[str] = None
    is_featured: bool = False

class ReviewImage(BaseModel):
    url: str
    approved: bool = False

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    location: str
    project_type: str
    rating: int = 5
    comment: str
    images: Optional[List[ReviewImage]] = []
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    location: str
    project_type: str
    rating: int = 5
    comment: str
    image_urls: Optional[List[str]] = []

class ReviewImageApproval(BaseModel):
    image_url: str
    approved: bool

class ReviewStatusUpdate(BaseModel):
    status: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def create_token(user_id: str, username: str) -> str:
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== ESTIMATOR DEFAULTS ====================

DEFAULT_ESTIMATOR_RATES = {
    "id": "default_rates",
    "base_rates": {
        "basic": 1200,
        "standard": 1650,
        "premium": 2400,
        "luxury": 3500
    },
    "state_multipliers": {
        "Jharkhand": 0.92,
        "Bihar": 0.88,
        "West Bengal": 1.00,
        "Odisha": 0.90,
        "Maharashtra": 1.18,
        "Karnataka": 1.12,
        "Tamil Nadu": 1.08,
        "Delhi": 1.25,
        "Gujarat": 1.05,
        "Rajasthan": 0.95,
        "Uttar Pradesh": 0.93,
        "Telangana": 1.15,
        "Kerala": 1.12,
        "Madhya Pradesh": 0.90,
        "Haryana": 1.18,
        "Punjab": 1.02,
        "Goa": 1.22,
        "Chhattisgarh": 0.88,
        "Assam": 0.95
    },
    "district_data": {
        "Jharkhand": ["Ranchi", "Dhanbad", "Jamshedpur", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka", "Chaibasa", "Ramgarh"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Bardhaman", "Malda", "Kharagpur", "Haldia", "Raiganj"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Navi Mumbai", "Amravati"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Shimoga", "Tumkur"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Nadiad"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Sri Ganganagar"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Noida", "Ghaziabad", "Bareilly", "Aligarh"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Palakkad", "Malappuram", "Kottayam"],
        "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
        "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal", "Sonipat", "Rohtak", "Hisar", "Yamunanagar", "Panchkula"],
        "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur", "Dhamtari"],
        "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Goalpara"]
    },
    "floor_multipliers": {
        "1": 1.0,
        "2": 1.06,
        "3": 1.12,
        "4": 1.18,
        "5": 1.25
    },
    "phase_percentages": {
        "planning_approval": 3,
        "site_preparation": 5,
        "foundation": 12,
        "structural_frame": 22,
        "brickwork_masonry": 10,
        "roofing": 8,
        "plumbing": 6,
        "electrical": 7,
        "flooring_tiling": 9,
        "doors_windows": 6,
        "painting_finishing": 7,
        "final_fixtures": 5
    },
    "material_rates": {
        "cement": {"unit": "bag (50kg)", "rate": 400, "qty_per_sqft": 0.4},
        "steel": {"unit": "kg", "rate": 70, "qty_per_sqft": 4.5},
        "bricks": {"unit": "nos", "rate": 9, "qty_per_sqft": 45},
        "sand": {"unit": "cft", "rate": 60, "qty_per_sqft": 1.5},
        "aggregate": {"unit": "cft", "rate": 55, "qty_per_sqft": 2.0},
        "water_proofing": {"unit": "sqft", "rate": 45, "qty_per_sqft": 0.3},
        "paint": {"unit": "ltr", "rate": 220, "qty_per_sqft": 0.15}
    },
    "optional_features": {
        "modular_kitchen": {"name": "Modular Kitchen", "cost": 180000},
        "basic_kitchen": {"name": "Basic Kitchen", "cost": 70000},
        "solar_panel_3kw": {"name": "Solar Panel (3KW)", "cost": 180000},
        "solar_panel_5kw": {"name": "Solar Panel (5KW)", "cost": 280000},
        "home_automation": {"name": "Basic Home Automation", "cost": 150000},
        "cctv_security": {"name": "CCTV & Security System", "cost": 85000},
        "water_tank_overhead": {"name": "Overhead Water Tank (1000L)", "cost": 35000},
        "water_tank_underground": {"name": "Underground Water Tank (5000L)", "cost": 120000},
        "boundary_wall": {"name": "Boundary Wall (per running ft)", "cost": 1800},
        "car_parking": {"name": "Car Parking (covered)", "cost": 180000},
        "terrace_garden": {"name": "Terrace Garden Setup", "cost": 95000},
        "false_ceiling": {"name": "False Ceiling (per sqft)", "cost": 85},
        "lift_elevator": {"name": "Elevator/Lift", "cost": 850000},
        "swimming_pool": {"name": "Swimming Pool (basic)", "cost": 1200000},
        "landscaping": {"name": "Garden Landscaping", "cost": 150000}
    },
    "flooring_rates": {
        "vitrified_standard": {"name": "Vitrified Tiles (Standard)", "rate_per_sqft": 55},
        "vitrified_premium": {"name": "Vitrified Tiles (Premium)", "rate_per_sqft": 85},
        "marble_indian": {"name": "Indian Marble", "rate_per_sqft": 150},
        "marble_italian": {"name": "Italian Marble", "rate_per_sqft": 350},
        "granite": {"name": "Granite", "rate_per_sqft": 120},
        "wooden_laminate": {"name": "Wooden Laminate", "rate_per_sqft": 95},
        "hardwood": {"name": "Hardwood Flooring", "rate_per_sqft": 280}
    },
    "bathroom_rates": {
        "basic": {"name": "Basic (Indian fittings)", "cost": 45000},
        "standard": {"name": "Standard (Branded fittings)", "cost": 85000},
        "premium": {"name": "Premium (Imported fittings)", "cost": 175000}
    },
    "door_window_rates": {
        "wooden_standard": {"name": "Wooden (Standard)", "per_door": 12000, "per_window": 8000},
        "wooden_premium": {"name": "Wooden (Teak)", "per_door": 28000, "per_window": 18000},
        "upvc": {"name": "UPVC", "per_door": 18000, "per_window": 12000},
        "aluminium": {"name": "Aluminium", "per_door": 15000, "per_window": 10000}
    },
    "last_updated": datetime.now(timezone.utc).isoformat()
}

async def get_estimator_rates():
    """Fetch rates from Supabase, initialize with defaults if not present"""
    try:
        res = supabase.table("estimator_rates").select("data").eq("id", "default_rates").execute()
        if res.data and len(res.data) > 0 and res.data[0].get("data"):
            return res.data[0]["data"]
        
        supabase.table("estimator_rates").upsert({
            "id": "default_rates",
            "data": DEFAULT_ESTIMATOR_RATES,
            "last_updated": datetime.now(timezone.utc).isoformat()
        }).execute()
        return DEFAULT_ESTIMATOR_RATES
    except Exception as e:
        logging.error(f"Error fetching estimator rates from Supabase: {e}")
        return DEFAULT_ESTIMATOR_RATES

class EstimatorInputs(BaseModel):
    state: str
    district: str
    area_sqft: int
    quality: str
    floors: int
    flooring_type: str
    bathroom_type: str
    bathroom_count: int
    door_window_type: str
    door_count: int
    window_count: int
    optional_features: List[str] = []

# ==================== PUBLIC API ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Dhota Construction API (Powered by Supabase)"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "dhota-construction", "database": "supabase"}

@api_router.get("/estimator/rates")
async def get_rates():
    rates = await get_estimator_rates()
    return rates

@api_router.get("/estimator/states")
async def get_states():
    rates = await get_estimator_rates()
    return {"states": list(rates.get("district_data", {}).keys())}

@api_router.get("/estimator/districts/{state}")
async def get_districts(state: str):
    rates = await get_estimator_rates()
    districts = rates.get("district_data", {}).get(state, [])
    return {"state": state, "districts": districts}

@api_router.post("/estimator/calculate")
async def calculate_detailed_estimate(inputs: EstimatorInputs):
    try:
        rates = await get_estimator_rates()
        base_rate = rates["base_rates"].get(inputs.quality, rates["base_rates"]["standard"])
        state_multiplier = rates["state_multipliers"].get(inputs.state, 1.0)
        floor_multiplier = rates["floor_multipliers"].get(str(min(inputs.floors, 5)), 1.0)
        if inputs.floors > 5:
            floor_multiplier += (inputs.floors - 5) * 0.06
        
        total_area = inputs.area_sqft * inputs.floors
        adjusted_rate = base_rate * state_multiplier * floor_multiplier
        base_construction_cost = total_area * adjusted_rate
        
        flooring_rate = rates["flooring_rates"].get(inputs.flooring_type, {}).get("rate_per_sqft", 55)
        flooring_cost = total_area * flooring_rate
        
        bathroom_cost_per = rates["bathroom_rates"].get(inputs.bathroom_type, {}).get("cost", 85000)
        bathroom_cost = bathroom_cost_per * inputs.bathroom_count
        
        door_window_rates = rates["door_window_rates"].get(inputs.door_window_type, {})
        door_cost = door_window_rates.get("per_door", 12000) * inputs.door_count
        window_cost = door_window_rates.get("per_window", 8000) * inputs.window_count
        door_window_cost = door_cost + window_cost
        
        optional_breakdown = {}
        optional_features_cost = 0
        for feature_key in inputs.optional_features:
            feature = rates["optional_features"].get(feature_key, {})
            if feature:
                feature_cost = feature.get("cost", 0)
                if "per sqft" in feature.get("name", "").lower():
                    feature_cost = feature_cost * total_area
                optional_breakdown[feature_key] = {
                    "name": feature.get("name"),
                    "cost": feature_cost
                }
                optional_features_cost += feature_cost
        
        total_cost = base_construction_cost + flooring_cost + bathroom_cost + door_window_cost + optional_features_cost
        cost_per_sqft = total_cost / total_area if total_area > 0 else 0
        
        phase_breakdown = {}
        for phase, percentage in rates["phase_percentages"].items():
            phase_breakdown[phase] = {
                "name": phase.replace("_", " ").title(),
                "percentage": percentage,
                "cost": round(base_construction_cost * (percentage / 100))
            }
        
        material_breakdown = {}
        for material, data in rates["material_rates"].items():
            qty = round(total_area * data["qty_per_sqft"])
            material_breakdown[material] = {
                "name": material.replace("_", " ").title(),
                "quantity": qty,
                "unit": data["unit"],
                "rate": data["rate"],
                "total": round(qty * data["rate"])
            }
        
        return {
            "total_cost": round(total_cost),
            "cost_per_sqft": round(cost_per_sqft),
            "total_built_up_area": total_area,
            "area_per_floor": inputs.area_sqft,
            "quality": inputs.quality,
            "state": inputs.state,
            "district": inputs.district,
            "floors": inputs.floors,
            "base_construction_cost": round(base_construction_cost),
            "flooring_cost": round(flooring_cost),
            "bathroom_cost": round(bathroom_cost),
            "door_window_cost": round(door_window_cost),
            "optional_features_cost": round(optional_features_cost),
            "phase_breakdown": phase_breakdown,
            "material_breakdown": material_breakdown,
            "optional_breakdown": optional_breakdown,
            "location_multiplier": state_multiplier,
            "floor_multiplier": floor_multiplier,
            "base_rate_per_sqft": base_rate,
            "adjusted_rate_per_sqft": round(adjusted_rate)
        }
    except Exception as e:
        logging.error(f"Error calculating estimate: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.put("/admin/estimator/rates")
async def update_estimator_rates(rates_update: dict, payload: dict = Depends(verify_token)):
    try:
        rates_update["last_updated"] = datetime.now(timezone.utc).isoformat()
        rates_update["id"] = "default_rates"
        supabase.table("estimator_rates").upsert({
            "id": "default_rates",
            "data": rates_update,
            "last_updated": datetime.now(timezone.utc).isoformat()
        }).execute()
        return {"message": "Rates updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/admin/estimator/rates")
async def get_admin_estimator_rates(payload: dict = Depends(verify_token)):
    rates = await get_estimator_rates()
    return rates

@api_router.post("/inquiries", response_model=ContactInquiry)
async def create_inquiry(input: ContactInquiryCreate):
    try:
        inquiry_dict = input.model_dump()
        inquiry_obj = ContactInquiry(**inquiry_dict)
        doc = inquiry_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        supabase.table("inquiries").insert(doc).execute()
        return inquiry_obj
    except Exception as e:
        logging.error(f"Error submitting inquiry to Supabase: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to submit inquiry: {str(e)}")

@api_router.post("/upload-review-images")
async def upload_multiple_review_images(files: List[UploadFile] = File(...), email: str = None):
    """Upload multiple image files for review submission to Supabase Storage"""
    if not email:
        raise HTTPException(status_code=400, detail="Email is required for review image upload")
    
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images allowed per review")
    
    safe_email = email.replace("@", "_at_").replace(".", "_")
    uploaded_images = []
    
    for file in files:
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type for {file.filename}. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File {file.filename} too large. Maximum size is {MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        storage_path = f"review_images/{safe_email}/{unique_filename}"
        
        content_type = file.content_type or f"image/{file_ext.lstrip('.')}"
        if content_type == "image/jpg":
            content_type = "image/jpeg"
        
        try:
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                path=storage_path,
                file=content,
                file_options={"content-type": content_type, "upsert": "true"}
            )
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(storage_path)
            uploaded_images.append(public_url)
        except Exception as e:
            logging.error(f"Failed to upload review image to Supabase: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save file {file.filename}: {str(e)}")
    
    return {"image_urls": uploaded_images, "count": len(uploaded_images)}

@api_router.post("/reviews")
async def submit_review(data: ReviewCreate):
    try:
        existing = supabase.table("reviews").select("id").eq("email", data.email).execute()
        if existing.data and len(existing.data) > 0:
            raise HTTPException(
                status_code=400, 
                detail="You have already submitted a review with this email. Please wait for admin approval or contact support."
            )
        
        images = [{"url": url, "approved": False} for url in (data.image_urls or [])]
        review = Review(
            name=data.name,
            email=data.email,
            phone=data.phone,
            location=data.location,
            project_type=data.project_type,
            rating=data.rating,
            comment=data.comment,
            images=images
        )
        
        doc = review.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        supabase.table("reviews").insert(doc).execute()
        return {"message": "Review submitted successfully. It will be visible after admin approval.", "id": review.id}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error submitting review to Supabase: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to submit review: {str(e)}")

@api_router.get("/reviews")
async def get_approved_reviews():
    try:
        res = supabase.table("reviews").select("id, name, location, project_type, rating, comment, images, created_at").eq("status", "approved").order("created_at", desc=True).limit(50).execute()
        reviews = res.data or []
        for review in reviews:
            if "images" in review and review["images"]:
                review["images"] = [img for img in review["images"] if img.get("approved", False)]
        return reviews
    except Exception as e:
        logging.error(f"Error fetching approved reviews: {e}")
        return []

@api_router.get("/testimonials")
async def get_testimonials():
    try:
        res = supabase.table("reviews").select("id, name, location, project_type, rating, comment, images, created_at").eq("status", "approved").order("created_at", desc=True).limit(10).execute()
        reviews = res.data or []
        if reviews:
            for review in reviews:
                if review.get("images"):
                    review["images"] = [img for img in review["images"] if img.get("approved", False)]
            return reviews
    except Exception as e:
        logging.error(f"Error fetching testimonials: {e}")
        
    return [
        {
            "id": "1",
            "name": "Rajesh Kumar",
            "location": "Giridih",
            "rating": 5,
            "project_type": "Residential Villa",
            "comment": "Dhota Construction delivered our dream home on time and within budget. The attention to detail and quality of work exceeded our expectations.",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
        },
        {
            "id": "2",
            "name": "Priya Sharma",
            "location": "Ranchi",
            "rating": 5,
            "project_type": "Commercial Office",
            "comment": "Professional team, transparent pricing, and excellent project management. Our office building was completed ahead of schedule with superior quality.",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
        },
        {
            "id": "3",
            "name": "Amit Patel",
            "location": "Dhanbad",
            "rating": 5,
            "project_type": "Home Renovation",
            "comment": "The renovation work transformed our old house into a modern home. The team was courteous, skilled, and completed work without any hassle.",
            "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
        }
    ]

@api_router.get("/faqs")
async def get_faqs():
    return [
        {
            "id": "1",
            "question": "What is the typical construction timeline?",
            "answer": "For a standard residential project, the timeline is usually 8-12 months depending on the size and complexity. Commercial projects may take 12-18 months. We provide a detailed timeline during the planning phase."
        },
        {
            "id": "2",
            "question": "What are the payment terms?",
            "answer": "We follow a milestone-based payment structure: 10% on booking, 20% on foundation completion, 30% on structure completion, 25% on finishing work, and 15% on handover. This ensures transparency and protects both parties."
        },
        {
            "id": "3",
            "question": "What materials do you use?",
            "answer": "We use only ISI-certified and branded materials from trusted suppliers. This includes TMT steel bars, high-grade cement, quality aggregates, and premium fittings. Material specifications are shared with clients before procurement."
        },
        {
            "id": "4",
            "question": "Do you provide architectural designs?",
            "answer": "Yes, we have an in-house team of architects and designers who work closely with clients to create customized designs. We also collaborate with external architects if clients have specific preferences."
        },
        {
            "id": "5",
            "question": "Is there a warranty on construction?",
            "answer": "We provide a 30-year structural warranty and 1-year warranty on finishing work. Our commitment to quality means we stand behind our work long after project completion."
        },
        {
            "id": "6",
            "question": "How do you ensure quality control?",
            "answer": "We have a dedicated quality control team that conducts regular inspections at every stage. We also provide progress reports with photographs and allow clients to visit the site at any time."
        }
    ]

@api_router.get("/services")
async def get_services():
    return [
        {
            "id": "residential",
            "title": "Residential Construction",
            "description": "Building your dream home from foundation to finish. We specialize in villas, apartments, and row houses with modern amenities and timeless designs.",
            "icon": "Home",
            "features": ["Custom Home Design", "Villas & Bungalows", "Apartments", "Row Houses", "Farm Houses"]
        },
        {
            "id": "commercial",
            "title": "Commercial Buildings",
            "description": "State-of-the-art commercial spaces designed for productivity and growth. From offices to retail spaces, we build structures that make a statement.",
            "icon": "Building2",
            "features": ["Office Buildings", "Retail Spaces", "Warehouses", "Industrial Units", "Shopping Complexes"]
        },
        {
            "id": "renovation",
            "title": "Renovation & Remodeling",
            "description": "Transform your existing space with our expert renovation services. We breathe new life into old structures while preserving their character.",
            "icon": "Hammer",
            "features": ["Home Renovation", "Office Makeover", "Structural Repairs", "Extensions", "Modernization"]
        },
        {
            "id": "interior",
            "title": "Interior & Exterior Work",
            "description": "Complete interior and exterior solutions including painting, flooring, false ceilings, landscaping, and facade treatments.",
            "icon": "Paintbrush",
            "features": ["Interior Design", "Modular Kitchens", "Flooring", "Painting", "Landscaping"]
        },
        {
            "id": "consultation",
            "title": "Project Management",
            "description": "End-to-end project management services ensuring your construction project stays on track, on budget, and meets all quality standards.",
            "icon": "ClipboardList",
            "features": ["Project Planning", "Cost Estimation", "Vendor Management", "Quality Control", "Timeline Management"]
        }
    ]

@api_router.get("/company-info")
async def get_company_info():
    return COMPANY_INFO

@api_router.get("/projects")
async def get_projects():
    """Get all public projects for gallery from Supabase"""
    try:
        res = supabase.table("projects").select("*").order("created_at", desc=True).limit(100).execute()
        return res.data or []
    except Exception as e:
        logging.error(f"Error fetching public projects from Supabase: {e}")
        return []

# ==================== ADMIN AUTH ROUTES ====================

@api_router.post("/admin/register")
async def admin_register(data: AdminRegister):
    """Register a new admin user - requires secret key"""
    if data.admin_secret != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin registration key. Contact system administrator.")
    
    # Check if admin already exists
    existing_u = supabase.table("admins").select("id").eq("username", data.username).execute()
    if existing_u.data:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_e = supabase.table("admins").select("id").eq("email", data.email).execute()
    if existing_e.data:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    admin = AdminUser(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        security_question=data.security_question,
        security_answer_hash=hash_password(data.security_answer.lower().strip())
    )
    
    doc = admin.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    supabase.table("admins").insert(doc).execute()
    
    token = create_token(admin.id, admin.username)
    return {"token": token, "user": {"id": admin.id, "username": admin.username, "email": admin.email}}

@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    """Login admin user using Supabase"""
    res = supabase.table("admins").select("*").eq("username", data.username).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    admin = res.data[0]
    if not verify_password(data.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(admin['id'], admin['username'])
    return {"token": token, "user": {"id": admin['id'], "username": admin['username'], "email": admin['email']}}

@api_router.post("/admin/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    if data.admin_secret != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin secret key.")
    
    res = supabase.table("admins").select("security_question, username").eq("email", data.email).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=404, detail="Email not found")
    
    admin = res.data[0]
    return {"security_question": admin['security_question'], "username": admin['username']}

@api_router.post("/admin/reset-password")
async def reset_password(data: ResetPasswordRequest):
    res = supabase.table("admins").select("*").eq("email", data.email).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=404, detail="Email not found")
    
    admin = res.data[0]
    if not verify_password(data.security_answer.lower().strip(), admin['security_answer_hash']):
        raise HTTPException(status_code=401, detail="Incorrect security answer")
    
    new_hash = hash_password(data.new_password)
    supabase.table("admins").update({"password_hash": new_hash}).eq("email", data.email).execute()
    
    return {"message": "Password reset successfully. Please login with your new password."}

@api_router.get("/admin/me")
async def get_current_admin(payload: dict = Depends(verify_token)):
    res = supabase.table("admins").select("id, username, email, role, created_at").eq("id", payload['user_id']).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=404, detail="Admin not found")
    return res.data[0]

# ==================== ADMIN INQUIRY MANAGEMENT ====================

@api_router.get("/admin/inquiries")
async def get_all_inquiries(payload: dict = Depends(verify_token)):
    res = supabase.table("inquiries").select("*").order("created_at", desc=True).limit(1000).execute()
    return res.data or []

@api_router.put("/admin/inquiries/{inquiry_id}")
async def update_inquiry_status(inquiry_id: str, data: InquiryStatusUpdate, payload: dict = Depends(verify_token)):
    res = supabase.table("inquiries").update({"status": data.status, "notes": data.notes}).eq("id", inquiry_id).execute()
    return {"message": "Inquiry updated successfully"}

@api_router.delete("/admin/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, payload: dict = Depends(verify_token)):
    res = supabase.table("inquiries").delete().eq("id", inquiry_id).execute()
    return {"message": "Inquiry deleted successfully"}

# ==================== IMAGE UPLOAD (SUPABASE STORAGE) ====================

@api_router.post("/admin/upload-images")
async def upload_multiple_images_supabase(files: List[UploadFile] = File(...), payload: dict = Depends(verify_token)):
    """Upload multiple images to Supabase Storage and return their public URLs (Replaces Cloudinary)"""
    logging.info(f"=== UPLOAD REQUEST: Received {len(files)} files for Supabase Storage ===")
    
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images allowed per upload")
    
    uploaded_images = []
    
    for idx, file in enumerate(files):
        try:
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type for {file.filename}. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
                )
            
            content = await file.read()
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"File {file.filename} too large. Maximum size is {MAX_FILE_SIZE / (1024*1024)}MB"
                )
            
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            storage_path = f"projects/{unique_filename}"
            
            content_type = file.content_type or f"image/{file_ext.lstrip('.')}"
            if content_type == "image/jpg":
                content_type = "image/jpeg"
            
            logging.info(f"Uploading {file.filename} to Supabase path: {storage_path}")
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                path=storage_path,
                file=content,
                file_options={"content-type": content_type, "upsert": "true"}
            )
            
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(storage_path)
            logging.info(f"Successfully uploaded {file.filename} to Supabase: {public_url}")
            uploaded_images.append(public_url)
            
        except HTTPException:
            raise
        except Exception as e:
            error_msg = f"Failed to upload {file.filename}: {str(e)}"
            logging.error(error_msg)
            logging.exception(e)
            raise HTTPException(status_code=500, detail=error_msg)
    
    logging.info(f"=== UPLOAD COMPLETE: {len(uploaded_images)} images uploaded ===")
    return {"image_urls": uploaded_images, "count": len(uploaded_images)}

# ==================== ADMIN PROJECT GALLERY MANAGEMENT ====================

@api_router.get("/admin/projects")
async def get_admin_projects(payload: dict = Depends(verify_token)):
    res = supabase.table("projects").select("*").order("created_at", desc=True).limit(100).execute()
    return res.data or []

@api_router.post("/admin/projects")
async def create_project(data: ProjectGalleryCreate, payload: dict = Depends(verify_token)):
    project = ProjectGallery(**data.model_dump())
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    supabase.table("projects").insert(doc).execute()
    return project

@api_router.put("/admin/projects/{project_id}")
async def update_project(project_id: str, data: ProjectGalleryCreate, payload: dict = Depends(verify_token)):
    res = supabase.table("projects").update(data.model_dump()).eq("id", project_id).execute()
    return {"message": "Project updated successfully"}

@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str, payload: dict = Depends(verify_token)):
    res = supabase.table("projects").delete().eq("id", project_id).execute()
    return {"message": "Project deleted successfully"}

# ==================== ADMIN REVIEWS MANAGEMENT ====================

@api_router.get("/admin/reviews")
async def get_all_reviews(payload: dict = Depends(verify_token)):
    res = supabase.table("reviews").select("*").order("created_at", desc=True).limit(100).execute()
    return res.data or []

@api_router.put("/admin/reviews/{review_id}")
async def update_review_status(review_id: str, data: ReviewStatusUpdate, payload: dict = Depends(verify_token)):
    res = supabase.table("reviews").update({"status": data.status}).eq("id", review_id).execute()
    return {"message": f"Review {data.status} successfully"}

@api_router.put("/admin/reviews/{review_id}/images")
async def update_review_image_approval(review_id: str, data: ReviewImageApproval, payload: dict = Depends(verify_token)):
    res = supabase.table("reviews").select("images").eq("id", review_id).execute()
    if not res.data or len(res.data) == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review = res.data[0]
    images = review.get("images", [])
    updated = False
    
    for img in images:
        if img["url"] == data.image_url:
            img["approved"] = data.approved
            updated = True
            break
    
    if not updated:
        raise HTTPException(status_code=404, detail="Image not found in review")
    
    supabase.table("reviews").update({"images": images}).eq("id", review_id).execute()
    return {"message": f"Image {'approved' if data.approved else 'rejected'} successfully"}

@api_router.delete("/admin/reviews/{review_id}")
async def delete_review(review_id: str, payload: dict = Depends(verify_token)):
    res = supabase.table("reviews").delete().eq("id", review_id).execute()
    return {"message": "Review deleted successfully"}

# ==================== ADMIN STATS ====================

@api_router.get("/admin/stats")
async def get_admin_stats(payload: dict = Depends(verify_token)):
    try:
        total_inquiries = supabase.table("inquiries").select("id", count="exact").execute().count or 0
        new_inquiries = supabase.table("inquiries").select("id", count="exact").eq("status", "new").execute().count or 0
        total_projects = supabase.table("projects").select("id", count="exact").execute().count or 0
        pending_reviews = supabase.table("reviews").select("id", count="exact").eq("status", "pending").execute().count or 0
        recent_inquiries = supabase.table("inquiries").select("*").order("created_at", desc=True).limit(5).execute().data or []
        
        return {
            "total_inquiries": total_inquiries,
            "new_inquiries": new_inquiries,
            "total_projects": total_projects,
            "pending_reviews": pending_reviews,
            "recent_inquiries": recent_inquiries
        }
    except Exception as e:
        logging.error(f"Error fetching admin stats from Supabase: {e}")
        return {
            "total_inquiries": 0,
            "new_inquiries": 0,
            "total_projects": 0,
            "pending_reviews": 0,
            "recent_inquiries": []
        }

# Include the router in the main app
app.include_router(api_router)

allowed_origins = [
    origin.strip()
    for origin in os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8001"))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
