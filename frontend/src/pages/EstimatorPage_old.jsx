import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calculator, 
  Home, 
  Building2, 
  Crown,
  MapPin,
  Layers,
  ArrowRight,
  AlertCircle,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
const API = `${BACKEND_URL}/api`;

const EstimatorPage = () => {
  const [formData, setFormData] = useState({
    area_sqft: 1000,
    num_floors: 1,
    construction_type: "standard",
    location_type: "semi_urban",
    material_quality: "standard"
  });
  const [estimate, setEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const constructionTypes = [
    { id: "basic", label: "Basic", icon: Home, desc: "Standard finishes, economical" },
    { id: "standard", label: "Standard", icon: Building2, desc: "Quality finishes, balanced" },
    { id: "premium", label: "Premium", icon: Crown, desc: "Luxury finishes, premium" }
  ];

  const locationTypes = [
    { id: "rural", label: "Rural", factor: "-15%" },
    { id: "semi_urban", label: "Semi-Urban", factor: "Base" },
    { id: "urban", label: "Urban", factor: "+15%" }
  ];

  const materialQualities = [
    { id: "economy", label: "Economy", factor: "-10%" },
    { id: "standard", label: "Standard", factor: "Base" },
    { id: "premium", label: "Premium", factor: "+20%" }
  ];

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const response = await axios.post(`${API}/estimate`, formData);
      setEstimate(response.data);
      toast.success("Estimate calculated successfully!");
    } catch (error) {
      console.error("Error calculating estimate:", error);
      toast.error("Failed to calculate estimate. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="pt-16 md:pt-20" data-testid="estimator-page">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#FF6700] text-sm font-semibold uppercase tracking-widest">
              Cost Estimator
            </span>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              CALCULATE YOUR<br />
              <span className="text-[#FF6700]">CONSTRUCTION COST</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get an instant estimate for your construction project. 
              Customize parameters to see how different choices affect your budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding bg-gray-100" data-testid="calculator-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-3">
              <div className="estimator-container p-6 md:p-8 text-white">
                <div className="flex items-center gap-3 mb-8">
                  <Calculator className="w-8 h-8 text-[#FF6700]" />
                  <h2 
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    PROJECT PARAMETERS
                  </h2>
                </div>

                {/* Area Slider */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-gray-300 font-medium">
                      Built-up Area (per floor)
                    </label>
                    <span className="stat-number text-2xl text-[#FF6700]">
                      {formData.area_sqft.toLocaleString()} sq ft
                    </span>
                  </div>
                  <Slider
                    value={[formData.area_sqft]}
                    onValueChange={(value) => setFormData({ ...formData, area_sqft: value[0] })}
                    min={500}
                    max={10000}
                    step={100}
                    className="w-full"
                    data-testid="area-slider"
                  />
                  <div className="flex justify-between text-gray-500 text-sm mt-2">
                    <span>500 sq ft</span>
                    <span>10,000 sq ft</span>
                  </div>
                </div>

                {/* Number of Floors */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-gray-300 font-medium flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Number of Floors
                    </label>
                    <span className="stat-number text-2xl text-[#FF6700]">
                      {formData.num_floors}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((floor) => (
                      <button
                        key={floor}
                        onClick={() => setFormData({ ...formData, num_floors: floor })}
                        className={`flex-1 py-3 font-semibold transition-colors ${
                          formData.num_floors === floor
                            ? "bg-[#FF6700] text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                        data-testid={`floor-btn-${floor}`}
                      >
                        {floor}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Construction Type */}
                <div className="mb-8">
                  <label className="text-gray-300 font-medium mb-4 block">
                    Construction Type
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {constructionTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, construction_type: type.id })}
                        className={`p-4 text-center transition-colors border-2 ${
                          formData.construction_type === type.id
                            ? "border-[#FF6700] bg-[#FF6700]/10"
                            : "border-gray-700 hover:border-gray-500"
                        }`}
                        data-testid={`construction-type-${type.id}`}
                      >
                        <type.icon className={`w-8 h-8 mx-auto mb-2 ${
                          formData.construction_type === type.id ? "text-[#FF6700]" : "text-gray-400"
                        }`} />
                        <p className="font-semibold text-white">{type.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Type */}
                <div className="mb-8">
                  <label className="text-gray-300 font-medium mb-4 block flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Type
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {locationTypes.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setFormData({ ...formData, location_type: loc.id })}
                        className={`p-4 text-center transition-colors border-2 ${
                          formData.location_type === loc.id
                            ? "border-[#FF6700] bg-[#FF6700]/10"
                            : "border-gray-700 hover:border-gray-500"
                        }`}
                        data-testid={`location-type-${loc.id}`}
                      >
                        <p className="font-semibold text-white">{loc.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{loc.factor}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Quality */}
                <div className="mb-8">
                  <label className="text-gray-300 font-medium mb-4 block">
                    Material Quality
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {materialQualities.map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => setFormData({ ...formData, material_quality: mat.id })}
                        className={`p-4 text-center transition-colors border-2 ${
                          formData.material_quality === mat.id
                            ? "border-[#FF6700] bg-[#FF6700]/10"
                            : "border-gray-700 hover:border-gray-500"
                        }`}
                        data-testid={`material-quality-${mat.id}`}
                      >
                        <p className="font-semibold text-white">{mat.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{mat.factor}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full bg-[#FF6700] hover:bg-[#E65C00] text-white rounded-none py-6 text-lg font-semibold uppercase tracking-wider"
                  data-testid="calculate-btn"
                >
                  {isCalculating ? "Calculating..." : "Calculate Estimate"}
                </Button>
              </div>
            </div>

            {/* Result Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white border-2 border-gray-200 p-6 md:p-8 sticky top-24">
                <h3 
                  className="text-xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  ESTIMATED COST
                </h3>

                {estimate ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    data-testid="estimate-result"
                  >
                    <div className="text-center mb-6 pb-6 border-b border-gray-200">
                      <p className="text-gray-500 text-sm mb-2">Total Estimated Cost</p>
                      <p className="stat-number text-3xl md:text-4xl font-bold text-gray-900">
                        {formatCurrency(estimate.min_cost)} - {formatCurrency(estimate.max_cost)}
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Built-up Area</span>
                        <span className="font-semibold text-gray-900">
                          {estimate.breakdown.total_built_up_area.toLocaleString()} sq ft
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Rate</span>
                        <span className="font-semibold text-gray-900">
                          {estimate.breakdown.base_rate_range}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location Adjustment</span>
                        <span className="font-semibold text-gray-900">
                          {estimate.breakdown.location_adjustment}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floor Adjustment</span>
                        <span className="font-semibold text-gray-900">
                          {estimate.breakdown.floor_adjustment}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material Adjustment</span>
                        <span className="font-semibold text-gray-900">
                          {estimate.breakdown.material_adjustment}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#FF6700] flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600 text-sm">
                          This is an approximate estimate. Final cost may vary based on site conditions, 
                          design complexity, and current material prices.
                        </p>
                      </div>
                    </div>

                    <Link to="/contact">
                      <Button
                        className="w-full bg-[#FF6700] hover:bg-[#E65C00] text-white rounded-none py-4 font-semibold uppercase tracking-wider"
                        data-testid="get-quote-btn"
                      >
                        Get Detailed Quote
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="text-center py-8" data-testid="estimate-placeholder">
                    <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Adjust the parameters and click<br />
                      "Calculate Estimate" to see results
                    </p>
                  </div>
                )}

                {/* Benefits */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">What's Included:</h4>
                  <ul className="space-y-2">
                    {[
                      "Foundation & Structure",
                      "Electrical & Plumbing",
                      "Basic Finishing",
                      "Windows & Doors"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <Check className="w-4 h-4 text-[#FF6700]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EstimatorPage;
