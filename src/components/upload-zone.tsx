"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useCaptionGenerator } from "@/hooks/use-caption-generator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trackVisitor,  } from "@/lib/visitor";
import type { Visitor } from "@/types/visitor";

interface MediaFile extends File {
  preview?: string;
}

export function UploadZone() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const { loading, error, generateCaptionForImage, caption } = useCaptionGenerator();
  const [showResult, setShowResult] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  useEffect(() => {
    const initVisitor = async () => {
      try {
        const visitorData = await trackVisitor();
        if (visitorData) {
          setVisitor(visitorData);
        }
      } catch (error) {
        console.error('Error initializing visitor:', error);
      }
    };

    initVisitor();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
    setShowResult(false);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
    setShowResult(false);
  };

  const resetAll = () => {
    // Cleanup file previews
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    // Reset all states
    setFiles([]);
    setCustomPrompt("");
    setShowResult(false);
    setDialogOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
  });

  const handleGenerate = async () => {
    if (files.length > 0) {
      await generateCaptionForImage(files[0], customPrompt || undefined);
      setShowResult(true);
      setDialogOpen(true);
    }
  };

  const handleCopyAndTrack = async () => {
    if (caption) {
      await navigator.clipboard.writeText(caption);
      toast.success("Caption copied to clipboard! 📋", {
        duration: 2000,
      });
      resetAll();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl bg-background/60 p-8 backdrop-blur-xl drop-shadow-lg">
      <div
        {...getRootProps()}
        className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:bg-muted/25 ${
          isDragActive ? "border-primary bg-muted/25" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Upload
            className={`h-12 w-12 ${
              isDragActive ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <div className="flex max-w-[400px] flex-col gap-1">
            <p className="text-lg font-medium">
              {isDragActive ? "Drop your files here" : "Drop your photos here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select files
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file, index) => (
              <div
                key={file.preview}
                className="group relative aspect-square rounded-lg bg-muted overflow-hidden"
              >
                {file.type.startsWith("image/") ? (
                  <Image
                    src={file.preview || ""}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Want to add something?
            </label>
            <textarea
              id="prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Give us an idea about the feeling in this image or what do you want to share with your followers"
              className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={loading || files.length === 0}
            >
              {loading ? "Generating Caption..." : "Generate Caption"}
            </Button>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          {showResult && caption && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  View Generated Caption
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your Generated Caption</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={caption}
                  readOnly
                  className="min-h-[200px]"
                />
                <Button onClick={handleCopyAndTrack}>
                  Copy to Clipboard
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
