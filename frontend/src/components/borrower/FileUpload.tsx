"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  uploadProgress?: number;
  uploadedFile?: { name: string; size: number } | null;
  onRemove?: () => void;
}

export default function FileUpload({
  onFileSelect,
  uploading = false,
  uploadProgress = 0,
  uploadedFile,
  onRemove,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    disabled: uploading || !!uploadedFile,
  });

  if (uploadedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "rgb(var(--color-text))" }}>{uploadedFile.name}</p>
              <p className="text-emerald-600/80 dark:text-emerald-400/70 text-xs font-medium">
                {(uploadedFile.size / 1024).toFixed(1)} KB — Uploaded successfully
              </p>
            </div>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
          isDragActive
            ? "border-primary bg-primary/5"
            : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
          uploading && "opacity-50 cursor-not-allowed"
        )}
        style={!isDragActive ? { borderColor: "var(--glass-border)" } : undefined}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner"
            style={{ background: "rgb(var(--color-bg-secondary))" }}
          >
            <svg className="w-8 h-8" style={{ color: "rgb(var(--color-text-muted))" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-lg" style={{ color: "rgb(var(--color-text))" }}>
              {isDragActive ? "Drop your file here" : "Upload your salary slip"}
            </p>
            <p className="text-sm mt-1" style={{ color: "rgb(var(--color-text-muted))" }}>PDF, JPG, or PNG — Max 5MB</p>
          </div>
          <Button type="button" variant="ghost" className="mt-2" style={{ pointerEvents: "none" }}>
            Select File
          </Button>
        </div>
      </div>

      {uploading && (
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-wider">
            <span style={{ color: "rgb(var(--color-text-muted))" }}>Uploading...</span>
            <span style={{ color: "rgb(var(--color-text))" }}>{uploadProgress}%</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "rgb(var(--color-bg-secondary))" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="bg-gradient-to-r from-primary to-indigo-500 h-2 rounded-full shadow-sm shadow-primary/20"
            />
          </div>
        </div>
      )}

      {fileRejections.length > 0 && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-3 font-medium flex items-center gap-2 justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Invalid file. Please upload a PDF, JPG, or PNG under 5MB.
        </p>
      )}
    </div>
  );
}
