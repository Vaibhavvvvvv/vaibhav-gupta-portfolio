"use client";

import React, { useState, useEffect } from "react";
import {
	Github,
	Linkedin,
	Mail,
	Moon,
	Sun,
	ExternalLink,
	Briefcase,
	GraduationCap,
	Home,
	FileText,
	Twitter,
} from "lucide-react";
import Image from "next/image";

// --- Types & Data derived from your Resume ---

type ExperienceItem = {
	company: string;
	role: string;
	period: string;
	description: string;
	logo?: string;
};

type ProjectItem = {
	title: string;
	description: string;
	tags: string[];
	link?: string;
	github?: string;
	image: string;
	status?: "live" | "coming_soon";
};

const PORTFOLIO_DATA = {
	personal: {
		name: "Vaibhav Gupta",
		role: "Software Engineer",
		tagline: "Python Backend Developer & Microservices Specialist",
		location: "Noida, India",
		email: "guptavaibhav2014@gmail.com",
		linkedin: "https://linkedin.com/in/vaibhavgupta",
		github: "https://github.com",
		twitter: "https://twitter.com",
		resume: "/resume.pdf", // Placeholder path
		avatar: "/vaibav.png",
		about:
			"I am a Software Engineer with a strong foundation in Python backend development and database-driven applications. Currently, I engineer scalable solutions at GlobalLogic, contributing to platforms serving 1,700+ enterprise customers. I specialize in debugging complex production environments, optimizing CI/CD pipelines, and building reliable REST APIs that stand the test of scale.",
	},
	experience: [
		{
			company: "GlobalLogic",
			role: "Software Engineer",
			period: "March 2024 - Present",
			description:
				"Contributing to Cloudworks, a massive data integration platform. Investigated and resolved critical production issues in Python services, enhanced unit test coverage, and built Grafana dashboards to monitor system health.",
			logo: "https://ui-avatars.com/api/?name=GL&background=000&color=fff&size=128",
		},
		{
			company: "Intellivate Technology",
			role: "ServiceNow Developer Intern",
			period: "Feb 2023 - May 2023",
			description:
				"Developed ITSM configurations including Business Rules and Client Scripts using JavaScript. Managed Incident and Change Management modules to streamline enterprise workflows.",
			logo: "https://ui-avatars.com/api/?name=IT&background=2563eb&color=fff&size=128",
		},
	] as ExperienceItem[],
	education: [
		{
			school: "Shri Mata Vaishno Devi University",
			degree: "B.Tech in Computer Science",
			period: "2019 - 2023",
			details: "CGPA: 7.96/10",
		},
	],
	skills: [
		"Python",
		"Django",
		"FastAPI",
		"REST APIs",
		"Microservices",
		"MySQL",
		"Redis",
		"Docker",
		"Kubernetes",
		"Jenkins",
		"Git",
		"Grafana",
		"Linux",
		"Postman",
	],
	projects: [
		{
			title: "Feature Flag System",
			description:
				"A runtime feature flag management system allowing dynamic toggling without redeployments. Implemented using Django, Redis for caching, and middleware for logic-free view handling.",
			tags: ["Django", "Redis", "REST API", "System Design"],
			image:
				"https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
			status: "live",
			github: "#",
		},
		{
			title: "Cloud Data Integrator",
			description:
				"A specialized tool for secure data transfers across multiple cloud environments. Features automated retry mechanisms and detailed audit logging.",
			tags: ["Python", "AWS", "ETL", "Security"],
			image:
				"https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
			status: "coming_soon",
		},
		{
			title: "Health Monitor Dashboard",
			description:
				"Real-time system health monitoring dashboard integrating Grafana alerts with custom webhooks for instant incident reporting.",
			tags: ["Grafana", "Webhooks", "React", "Node.js"],
			image:
				"https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
			status: "coming_soon",
		},
		{
			title: "Auto-Scaler Service",
			description:
				"Backend service that monitors queue depth in Redis and auto-scales worker nodes to handle traffic spikes efficiently.",
			tags: ["Docker", "Kubernetes", "Redis", "Python"],
			image:
				"https://images.unsplash.com/photo-1607799275518-d6c43953476e?q=80&w=2070&auto=format&fit=crop",
			status: "coming_soon",
		},
	] as ProjectItem[],
};

// --- Helper Components ---

const Badge = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<span
		className={`inline-flex items-center rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80 ${className}`}
	>
		{children}
	</span>
);

