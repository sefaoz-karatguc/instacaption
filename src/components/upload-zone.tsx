"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Video } from "lucide-react";

export function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "video/*": [".mp4", ".mov"],
    },
  });

  return (
    <div className="w-full max-w-2xl rounded-xl bg-background/60 p-8 backdrop-blur-xl drop-shadow-lg">
      <div
        {...getRootProps()}
        className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:bg-muted/25 ${
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
              {isDragActive
                ? "Drop your files here"
                : "Drop your photos and videos here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select files
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-medium">Selected files:</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative flex aspect-square items-center justify-center rounded-lg bg-muted p-2"
              >
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Video className="h-8 w-8 text-muted-foreground" />
                )}
                <p className="absolute bottom-1 left-1 right-1 truncate text-xs text-muted-foreground">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
