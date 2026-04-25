import { S as Severity, P as PesticideCategory, C as CropCategory, Q as QualityGrade, O as OrderStatus, H as HealthStatus } from "./backend-DMzQOyye.js";
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}
function formatDate(timestamp) {
  const ms = Number(timestamp) / 1e6;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(ms));
}
function getSeverityLabel(severity) {
  const labels = {
    [Severity.low]: "Low",
    [Severity.moderate]: "Moderate",
    [Severity.high]: "High",
    [Severity.critical]: "Critical"
  };
  return labels[severity] ?? severity;
}
function getSeverityClass(severity) {
  const classes = {
    [Severity.low]: "badge-low",
    [Severity.moderate]: "badge-moderate",
    [Severity.high]: "badge-high",
    [Severity.critical]: "badge-critical"
  };
  return classes[severity] ?? "";
}
function getStatusLabel(status) {
  const labels = {
    [OrderStatus.pending]: "Pending",
    [OrderStatus.confirmed]: "Confirmed",
    [OrderStatus.shipped]: "Shipped",
    [OrderStatus.delivered]: "Delivered",
    [OrderStatus.cancelled]: "Cancelled"
  };
  return labels[status] ?? status;
}
function getQualityGradeLabel(grade) {
  const labels = {
    [QualityGrade.aplus]: "A+",
    [QualityGrade.a]: "A",
    [QualityGrade.b]: "B",
    [QualityGrade.c]: "C",
    [QualityGrade.rejected]: "Rejected"
  };
  return labels[grade] ?? grade;
}
function getHealthStatusLabel(status) {
  const labels = {
    [HealthStatus.certified]: "Certified",
    [HealthStatus.treated]: "Treated",
    [HealthStatus.untreated]: "Untreated",
    [HealthStatus.contaminated]: "Contaminated"
  };
  return labels[status] ?? status;
}
function getCropCategoryLabel(category) {
  const labels = {
    [CropCategory.cereal]: "Cereal",
    [CropCategory.vegetable]: "Vegetable",
    [CropCategory.fruit]: "Fruit",
    [CropCategory.pulse]: "Pulse",
    [CropCategory.oilseed]: "Oilseed",
    [CropCategory.fiber]: "Fiber",
    [CropCategory.spice]: "Spice",
    [CropCategory.other]: "Other"
  };
  return labels[category] ?? category;
}
function getPesticideCategoryLabel(category) {
  const labels = {
    [PesticideCategory.insecticide]: "Insecticide",
    [PesticideCategory.fungicide]: "Fungicide",
    [PesticideCategory.herbicide]: "Herbicide",
    [PesticideCategory.rodenticide]: "Rodenticide",
    [PesticideCategory.biopesticide]: "Biopesticide",
    [PesticideCategory.other]: "Other"
  };
  return labels[category] ?? category;
}
export {
  getSeverityLabel as a,
  formatPrice as b,
  getPesticideCategoryLabel as c,
  getCropCategoryLabel as d,
  getQualityGradeLabel as e,
  formatDate as f,
  getSeverityClass as g,
  getHealthStatusLabel as h,
  getStatusLabel as i
};
