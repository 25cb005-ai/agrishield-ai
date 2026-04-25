import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateDiagnosisInput {
    quality_status: string;
    image_url: string;
    treatment: string;
    pesticide_recommendation: string;
    fertilizer_recommendation: string;
    notes: string;
    consult_expert: boolean;
    symptoms: Array<string>;
    severity: Severity;
    confidence: bigint;
    crop_name: string;
    disease_name: string;
}
export type Timestamp = bigint;
export interface OrderItem {
    name: string;
    unit: string;
    quantity: bigint;
    price: number;
    pesticide_id: string;
}
export interface Order {
    id: string;
    status: OrderStatus;
    total_amount: number;
    created_at: Timestamp;
    user_id: UserId;
    notes: string;
    delivery_address: string;
    phone: string;
    items: Array<OrderItem>;
}
export type UserId = string;
export interface CropDiagnosis {
    id: string;
    quality_status: string;
    image_url: string;
    treatment: string;
    created_at: Timestamp;
    pesticide_recommendation: string;
    fertilizer_recommendation: string;
    user_id: UserId;
    notes: string;
    consult_expert: boolean;
    symptoms: Array<string>;
    severity: Severity;
    confidence: bigint;
    crop_name: string;
    disease_name: string;
}
export interface Pesticide {
    id: string;
    suitable_for: Array<string>;
    active_ingredient: string;
    image_url: string;
    name: string;
    unit: string;
    description: string;
    stock: bigint;
    category: PesticideCategory;
    is_available: boolean;
    brand: string;
    price: number;
}
export interface CreateOrderInput {
    total_amount: number;
    notes: string;
    delivery_address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface SeedBatch {
    id: string;
    batch_number: string;
    manufacturer: string;
    certified_date: bigint;
    crop_category: CropCategory;
    quality_grade: QualityGrade;
    health_status: HealthStatus;
    germination_rate: bigint;
    seed_type: string;
    purity_percentage: bigint;
}
export enum CropCategory {
    fiber = "fiber",
    fruit = "fruit",
    cereal = "cereal",
    other = "other",
    oilseed = "oilseed",
    spice = "spice",
    pulse = "pulse",
    vegetable = "vegetable"
}
export enum HealthStatus {
    contaminated = "contaminated",
    certified = "certified",
    untreated = "untreated",
    treated = "treated"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum PesticideCategory {
    biopesticide = "biopesticide",
    other = "other",
    herbicide = "herbicide",
    rodenticide = "rodenticide",
    fungicide = "fungicide",
    insecticide = "insecticide"
}
export enum QualityGrade {
    a = "a",
    b = "b",
    c = "c",
    aplus = "aplus",
    rejected = "rejected"
}
export enum Severity {
    low = "low",
    high = "high",
    critical = "critical",
    moderate = "moderate"
}
export interface backendInterface {
    createDiagnosis(data: CreateDiagnosisInput): Promise<CropDiagnosis>;
    createOrder(data: CreateOrderInput): Promise<Order>;
    deleteDiagnosis(id: string): Promise<boolean>;
    getDiagnosis(id: string): Promise<CropDiagnosis | null>;
    getOrder(id: string): Promise<Order | null>;
    getPesticide(id: string): Promise<Pesticide | null>;
    getSeedBatch(batch_number: string): Promise<SeedBatch | null>;
    listDiagnosesByUser(): Promise<Array<CropDiagnosis>>;
    listOrdersByUser(): Promise<Array<Order>>;
    listPesticides(): Promise<Array<Pesticide>>;
}
