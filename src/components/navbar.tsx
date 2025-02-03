"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Logo } from "./logo";

export function Navbar() {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user has a theme preference in localStorage
		const theme = localStorage.getItem("theme");
		const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

		if (theme === "dark" || (!theme && systemPrefersDark)) {
			setIsDarkMode(true);
			document.documentElement.classList.add("dark");
		}

		// Check and set initial auth state
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !isDarkMode;
		setIsDarkMode(newDarkMode);
		if (newDarkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	const handleSignIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`
				}
			});
			if (error) throw error;
		} catch (error) {
			console.error('Error signing in:', error);
		}
	};

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
			<div className="flex items-center gap-2">
				<Link href="/">
					<Logo />
				</Link>
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleDarkMode}
					className="rounded-full"
					title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
				>
					{isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
				</Button>
			</div>

			<div className="flex items-center gap-2">
				{!loading && (
					user ? (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSignOut}
							className="gap-2"
						>
							<LogOut className="h-4 w-4" />
							Sign Out
						</Button>
					) : (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSignIn}
							className="gap-2"
						>
							<LogIn className="h-4 w-4" />
							Sign In with Google
						</Button>
					)
				)}
			</div>
		</nav>
	);
}
