import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Layers, Download, Home, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const locationTypes = {
  rural: { label: "Rural", multiplier: 0.85 },
  semi_urban: { label: "Semi-Urban", multiplier: 1.0 },
  urban: { label: "Urban", multiplier: 1.15 }
};

const qualityRates = {
  basic: { min: 1100, max: 1400, label: "Basic" },
  standard: { min: 1500, max: 1900, label: "Standard" },
  premium: { min: 2200, max: 2800, label: "Premium" },
  luxury: { min: 3200, max: 4000, label: "Luxury" }
};

const materialRates = {
  cement: { name: "Cement", unit: "bags", qtyPerSqft: 0.4, minRate: 300, maxRate: 450 },
  steel: { name: "Steel/TMT Bars", unit: "kg", qtyPerSqft: 4.5, minRate: 60, maxRate: 80 },
  bricks: { name: "Bricks", unit: "nos", qtyPerSqft: 23, minRate: 7, maxRate: 13 },
  sand: { name: "Sand", unit: "cft", qtyPerSqft: 1.5, minRate: 50, maxRate: 75 },
  aggregate: { name: "Aggregate/Gravel", unit: "cft", qtyPerSqft: 2.0, minRate: 45, maxRate: 65 },
  tiles: { name: "Flooring Tiles", unit: "sqft", qtyPerSqft: 1.0, minRate: 25, maxRate: 200 },
  paint: { name: "Paint", unit: "ltr", qtyPerSqft: 0.15, minRate: 180, maxRate: 350 }
};

const optionalFeatures = [
  { key: "modular_kitchen", name: "Modular Kitchen", cost: 150000 },
  { key: "solar_3kw", name: "Solar Panel (3KW)", cost: 180000 },
  { key: "cctv", name: "CCTV & Security", cost: 75000 },
  { key: "borewell", name: "Borewell", cost: 90000 },
  { key: "water_tank", name: "Water Tank (Underground)", cost: 100000 },
  { key: "boundary_wall", name: "Boundary Wall", cost: 80000 },
  { key: "car_parking", name: "Covered Car Parking", cost: 150000 },
  { key: "false_ceiling", name: "False Ceiling", cost: 50000 },
  { key: "landscaping", name: "Garden/Landscaping", cost: 120000 }
];

