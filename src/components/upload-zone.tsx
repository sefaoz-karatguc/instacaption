"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Video, X } from "lucide-react";
import Image from "next/image";

interface MediaFile extends File {
	preview?: string;
}

export function UploadZone() {
	const [files, setFiles] = useState<MediaFile[]>([]);
	const [caption, setCaption] = useState("");

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const newFiles = acceptedFiles.map((file) =>
			Object.assign(file, {
				preview: URL.createObjectURL(file),
			})
		);
		setFiles((prev) => [...prev, ...newFiles]);
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
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".gif"],
			"video/*": [".mp4", ".mov"],
		},
	});

	return (
		<div className='w-full max-w-2xl rounded-xl bg-background/60 p-8 backdrop-blur-xl drop-shadow-lg'>
			{files.length === 0 ? (
				<div
					{...getRootProps()}
					className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:bg-muted/25 ${
						isDragActive ? "border-primary bg-muted/25" : ""
					}`}>
					<input {...getInputProps()} />
					<div className='flex flex-col items-center gap-4'>
						<Upload className={`h-12 w-12 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
						<div className='flex max-w-[400px] flex-col gap-1'>
							<p className='text-lg font-medium'>
								{isDragActive ? "Drop your files here" : "Drop your photos and videos here"}
							</p>
							<p className='text-sm text-muted-foreground'>or click to select files</p>
						</div>
					</div>
				</div>
			) : (
				<div className='space-y-6'>
					{/* File Previews */}
					<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
						{files.map((file, index) => (
							<div key={index} className='group relative aspect-square rounded-lg bg-muted overflow-hidden'>
								{file.type.startsWith("image/") ? (
									<Image src={file.preview || ""} alt={file.name} fill className='object-cover' />
								) : file.type.startsWith("video/") ? (
									<video src={file.preview} className='h-full w-full object-cover' />
								) : (
									<div className='flex h-full items-center justify-center'>
										<Video className='h-8 w-8 text-muted-foreground' />
									</div>
								)}
								<button
									onClick={() => removeFile(index)}
									className='absolute right-2 top-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100'>
									<X className='h-4 w-4' />
								</button>
							</div>
						))}
						<div
							{...getRootProps()}
							className='flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:bg-muted/25'>
							<input {...getInputProps()} />
							<Upload className='h-8 w-8 text-muted-foreground' />
						</div>
					</div>

					{/* Caption Input */}
					<div className='space-y-2'>
						<label htmlFor='caption' className='text-sm font-medium'>
							Add a brief description about your post
						</label>
						<textarea
							id='caption'
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							placeholder="What's the context of your post? What message do you want to convey?"
							className='w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
						/>
					</div>

					{/* Generate Button */}
					<button
						className='w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90'
						onClick={() => {
							// Handle caption generation here
							console.log("Generating caption for:", { files, caption });
						}}>
						Generate Caption
					</button>
				</div>
			)}
		</div>
	);
}
