import type { Severity } from "../../backend";

// Local diagnosis type before saving to backend
export interface MockDiagnosis {
  crop_name: string;
  disease_name: string;
  confidence: bigint;
  severity: Severity;
  quality_status: string;
  consult_expert: boolean;
  symptoms: string[];
  treatment: string;
  fertilizer_recommendation: string;
  pesticide_recommendation: string;
  notes: string;
}

// Offline queue item
export interface OfflineDiagnosisItem {
  id: string;
  timestamp: number;
  diagnosis: MockDiagnosis;
  imageUrl: string;
}

const OFFLINE_QUEUE_KEY = "agrishield_offline_queue";

export function getOfflineQueue(): OfflineDiagnosisItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineDiagnosisItem[]) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(item: OfflineDiagnosisItem): void {
  const queue = getOfflineQueue();
  queue.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function removeFromOfflineQueue(id: string): void {
  const queue = getOfflineQueue().filter((i) => i.id !== id);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}
