import { UploadZone } from "@/components/upload-zone";
import { FloatingPosts } from "@/components/floating-posts";
import { Navbar } from "@/components/navbar";

export default function Home() {
	return (
		<main className='relative min-h-screen flex flex-col items-center justify-center p-3 gap-y-3 dark:bg-gray-950'>
			{/* Background blur and gradient */}
			<div className='fixed inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-orange-300 dark:from-pink-900 dark:via-purple-900 dark:to-orange-900' />

			{/* Navigation */}
			<Navbar />

			{/* Title */}
			<div className='relative z-10 text-center space-y-4 bg-background/60 p-8 backdrop-blur-xl rounded-xl drop-shadow-lg'>
				<h1 className='text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent dark:from-pink-400 dark:via-purple-400 dark:to-orange-400'>
					InstaCaption
				</h1>

				<p className='text-lg text-gray-600 dark:text-gray-400'>Generate engaging captions for your Instagram posts</p>
			</div>

			{/* Floating posts in background */}
			<FloatingPosts />

			{/* Upload zone in foreground */}
			<div className='relative z-10 flex items-center justify-center w-full'>
				<UploadZone />
			</div>
		</main>
	);
}