const Button = ({
	children,
	variant = "primary",
	className,
	...props
}: any) => {
	const baseStyles =
		"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 h-10 px-4 py-2";
	const variants = {
		primary:
			"bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
		outline:
			"border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
		ghost:
			"hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
	};
	return (
		<button
			className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

// --- Floating Navbar Component ---

const FloatingDock = ({
	isDarkMode,
	toggleTheme,
}: {
	isDarkMode: boolean;
	toggleTheme: () => void;
}) => {
	return (
		<div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full border border-zinc-200 bg-white/80 p-2 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
			{/* Home */}
			<Button
				variant="ghost"
				className="h-10 w-10 rounded-full p-0 hover:scale-110 transition-transform duration-200"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				<Home
					size={30}
					className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
				/>
			</Button>

			{/* Divider */}
			<div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

			{/* Socials */}
			<a href={PORTFOLIO_DATA.personal.github} target="_blank" rel="noreferrer">
				<Button
					variant="ghost"
					className="h-10 w-10 rounded-full p-0 hover:scale-110 transition-transform duration-200"
				>
					<Github className="h-5 w-5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50" />
				</Button>
			</a>
			<a
				href={PORTFOLIO_DATA.personal.linkedin}
				target="_blank"
				rel="noreferrer"
			>
				<Button
					variant="ghost"
					className="h-10 w-10 rounded-full p-0 hover:scale-110 transition-transform duration-200"
				>
					<Linkedin className="h-5 w-5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50" />
				</Button>
			</a>
			<a
				href={PORTFOLIO_DATA.personal.twitter}
				target="_blank"
				rel="noreferrer"
			>
				<Button
					variant="ghost"
					className="h-10 w-10 rounded-full p-0 hover:scale-110 transition-transform duration-200"
				>
					<Twitter className="h-4 w-4 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50" />
				</Button>
			</a>

			{/* Divider */}
			<div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

			{/* Resume with Tooltip */}
			<div className="relative group">
				<a
					href={PORTFOLIO_DATA.personal.resume}
					target="_blank"
					rel="noreferrer"
				>
					<Button
						variant="ghost"
						className="h-10 w-10 rounded-full p-0 hover:scale-110 transition-transform duration-200 bg-zinc-50 dark:bg-zinc-800/50"
					>
						<FileText className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
					</Button>
				</a>
				{/* Tooltip */}
				<div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
					Resume
					{/* Arrow */}
					<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 dark:bg-zinc-100 rotate-45"></div>
				</div>
			</div>

			{/* Divider */}
			<div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

			{/* Theme Toggle */}
			<Button
				variant="ghost"
				className="h-10 w-10 rounded-full p-0 hover:scale-110 transition-transform duration-200"
				onClick={toggleTheme}
			>
				{isDarkMode ? (
					<Sun className="h-5 w-5 text-orange-400 hover:text-orange-500" />
				) : (
					<Moon className="h-5 w-5 text-zinc-500 hover:text-zinc-900" />
				)}
			</Button>
		</div>
	);
};

// --- Main Page Component ---

export default function Portfolio() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Toggle Theme
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	const toggleTheme = () => setIsDarkMode(!isDarkMode);

	return (
		<div
			className={`min-h-screen font-sans bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300 pb-24`}
		>
			{/* Floating Navbar Replaces Top Toggle */}
			<FloatingDock isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

			<main className="max-w-2xl mx-auto px-6 py-16 sm:py-24 space-y-20">
				{/* --- Hero Section --- */}
				<section className="space-y-6">
					<div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
						<div className="space-y-2">
							<h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
								hi, I'm {PORTFOLIO_DATA.personal.name}
							</h1>
							<p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
								{PORTFOLIO_DATA.personal.role}
							</p>
							<p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-sm">
								{PORTFOLIO_DATA.personal.tagline}
							</p>
						</div>
						<div className="relative shrink-0">
							<Image
								src={PORTFOLIO_DATA.personal.avatar}
								alt="Profile"
								width={100}
								height={100}
								className="rounded-full border-2 border-zinc-100 dark:border-zinc-800 shadow-sm"
							/>
							<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-950"></div>
						</div>
					</div>

					{/* About */}
					<div className="space-y-2">
						<h2 className="text-xl font-semibold tracking-tight">About</h2>
						<p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base">
							{PORTFOLIO_DATA.personal.about}
						</p>
					</div>
				</section>

				{/* --- Work Experience --- */}
				<section className="space-y-6">
					<h2 className="text-xl font-semibold tracking-tight">
						Work Experience
					</h2>
					<div className="space-y-8">
						{PORTFOLIO_DATA.experience.map((job, index) => (
							<div
								key={index}
								className="group relative flex gap-4 transition-all"
							>
								{/* Timeline Line */}
								{index !== PORTFOLIO_DATA.experience.length - 1 && (
									<div className="absolute left-[26px] top-12 bottom-[-20px] w-px bg-zinc-200 dark:bg-zinc-800 group-last:hidden"></div>
								)}

								<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center">
									{job.logo ? (
										<Image
											src={job.logo}
											alt={job.company}
											width={32}
											height={32}
											className="object-contain"
										/>
									) : (
										<Briefcase className="h-5 w-5 text-zinc-500" />
									)}
								</div>

								<div className="flex-1 space-y-1">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
										<h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
											{job.company}
										</h3>
										<span className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">
											{job.period}
										</span>
									</div>
									<p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
										{job.role}
									</p>
									<p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
										{job.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* --- Education --- */}
				<section className="space-y-6">
					<h2 className="text-xl font-semibold tracking-tight">Education</h2>
					<div className="space-y-4">
						{PORTFOLIO_DATA.education.map((edu, index) => (
							<div key={index} className="flex gap-4">
								<div className="h-10 w-10 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
									<GraduationCap className="h-5 w-5 text-zinc-500" />
								</div>
								<div className="flex-1">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
										<h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
											{edu.school}
										</h3>
										<span className="text-xs text-zinc-500 font-mono">
											{edu.period}
										</span>
									</div>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">
										{edu.degree}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* --- Skills --- */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold tracking-tight">Skills</h2>
					<div className="flex flex-wrap gap-2">
						{PORTFOLIO_DATA.skills.map((skill) => (
							<Badge
								key={skill}
								className="px-3 py-1 text-sm font-medium rounded-full cursor-default hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
							>
								{skill}
							</Badge>
						))}
					</div>
				</section>

				{/* --- Proof of Work (Projects) --- */}
				<section className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold tracking-tight">
							Check out my latest work
						</h2>
						<Badge className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
							Proof of Work
						</Badge>
					</div>

					<p className="text-sm text-zinc-500 dark:text-zinc-400 -mt-4">
						I've worked on scalable backend systems and robust APIs.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{PORTFOLIO_DATA.projects.map((project, idx) => (
							<div
								key={idx}
								className="group flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-md"
							>
								{/* Project Image */}
								<div className="h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
									{project.status === "coming_soon" && (
										<div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
											<span className="text-white text-xs font-bold uppercase tracking-wider border border-white px-2 py-1 rounded">
												Coming Soon
											</span>
										</div>
									)}
									<Image
										src={project.image}
										alt={project.title}
										width={500}
										height={300}
										className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${project.status === "coming_soon" ? "blur-sm" : ""}`}
									/>
								</div>

								{/* Project Content */}
								<div className="flex flex-col flex-1 p-4 space-y-3">
									<h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
										{project.title}
									</h3>
									<p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3">
										{project.description}
									</p>

									{/* Tech Stack Tags */}
									<div className="flex flex-wrap gap-1.5 mt-auto">
										{project.tags.map((tag) => (
											<span
												key={tag}
												className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono"
											>
												{tag}
											</span>
										))}
									</div>

									{/* Links */}
									<div className="flex gap-2 pt-2">
										{project.link && (
											<Button
												variant="primary"
												className="h-7 text-xs px-3 w-full gap-2"
											>
												<ExternalLink className="w-3 h-3" /> Website
											</Button>
										)}
										{project.github && (
											<Button
												variant="outline"
												className="h-7 text-xs px-3 w-full gap-2"
											>
												<Github className="w-3 h-3" /> Source
											</Button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* --- Footer / Contact --- */}
				<section className="flex flex-col items-center justify-center space-y-8 pt-12 pb-20">
					<div className="text-center space-y-2">
						<Badge className="mb-4">Contact</Badge>
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Lets get in touch!
						</h2>
						<p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto text-sm">
							Open to opportunities in Backend Engineering and Cloud
							Architecture.
						</p>
					</div>

					<div className="flex gap-4">
						<a
							href={PORTFOLIO_DATA.personal.linkedin}
							target="_blank"
							rel="noreferrer"
						>
							<Button variant="outline" className="rounded-full h-12 w-12 p-0">
								<Linkedin className="h-5 w-5" />
							</Button>
						</a>
						<a href={`mailto:${PORTFOLIO_DATA.personal.email}`}>
							<Button
								variant="primary"
								className="rounded-full h-12 px-6 gap-2"
							>
								<Mail className="h-4 w-4" /> Send Email
							</Button>
						</a>
					</div>

					<div className="pt-10 text-xs text-zinc-400 dark:text-zinc-600 font-mono">
						© 2026 {PORTFOLIO_DATA.personal.name}. Built with Next.js &
						Tailwind.
					</div>
				</section>
			</main>
		</div>
	);
}
