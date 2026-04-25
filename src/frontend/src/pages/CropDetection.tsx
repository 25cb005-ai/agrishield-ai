import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Severity, createActor } from "../backend";
import { DiagnosisResult } from "../components/detect/DiagnosisResult";
import { ImageUploader } from "../components/detect/ImageUploader";
import { OfflineCaptureQueue } from "../components/detect/OfflineCaptureQueue";
import {
  type MockDiagnosis,
  type OfflineDiagnosisItem,
  addToOfflineQueue,
} from "../components/detect/types";
import { useLanguage } from "../context/LanguageContext";
import { useOfflineSync } from "../hooks/useOfflineSync";

// ── Mock AI diagnosis generator ────────────────────────────────────────────

const DISEASES = [
  {
    name: "Leaf Blight",
    symptoms: [
      "Brown lesions with yellow halos on leaves",
      "Water-soaked spots that expand rapidly",
      "Premature leaf drop in severe cases",
      "Dark brown streaks along leaf margins",
    ],
    treatment:
      "Apply copper-based fungicide immediately. Remove and destroy infected leaves. Avoid overhead irrigation. Ensure proper crop spacing for air circulation.",
    fertilizer:
      "Apply balanced NPK 19:19:19 @ 5g/L water. Avoid excess nitrogen.",
    pesticide: "Mancozeb 75 WP @ 2.5g/L or Copper Oxychloride 50 WP @ 3g/L",
  },
  {
    name: "Powdery Mildew",
    symptoms: [
      "White powdery coating on leaf surfaces",
      "Distortion and yellowing of young leaves",
      "Stunted plant growth",
      "Premature leaf senescence",
      "Reduced fruit and seed quality",
    ],
    treatment:
      "Spray sulfur-based fungicide at first signs. Improve air circulation. Apply neem oil as organic alternative. Repeat treatment every 7-10 days.",
    fertilizer:
      "Reduce nitrogen; use potassium-rich fertilizer to strengthen cell walls.",
    pesticide: "Hexaconazole 5 SC @ 2ml/L or Propiconazole 25 EC @ 1ml/L",
  },
  {
    name: "Root Rot",
    symptoms: [
      "Wilting despite adequate soil moisture",
      "Yellowing of lower leaves progressing upward",
      "Brown, mushy roots when inspected",
      "Stunted growth and reduced yield",
      "Plant collapse at soil level",
    ],
    treatment:
      "Improve soil drainage immediately. Remove affected plants. Drench soil with Trichoderma-based biocontrol agent. Avoid waterlogging. Treat seeds before next planting.",
    fertilizer:
      "Drench with phosphorus-rich fertilizer (DAP) to stimulate root recovery.",
    pesticide: "Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/L soil drench",
  },
  {
    name: "Bacterial Wilt",
    symptoms: [
      "Sudden wilting of plants during midday",
      "Recovery at night initially, then permanent wilt",
      "Milky bacterial ooze from cut stems",
      "Brown discoloration of vascular tissue",
    ],
    treatment:
      "No chemical cure once infected. Remove and destroy diseased plants. Solarize soil. Use resistant varieties in next season. Control soilborne insects.",
    fertilizer:
      "Apply calcium and boron to improve cell wall strength in remaining plants.",
    pesticide: "Streptomycin Sulfate 90 SP @ 0.5g/L as preventive spray",
  },
  {
    name: "Mosaic Virus",
    symptoms: [
      "Mottled yellow-green mosaic pattern on leaves",
      "Leaf curling and distortion",
      "Reduced leaf size and plant stunting",
      "Fruit malformation and reduced size",
      "Dark green blistering along leaf veins",
    ],
    treatment:
      "No direct cure for viral infections. Remove infected plants immediately. Control aphid vectors with insecticide. Use virus-free certified seeds next season.",
    fertilizer:
      "Foliar spray of micronutrients (Zinc + Boron) to support plant immunity.",
    pesticide: "Imidacloprid 17.8 SL @ 0.5ml/L to control aphid vectors",
  },
];

const SEVERITIES: Severity[] = [
  Severity.low,
  Severity.moderate,
  Severity.high,
  Severity.critical,
];
const QUALITY_STATUSES = ["Good", "Fair", "Poor", "Needs Attention"];

