import {
  CropCategory,
  type CropDiagnosis,
  HealthStatus,
  type Order,
  OrderStatus,
  type Pesticide,
  PesticideCategory,
  QualityGrade,
  type SeedBatch,
  Severity,
} from "../backend";

// Re-export backend types for use across the app
export type { CropDiagnosis, Order, Pesticide, SeedBatch };
export {
  CropCategory,
  HealthStatus,
  OrderStatus,
  PesticideCategory,
  QualityGrade,
  Severity,
};

// Cart type
export interface CartItem {
  pesticide: Pesticide;
  quantity: number;
}

// Language type
export type Language = "en" | "hi" | "ta" | "te";

// Helper: format INR price
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

// Helper: format bigint nanosecond timestamp to readable date
export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(ms));
}

// Helper: severity display label + class
export function getSeverityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    [Severity.low]: "Low",
    [Severity.moderate]: "Moderate",
    [Severity.high]: "High",
    [Severity.critical]: "Critical",
  };
  return labels[severity] ?? severity;
}

export function getSeverityClass(severity: Severity): string {
  const classes: Record<Severity, string> = {
    [Severity.low]: "badge-low",
    [Severity.moderate]: "badge-moderate",
    [Severity.high]: "badge-high",
    [Severity.critical]: "badge-critical",
  };
  return classes[severity] ?? "";
}

// Helper: order status label + class
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.pending]: "Pending",
    [OrderStatus.confirmed]: "Confirmed",
    [OrderStatus.shipped]: "Shipped",
    [OrderStatus.delivered]: "Delivered",
    [OrderStatus.cancelled]: "Cancelled",
  };
  return labels[status] ?? status;
}

export function getStatusClass(status: OrderStatus): string {
  const classes: Record<OrderStatus, string> = {
    [OrderStatus.pending]: "status-pending",
    [OrderStatus.confirmed]: "status-confirmed",
    [OrderStatus.shipped]: "status-shipped",
    [OrderStatus.delivered]: "status-delivered",
    [OrderStatus.cancelled]: "status-cancelled",
  };
  return classes[status] ?? "";
}

// Helper: quality grade label
export function getQualityGradeLabel(grade: QualityGrade): string {
  const labels: Record<QualityGrade, string> = {
    [QualityGrade.aplus]: "A+",
    [QualityGrade.a]: "A",
    [QualityGrade.b]: "B",
    [QualityGrade.c]: "C",
    [QualityGrade.rejected]: "Rejected",
  };
  return labels[grade] ?? grade;
}

// Helper: health status label
export function getHealthStatusLabel(status: HealthStatus): string {
  const labels: Record<HealthStatus, string> = {
    [HealthStatus.certified]: "Certified",
    [HealthStatus.treated]: "Treated",
    [HealthStatus.untreated]: "Untreated",
    [HealthStatus.contaminated]: "Contaminated",
  };
  return labels[status] ?? status;
}

// Helper: crop category label
export function getCropCategoryLabel(category: CropCategory): string {
  const labels: Record<CropCategory, string> = {
    [CropCategory.cereal]: "Cereal",
    [CropCategory.vegetable]: "Vegetable",
    [CropCategory.fruit]: "Fruit",
    [CropCategory.pulse]: "Pulse",
    [CropCategory.oilseed]: "Oilseed",
    [CropCategory.fiber]: "Fiber",
    [CropCategory.spice]: "Spice",
    [CropCategory.other]: "Other",
  };
  return labels[category] ?? category;
}

// Helper: pesticide category label
export function getPesticideCategoryLabel(category: PesticideCategory): string {
  const labels: Record<PesticideCategory, string> = {
    [PesticideCategory.insecticide]: "Insecticide",
    [PesticideCategory.fungicide]: "Fungicide",
    [PesticideCategory.herbicide]: "Herbicide",
    [PesticideCategory.rodenticide]: "Rodenticide",
    [PesticideCategory.biopesticide]: "Biopesticide",
    [PesticideCategory.other]: "Other",
  };
  return labels[category] ?? category;
}
