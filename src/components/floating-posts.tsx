"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useDeviceSize } from "@/hooks/use-device-size";

const SAMPLE_POSTS = [
	{
		id: 1,
		image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop",
		username: "sarah.style",
		avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=50&h=50&fit=crop",
		caption: "Living my best life ✨ Embrace every moment with a smile that lights up the room 💫",
		likes: "2,451",
		rotation: "-3deg",
		delay: "0s",
	},
	{
		id: 2,
		image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop",
		username: "alex.adventures",
		avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop",
		caption: "Success is not just about the destination, it's about enjoying the journey 🚀",
		likes: "3,872",
		rotation: "2deg",
		delay: "0.5s",
	},
	{
		id: 3,
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
		username: "emma.fashion",
		avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop",
		caption: "When your outfit matches your confidence level 💁‍♀️ #FashionVibes",
		likes: "5,129",
		rotation: "-5deg",
		delay: "1s",
	},
	{
		id: 4,
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
		username: "david.dreams",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
		caption: "Dreams don't work unless you do 💪 Making every day count",
		likes: "1,988",
		rotation: "4deg",
		delay: "1.5s",
	},
	{
		id: 5,
		image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop",
		username: "lisa.moments",
		avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=50&h=50&fit=crop",
		caption: "Finding beauty in the simple moments ✨ #LifeIsBeautiful",
		likes: "4,210",
		rotation: "-2deg",
		delay: "2s",
	},
	{
		id: 6,
		image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop",
		username: "maya.vibes",
		avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop",
		caption: "Your vibe attracts your tribe 🌟 Grateful for this amazing journey",
		likes: "4,892",
		rotation: "-1deg",
		delay: "4s",
	},
];

// Calculate positions in a hexagonal-like pattern
const getGridPosition = (index: number) => {
	/* DO NOT CHANGE THIS FUNCTION */
	// Define the basic layout parameters
	const marginX = 5; // % from edges
	const marginY = 0; // % from top/bottom

	// Create a hexagonal-like pattern
	let x, y;

	switch (index) {
		case 0: // Top center
			x = 50;
			y = marginY;
			break;
		case 1: // Middle left
			x = marginX - 15;
			y = 50;
			break;
		case 2: // Middle right
			x = 100 - marginX - 15;
			y = 55;
			break;
		case 3: // Bottom center
			x = 45;
			y = 100 - marginY - 40;
			break;
		case 4: // Top left
			x = marginX + 5;
			y = marginY + 3;
			break;
		case 5: // Top right
			x = 100 - marginX - 20;
			y = marginY + 5;
			break;
		default:
			x = 5;
			y = 20;
	}

	// Add subtle random offset
	const maxOffset = 5;
	const randomX = Math.random() * maxOffset - maxOffset / 2;
	const randomY = Math.random() * maxOffset - maxOffset / 2;

	// Ensure positions stay within bounds
	const finalX = Math.max(marginX, Math.min(100 - marginX, x + randomX));
	const finalY = Math.max(marginY, Math.min(100 - marginY, y + randomY));

	return {
		left: finalX + "%",
		top: finalY + "%",
	};
};

const fadeInVariants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
		y: 20,
	},
	visible: (index: number) => ({
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			delay: index * 0.15,
			duration: 0.5,
			ease: "easeOut",
		},
	}),
};

export function FloatingPosts() {
	const [mounted, setMounted] = useState(false);
	const { deviceType } = useDeviceSize();
	useEffect(() => {
		setMounted(true);
	}, []);
	const filteredPosts = useMemo(() => {
		if(deviceType === "mobile"){
			return SAMPLE_POSTS.slice(0, 2);
		}else if(deviceType === "tablet"){
			return SAMPLE_POSTS.slice(0, 4);	
		}else {
			return SAMPLE_POSTS
		}
	}, [deviceType])
	if (!mounted) return null;

	return (
		<div className='fixed inset-0 overflow-hidden'>
			{filteredPosts.map((post, index) => {
				const position = getGridPosition(index);
				return (
					<motion.div
						key={post.id}
						className='absolute group'
						style={{
							left: position.left,
							top: position.top,
							transform: `rotate(${post.rotation})`,
						}}
						initial='hidden'
						animate='visible'
						variants={{
							hidden: fadeInVariants.hidden,
							visible: {
								...fadeInVariants.visible(index),
								y: [0, -10, 0],
								transition: {
									y: {
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									},
									...fadeInVariants.visible(index).transition,
								},
							},
						}}
						custom={index}>
						<div className='relative w-[280px] overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl'>
							{/* Header */}
							<motion.div
								className='flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700'
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.15 + 0.2, duration: 0.3 }}>
								<div className='flex items-center gap-2'>
									<div className='relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-gray-700'>
										<Image src={post.avatar} alt={post.username} fill className='object-cover' sizes='24px' />
									</div>
									<span className='text-xs font-medium text-gray-900 dark:text-gray-100'>{post.username}</span>
								</div>
								<MoreHorizontal className='h-4 w-4 text-gray-600 dark:text-gray-400' />
							</motion.div>

							{/* Image */}
							<motion.div
								className='relative aspect-square bg-gray-100 dark:bg-gray-900'
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}>
								<Image src={post.image} alt='Instagram post' fill sizes='280px' className='object-cover' priority />
							</motion.div>

							{/* Actions */}
							<motion.div
								className='flex items-center gap-2 p-3'
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.15 + 0.4, duration: 0.3 }}>
								<div className='flex items-center gap-2'>
									<button className='rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700'>
										<Heart className='h-5 w-5 text-gray-700 dark:text-gray-300' />
									</button>
									<button className='rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700'>
										<MessageCircle className='h-5 w-5 text-gray-700 dark:text-gray-300' />
									</button>
								</div>
								<div className='ml-auto'>
									<button className='rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700'>
										<Bookmark className='h-5 w-5 text-gray-700 dark:text-gray-300' />
									</button>
								</div>
							</motion.div>

							{/* Likes */}
							<motion.div
								className='px-3'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: index * 0.15 + 0.45, duration: 0.3 }}>
								<p className='text-xs font-semibold text-gray-900 dark:text-gray-100'>{post.likes} likes</p>
							</motion.div>

							{/* Caption */}
							<motion.div
								className='px-3 pb-3'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: index * 0.15 + 0.5, duration: 0.3 }}>
								<p className='text-xs text-gray-900 dark:text-gray-100'>
									<span className='font-medium'>{post.username}</span>{" "}
									<span className='text-gray-700 dark:text-gray-300'>{post.caption}</span>
								</p>
							</motion.div>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