function generateCropName(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
  const cleaned = base.trim();
  const knownCrops = [
    "rice",
    "wheat",
    "maize",
    "tomato",
    "potato",
    "cotton",
    "sugarcane",
    "chilli",
    "onion",
    "groundnut",
  ];
  const lower = cleaned.toLowerCase();
  for (const crop of knownCrops) {
    if (lower.includes(crop))
      return crop.charAt(0).toUpperCase() + crop.slice(1);
  }
  const fallbacks = ["Tomato", "Rice", "Wheat", "Maize", "Cotton", "Potato"];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function generateMockDiagnosis(fileName: string): MockDiagnosis {
  const disease = DISEASES[Math.floor(Math.random() * DISEASES.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const confidence = BigInt(65 + Math.floor(Math.random() * 31)); // 65–95
  const qualityStatus =
    QUALITY_STATUSES[Math.floor(Math.random() * QUALITY_STATUSES.length)];
  const symptomCount = 3 + Math.floor(Math.random() * 3); // 3–5

  return {
    crop_name: generateCropName(fileName),
    disease_name: disease.name,
    confidence,
    severity,
    quality_status: qualityStatus,
    consult_expert:
      severity === Severity.high || severity === Severity.critical,
    symptoms: disease.symptoms.slice(0, symptomCount),
    treatment: disease.treatment,
    fertilizer_recommendation: disease.fertilizer,
    pesticide_recommendation: disease.pesticide,
    notes: `AI-generated diagnosis. Confidence: ${Number(confidence)}%. Always verify with local agricultural expert.`,
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CropDetection() {
  const { t } = useLanguage();
  const { actor } = useActor(createActor);
  const { isOnline } = useOfflineSync();

  const [state, setState] = useState<"upload" | "result">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [diagnosis, setDiagnosis] = useState<MockDiagnosis | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: saveDiagnosis, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!diagnosis) return;
      if (!actor || !isOnline) {
        // Queue offline
        const item: OfflineDiagnosisItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
          diagnosis,
          imageUrl,
        };
        addToOfflineQueue(item);
        toast.success("Saved offline — will sync when connected.");
        setIsSaved(true);
        return;
      }
      await actor.createDiagnosis({
        ...diagnosis,
        image_url: imageUrl,
      });
      toast.success("Diagnosis saved successfully!");
      setIsSaved(true);
    },
    onError: () => {
      toast.error("Failed to save. Please try again.");
    },
  });

  const handleUploadComplete = (url: string, name: string) => {
    setImageUrl(url);
    const result = generateMockDiagnosis(name);
    setDiagnosis(result);
    setState("result");
    setIsSaved(false);
  };

  const handleReset = () => {
    setState("upload");
    setImageUrl("");
    setDiagnosis(null);
    setIsSaved(false);
  };

  const handleDownload = () => {
    if (!diagnosis) return;
    const lines = [
      "AgriShield AI — Crop Diagnosis Report",
      "======================================",
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      "",
      `Crop: ${diagnosis.crop_name}`,
      `Disease: ${diagnosis.disease_name}`,
      `Confidence: ${Number(diagnosis.confidence)}%`,
      `Severity: ${diagnosis.severity}`,
      `Quality Status: ${diagnosis.quality_status}`,
      "",
      "Symptoms:",
      ...diagnosis.symptoms.map((s) => `  • ${s}`),
      "",
      "Treatment:",
      `  ${diagnosis.treatment}`,
      "",
      "Fertilizer Recommendation:",
      `  ${diagnosis.fertilizer_recommendation}`,
      "",
      "Pesticide Recommendation:",
      `  ${diagnosis.pesticide_recommendation}`,
      "",
      "Notes:",
      `  ${diagnosis.notes}`,
      "",
      "⚠️  This is an AI-generated report. Verify with a certified agronomist.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `diagnosis-${diagnosis.crop_name.toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div
      className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto"
      data-ocid="crop-detection.page"
    >
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("detect.title")}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("detect.subtitle")}
        </p>
      </div>

      {/* Offline queue banner */}
      <OfflineCaptureQueue />

      {/* Main content */}
      {state === "upload" ? (
        <ImageUploader
          onUploadComplete={handleUploadComplete}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
      ) : diagnosis ? (
        <DiagnosisResult
          diagnosis={diagnosis}
          imageUrl={imageUrl}
          isSaving={isSaving}
          isSaved={isSaved}
          onSave={() => saveDiagnosis()}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : null}
    </div>
  );
}
