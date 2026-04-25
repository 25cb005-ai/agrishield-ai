import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface ImageUploaderProps {
  onUploadComplete: (imageUrl: string, fileName: string) => void;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
}

export function ImageUploader({
  onUploadComplete,
  isUploading,
  setIsUploading,
}: ImageUploaderProps) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      setIsUploading(true);
      setProgress(0);

      try {
        const bytes = new Uint8Array(await file.arrayBuffer());

        for (let p = 10; p <= 80; p += 10) {
          await new Promise<void>((r) => setTimeout(r, 80));
          setProgress(p);
        }

        const blob = new Blob([bytes], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);

        setProgress(100);
        await new Promise<void>((r) => setTimeout(r, 300));

        onUploadComplete(blobUrl, file.name);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete, setIsUploading],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const clearImage = () => {
    setPreview(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const dropZoneClass = [
    "relative rounded-2xl border-2 border-dashed transition-smooth overflow-hidden",
    "flex flex-col items-center justify-center min-h-[220px]",
    dragOver
      ? "border-primary bg-primary/5 scale-[1.01]"
      : "border-border hover:border-primary/60 hover:bg-primary/5",
  ].join(" ");

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        data-ocid="image-uploader.dropzone"
        className={dropZoneClass}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Crop preview"
              className="w-full h-full object-cover max-h-[320px]"
            />
            {!isUploading && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-destructive transition-smooth"
                aria-label="Remove image"
                data-ocid="image-uploader.remove_button"
              >
                <X size={14} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Camera size={30} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {t("detect.uploadPrompt")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG, WebP · up to 20 MB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 gap-2"
              onClick={() => inputRef.current?.click()}
              data-ocid="image-uploader.upload_button"
            >
              <Upload size={14} />
              Select File
            </Button>
          </div>
        )}
      </div>

      {isUploading && (
        <div
          className="space-y-1"
          data-ocid="image-uploader.upload.loading_state"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("detect.analyzing")}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
        data-ocid="image-uploader.file_input"
      />
    </div>
  );
}