const EstimatorPage = () => {
  const [formData, setFormData] = useState({
    area: 1500,
    quality: "standard",
    locationType: "semi_urban",
    floors: 1,
    bathrooms: 2,
    optionalFeatures: []
  });

  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    document.title = "Dhota Construction - Cost Estimator";
  }, []);

  // Calculate estimate
  useEffect(() => {
    const totalArea = formData.area * formData.floors;
    const rates = qualityRates[formData.quality];
    const floorMultiplier = 1 + (formData.floors - 1) * 0.06;
    const locationMultiplier = locationTypes[formData.locationType].multiplier;

    const minBaseRate = rates.min * floorMultiplier * locationMultiplier;
    const maxBaseRate = rates.max * floorMultiplier * locationMultiplier;

    const minBaseCost = totalArea * minBaseRate;
    const maxBaseCost = totalArea * maxBaseRate;

    // Bathroom cost
    const bathroomCost = formData.bathrooms * 70000;

    // Optional features cost
    const optionalCost = formData.optionalFeatures.reduce((sum, key) => {
      const feature = optionalFeatures.find(f => f.key === key);
      return sum + (feature?.cost || 0);
    }, 0);

    // Material breakdown
    const materials = Object.entries(materialRates).map(([key, data]) => {
      const qty = Math.ceil(totalArea * data.qtyPerSqft);
      return {
        name: data.name,
        quantity: qty,
        unit: data.unit,
        minRate: data.minRate,
        maxRate: data.maxRate,
        minTotal: qty * data.minRate,
        maxTotal: qty * data.maxRate
      };
    });

    setEstimate({
      totalArea,
      minCost: Math.round(minBaseCost + bathroomCost + optionalCost),
      maxCost: Math.round(maxBaseCost + bathroomCost + optionalCost),
      minCostPerSqft: Math.round(minBaseRate),
      maxCostPerSqft: Math.round(maxBaseRate),
      baseCost: { min: minBaseCost, max: maxBaseCost },
      bathroomCost,
      optionalCost,
      materials
    });
  }, [formData]);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleFeatureToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      optionalFeatures: prev.optionalFeatures.includes(key)
        ? prev.optionalFeatures.filter(f => f !== key)
        : [...prev.optionalFeatures, key]
    }));
  };

  // Export PDF
  const exportToPDF = () => {
    if (!estimate) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header
    doc.setFillColor(214, 154, 85);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text("DHOTA CONSTRUCTION", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text("Construction Cost Estimate", pageWidth / 2, 27, { align: "center" });

    // Watermark - draw DC logo text as watermark
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(60);
    doc.setFont(undefined, 'bold');
    doc.text("DC", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
    doc.setFontSize(20);
    doc.text("DHOTA CONSTRUCTION", pageWidth / 2, pageHeight / 2 + 20, { align: "center", angle: 45 });

    doc.setTextColor(0, 0, 0);
    let y = 50;

    // Project Details
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Project Details", 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Built-up Area: ${estimate.totalArea} sq.ft (${formData.floors} floor${formData.floors > 1 ? 's' : ''})`, 14, y);
    y += 6;
    doc.text(`Quality: ${qualityRates[formData.quality].label}`, 14, y);
    y += 6;
    doc.text(`Location: ${locationTypes[formData.locationType].label}`, 14, y);
    y += 6;
    doc.text(`Bathrooms: ${formData.bathrooms}`, 14, y);
    y += 12;

    // Total Cost
    doc.setFillColor(214, 154, 85);
    doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("ESTIMATED COST RANGE", 20, y + 8);
    doc.setFontSize(14);
    doc.text(`Rs. ${(estimate.minCost/100000).toFixed(2)}L - Rs. ${(estimate.maxCost/100000).toFixed(2)}L`, 20, y + 16);
    doc.setTextColor(0, 0, 0);
    y += 35;

    // Material Breakdown
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Material Estimate (Approximate)", 14, y);
    y += 5;

    const materialData = estimate.materials.map(m => [
      m.name,
      `${m.quantity.toLocaleString()} ${m.unit}`,
      `Rs.${m.minRate} - Rs.${m.maxRate}`,
      `Rs.${(m.minTotal/1000).toFixed(0)}K - Rs.${(m.maxTotal/1000).toFixed(0)}K`
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Material', 'Quantity', 'Rate Range', 'Total Range']],
      body: materialData,
      theme: 'striped',
      headStyles: { fillColor: [26, 54, 93] },
      styles: { fontSize: 10 }
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Note: Prices are estimates and may vary based on market conditions.", 14, doc.internal.pageSize.getHeight() - 25);
    doc.text("Address: Jainagar, Koderma, Jharkhand - 825109 | Bagodar, Giridih, Jharkhand - 825322", 14, doc.internal.pageSize.getHeight() - 18);
    doc.text("Contact: +91 91109 86889 | email@dhotaconstruction.com | dhotaconstructions@gmail.com", 14, doc.internal.pageSize.getHeight() - 11);

    doc.save(`Dhota_Estimate_${formData.area}sqft.pdf`);
    toast.success("PDF exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="sunrise-gradient text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
            CONSTRUCTION COST ESTIMATOR
          </h1>
          <p className="text-gray-200">Get instant construction cost estimates</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Input Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#D69A55]" />
              Project Details
            </h2>

            <div className="space-y-5">
              {/* Area */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Built-up Area: <span className="text-[#D69A55] font-bold">{formData.area.toLocaleString()} sq.ft</span>
                </label>
                <Slider
                  value={[formData.area]}
                  onValueChange={(v) => setFormData({...formData, area: v[0]})}
                  min={500}
                  max={10000}
                  step={100}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>500 sq.ft</span>
                  <span>10,000 sq.ft</span>
                </div>
              </div>

              {/* Floors */}
              <div>
                <label className="block text-sm font-medium mb-2">Number of Floors</label>
                <Select value={String(formData.floors)} onValueChange={(v) => setFormData({...formData, floors: parseInt(v)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Floor</SelectItem>
                    <SelectItem value="2">2 Floors</SelectItem>
                    <SelectItem value="3">3 Floors</SelectItem>
                    <SelectItem value="4">4 Floors</SelectItem>
                    <SelectItem value="5">5 Floors</SelectItem>
                    <SelectItem value="6">6 Floors</SelectItem>
                    <SelectItem value="7">7 Floors</SelectItem>
                    <SelectItem value="8">8 Floors</SelectItem>
                    <SelectItem value="9">9 Floors</SelectItem>
                    <SelectItem value="10">10 Floors</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">Total Area: {(formData.area * formData.floors).toLocaleString()} sq.ft</p>
              </div>

              {/* Quality */}
              <div>
                <label className="block text-sm font-medium mb-2">Construction Quality</label>
                <Select value={formData.quality} onValueChange={(v) => setFormData({...formData, quality: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(qualityRates).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.label} (₹{data.min} - ₹{data.max}/sqft)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Location Type</label>
                <Select value={formData.locationType} onValueChange={(v) => setFormData({...formData, locationType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(locationTypes).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.label} ({data.multiplier < 1 ? '-' : data.multiplier > 1 ? '+' : ''}{Math.abs((data.multiplier - 1) * 100).toFixed(0)}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium mb-2">Number of Bathrooms</label>
                <Select value={String(formData.bathrooms)} onValueChange={(v) => setFormData({...formData, bathrooms: parseInt(v)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bathroom</SelectItem>
                    <SelectItem value="2">2 Bathrooms</SelectItem>
                    <SelectItem value="3">3 Bathrooms</SelectItem>
                    <SelectItem value="4">4 Bathrooms</SelectItem>
                    <SelectItem value="5">5 Bathrooms</SelectItem>
                    <SelectItem value="6">6 Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Features */}
              <div>
                <label className="block text-sm font-medium mb-3">Optional Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {optionalFeatures.map(feature => (
                    <label key={feature.key} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-orange-50">
                      <Checkbox
                        checked={formData.optionalFeatures.includes(feature.key)}
                        onCheckedChange={() => handleFeatureToggle(feature.key)}
                      />
                      <span className="text-sm">{feature.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {estimate && (
              <>
                {/* Total Cost Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#D69A55] to-[#B87D3B] text-white p-6 rounded-xl shadow-xl"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white/80 text-sm">Estimated Cost Range</p>
                      <div className="text-3xl md:text-4xl font-bold">
                        {formatCurrency(estimate.minCost)} - {formatCurrency(estimate.maxCost)}
                      </div>
                    </div>
                    <Button onClick={exportToPDF} variant="secondary" size="sm" className="bg-white text-[#D69A55]">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      ₹{estimate.minCostPerSqft} - ₹{estimate.maxCostPerSqft}/sqft
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      {estimate.totalArea.toLocaleString()} sq.ft
                    </span>
                  </div>
                </motion.div>

                {/* Material Breakdown */}
                <div className="bg-white p-5 rounded-xl shadow-lg">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#D69A55]" />
                    Material Estimate
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Material</th>
                          <th className="p-2 text-right">Qty</th>
                          <th className="p-2 text-right">Rate Range</th>
                          <th className="p-2 text-right">Total Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estimate.materials.map((m, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 font-medium">{m.name}</td>
                            <td className="p-2 text-right text-gray-600">{m.quantity.toLocaleString()} {m.unit}</td>
                            <td className="p-2 text-right text-gray-600">₹{m.minRate}-₹{m.maxRate}</td>
                            <td className="p-2 text-right font-semibold text-[#D69A55]">
                              {formatCurrency(m.minTotal)} - {formatCurrency(m.maxTotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Optional Features Cost */}
                {estimate.optionalCost > 0 && (
                  <div className="bg-white p-5 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold mb-3">Selected Features</h3>
                    <div className="space-y-2">
                      {formData.optionalFeatures.map(key => {
                        const feature = optionalFeatures.find(f => f.key === key);
                        return (
                          <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                            <span>{feature?.name}</span>
                            <span className="font-semibold text-[#D69A55]">{formatCurrency(feature?.cost || 0)}</span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between p-2 bg-orange-50 rounded border border-orange-200">
                        <span className="font-bold">Total Features</span>
                        <span className="font-bold text-[#D69A55]">{formatCurrency(estimate.optionalCost)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is an estimated range. Actual costs may vary ±10-15% based on materials, labor, and market conditions. Contact us for accurate quotation.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatorPage;
