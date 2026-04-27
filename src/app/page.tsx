// ── Icons ─────────────────────────────────────────────────────────────────────

function IconRoute() {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
			<circle cx="4" cy="14" r="2.25" stroke="#0286fd" strokeWidth="1.5" />
			<circle cx="16" cy="6" r="2.25" stroke="#0286fd" strokeWidth="1.5" />
			<path
				d="M4 11.5C4 8.5 8 8 10 8s6-0.5 6-2"
				stroke="#0286fd"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function IconGuide() {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
			<rect x="3" y="2" width="10" height="16" rx="2" stroke="#0286fd" strokeWidth="1.5" />
			<path d="M6.5 7h4M6.5 10h4M6.5 13h2.5" stroke="#0286fd" strokeWidth="1.5" strokeLinecap="round" />
			<path d="M13 5.5h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7" stroke="#0286fd" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

function IconWallet() {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
			<rect x="2" y="5" width="16" height="12" rx="2.5" stroke="#0286fd" strokeWidth="1.5" />
			<path d="M2 8.5h16" stroke="#0286fd" strokeWidth="1.5" />
			<circle cx="14.5" cy="13" r="1.5" fill="#0286fd" />
		</svg>
	);
}

function IconCompass() {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
			<circle cx="10" cy="10" r="8" stroke="#0286fd" strokeWidth="1.5" />
			<path
				d="M13 7 10.5 10.5 7 13l2.5-3.5L13 7Z"
				stroke="#0286fd"
				strokeWidth="1.5"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function IconPerson() {
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
			<circle cx="10" cy="6.5" r="3" stroke="#0286fd" strokeWidth="1.5" />
			<path d="M3.5 17c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="#0286fd" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

function IconApple() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
			<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
		</svg>
	);
}

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
	{
		icon: <IconRoute />,
		title: "A complete route, not just a list of places",
		body: "Tell us where you want to go, how long you have, and what kind of traveler you are. Tripverse builds a day-by-day route with real transport connections, layovers, and timing — so you can actually follow it.",
	},
	{
		icon: <IconGuide />,
		title: "Your full trip guide, generated instantly",
		body: "Every destination comes with city highlights, top activities, local tips, and a cost breakdown. Not generic content — a guide built specifically for your trip.",
	},
	{
		icon: <IconWallet />,
		title: "Know exactly what you'll spend",
		body: "Tripverse estimates your total transport cost before you book anything. See the full picture — by segment, by city, by trip — so you travel with no surprises.",
	},
	{
		icon: <IconCompass />,
		title: "Discover trips from real travelers",
		body: "Browse routes created by other Tripverse users. Filter by style, destination, or budget. Like the ones that inspire you. Share yours when you're ready.",
	},
	{
		icon: <IconPerson />,
		title: "Built around how you travel",
		body: "Solo or with family. Budget or luxury. Fast-paced or relaxed. Tripverse learns your travel style during onboarding and uses it every time you plan.",
	},
];

const steps = [
	{
		title: "Tell us your trip",
		body: "Choose your destinations, travel dates, budget, and who you're traveling with. It takes less than a minute.",
	},
	{
		title: "Get your route",
		body: "Tripverse generates a complete multi-destination route with transport options, stop durations, and a cost estimate — tailored to your preferences.",
	},
	{
		title: "Travel with your guide",
		body: "Open your Trip Guide for any destination — city highlights, activities, transport details, and tips. Everything you need, in your pocket.",
	},
];

const stats = [
	{ value: "10K+", label: "trips planned" },
	{ value: "80+", label: "countries covered" },
	{ value: "4.9★", label: "average rating" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
	return (
		<div
			className="min-h-screen"
			style={{ backgroundColor: "#F2F2F7", color: "#0A0A0A" }}
		>
			{/* ── Navbar */}
			<header
				className="sticky top-0 z-50 border-b"
				style={{
					backgroundColor: "rgba(242,242,247,0.85)",
					borderColor: "#E5E5EA",
					backdropFilter: "blur(14px)",
					WebkitBackdropFilter: "blur(14px)",
				}}
			>
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<span className="text-xl font-bold tracking-tight">Tripverse</span>
					<a
						href="#download"
						className="text-sm font-semibold px-5 py-2.5 rounded-full transition-opacity duration-150 hover:opacity-80"
						style={{ backgroundColor: "#0A0A0A", color: "#fff" }}
					>
						Download free
					</a>
				</div>
			</header>

			{/* ── Hero */}
			<section className="max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center gap-7">
				<span
					className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase"
					style={{
						color: "#0286fd",
						backgroundColor: "rgba(2,134,253,0.08)",
						border: "1px solid rgba(2,134,253,0.22)",
					}}
				>
					Available on iOS
				</span>

				<h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.07] max-w-3xl">
					Your next trip,
					<br />
					planned in seconds.
				</h1>

				<p
					className="text-lg sm:text-xl max-w-xl leading-relaxed"
					style={{ color: "#8E8E93" }}
				>
					Tripverse turns your travel ideas into a complete, personalized route —
					with stops, transport, activities, costs, and a full guide. All powered
					by AI. All in one place.
				</p>

				<a
					href="#download"
					className="px-8 py-4 rounded-2xl text-base font-semibold transition-opacity duration-150 hover:opacity-80"
					style={{ backgroundColor: "#0A0A0A", color: "#fff" }}
				>
					Start planning free
				</a>

				<p className="text-sm" style={{ color: "#8E8E93" }}>
					No spreadsheets. No open tabs. Just your trip, ready to go.
				</p>

				{/* Phone mockup */}
				<div className="relative mt-12">
					<div
						className="w-[260px] h-[520px] rounded-[44px] overflow-hidden flex flex-col relative"
						style={{
							backgroundColor: "#FFFFFF",
							border: "1.5px solid #E5E5EA",
							boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
						}}
					>
						{/* Dynamic Island */}
						<div className="flex-shrink-0 h-9 flex justify-center items-end pb-1">
							<div
								className="w-24 h-5 rounded-full"
								style={{ backgroundColor: "#0A0A0A" }}
							/>
						</div>

						<div className="flex-1 px-5 py-4 flex flex-col gap-3 overflow-hidden">
							{/* Header text skeletons */}
							<div className="flex flex-col gap-1.5">
								<div
									className="h-3 rounded-full w-2/3"
									style={{ backgroundColor: "rgba(0,0,0,0.10)" }}
								/>
								<div
									className="h-2.5 rounded-full w-2/5"
									style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
								/>
							</div>

							{/* Destination tags */}
							<div className="flex gap-1.5">
								{["Tokyo", "Kyoto", "Osaka"].map((city) => (
									<span
										key={city}
										className="text-[9px] font-bold px-2 py-0.5 rounded-full"
										style={{
											backgroundColor: "rgba(2,134,253,0.1)",
											color: "#0286fd",
											border: "1px solid rgba(2,134,253,0.2)",
										}}
									>
										{city}
									</span>
								))}
							</div>

							{/* Day cards */}
							{[
								{ day: "DAY 1 · TOKYO", lines: [1, 0.85, 0.6] },
								{ day: "DAY 2 · KYOTO", lines: [0.9, 0.65] },
							].map((card) => (
								<div
									key={card.day}
									className="rounded-[14px] p-3.5 flex flex-col gap-2"
									style={{
										backgroundColor: "#F2F2F7",
										border: "1px solid #E5E5EA",
									}}
								>
									<div
										className="text-[9px] font-bold tracking-wider"
										style={{ color: "#0286fd" }}
									>
										{card.day}
									</div>
									{card.lines.map((w, i) => (
										<div
											key={i}
											className="h-2 rounded-full"
											style={{
												width: `${w * 100}%`,
												backgroundColor: "rgba(0,0,0,0.08)",
											}}
										/>
									))}
								</div>
							))}

							{/* Cost card */}
							<div
								className="rounded-[14px] p-3.5 flex items-center justify-between"
								style={{
									backgroundColor: "#F2F2F7",
									border: "1px solid #E5E5EA",
								}}
							>
								<div>
									<div className="text-[9px]" style={{ color: "#8E8E93" }}>
										Est. total cost
									</div>
									<div className="text-base font-bold mt-0.5">$1,840</div>
								</div>
								<div
									className="px-3 py-1.5 rounded-xl text-[9px] font-bold"
									style={{ backgroundColor: "#0286fd", color: "#fff" }}
								>
									View plan
								</div>
							</div>
						</div>
					</div>

					{/* Subtle drop shadow glow */}
					<div
						className="absolute inset-x-8 bottom-0 h-12 -z-10 blur-[20px]"
						style={{ backgroundColor: "rgba(0,0,0,0.12)" }}
					/>
				</div>
			</section>

			{/* ── Features */}
			<section
				className="max-w-6xl mx-auto px-6 py-24 border-t"
				style={{ borderColor: "#E5E5EA" }}
			>
				<div className="mb-14">
					<span
						className="text-xs font-bold tracking-[0.2em] uppercase"
						style={{ color: "#0286fd" }}
					>
						What Tripverse does
					</span>
					<h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight max-w-lg leading-tight">
						Everything your trip needs.
						<br />
						Nothing it doesn&apos;t.
					</h2>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{features.map((f, i) => (
						<div
							key={i}
							className="rounded-[14px] p-6 flex flex-col gap-4"
							style={{
								backgroundColor: "#FFFFFF",
								border: "1px solid #E5E5EA",
								boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
							}}
						>
							<div
								className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
								style={{ backgroundColor: "rgba(2,134,253,0.08)" }}
							>
								{f.icon}
							</div>
							<h3 className="text-base font-bold leading-snug">{f.title}</h3>
							<p className="text-sm leading-relaxed" style={{ color: "#8E8E93" }}>
								{f.body}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ── How It Works */}
			<section
				className="max-w-6xl mx-auto px-6 py-24 border-t"
				style={{ borderColor: "#E5E5EA" }}
			>
				<div className="mb-14">
					<span
						className="text-xs font-bold tracking-[0.2em] uppercase"
						style={{ color: "#0286fd" }}
					>
						Three steps to your trip
					</span>
					<h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
						Plan your whole trip
						<br />
						in under a minute.
					</h2>
				</div>

				<div className="grid sm:grid-cols-3 gap-10 lg:gap-16">
					{steps.map((s, i) => (
						<div key={i} className="flex flex-col gap-4">
							<div
								className="text-6xl font-bold tabular-nums leading-none"
								style={{ color: "rgba(2,134,253,0.25)" }}
							>
								0{i + 1}
							</div>
							<h3 className="text-xl font-bold">{s.title}</h3>
							<p className="text-sm leading-relaxed" style={{ color: "#8E8E93" }}>
								{s.body}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ── Stats */}
			<section
				className="py-24 border-t border-b"
				style={{
					borderColor: "#E5E5EA",
					backgroundColor: "#E9E9EF",
				}}
			>
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-center text-4xl sm:text-5xl font-bold tracking-tight mb-16 max-w-xl mx-auto leading-tight">
						Thousands of routes planned.
						<br />
						Millions of miles covered.
					</h2>

					<div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
						{stats.map((s, i) => (
							<div key={i} className="flex flex-col gap-2">
								<div
									className="text-4xl sm:text-5xl font-bold"
									style={{ color: "#0286fd" }}
								>
									{s.value}
								</div>
								<div className="text-sm" style={{ color: "#8E8E93" }}>
									{s.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Discover */}
			<section
				className="max-w-6xl mx-auto px-6 py-24 border-b"
				style={{ borderColor: "#E5E5EA" }}
			>
				<div className="max-w-2xl">
					<span
						className="text-xs font-bold tracking-[0.2em] uppercase"
						style={{ color: "#0286fd" }}
					>
						Community
					</span>
					<h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
						Travel is better
						<br />
						when shared.
					</h2>
					<p
						className="mt-6 text-lg leading-relaxed max-w-lg"
						style={{ color: "#8E8E93" }}
					>
						Every trip you create on Tripverse can be shared with the community.
						Discover routes to places you hadn&apos;t considered. Find travelers
						with your same style. Get inspired before you even open a map.
					</p>
				</div>
			</section>

			{/* ── Final CTA */}
			<section
				id="download"
				className="max-w-6xl mx-auto px-6 py-32 flex flex-col items-center text-center gap-6"
			>
				<h2 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight max-w-lg">
					Your next adventure
					<br />
					is one tap away.
				</h2>

				<p
					className="text-lg max-w-md leading-relaxed"
					style={{ color: "#8E8E93" }}
				>
					Download Tripverse and plan your first route in under 60 seconds. Free
					to start. No credit card required.
				</p>

				<div className="mt-4 flex flex-col items-center gap-4">
					<a
						href="#"
						className="flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold transition-opacity duration-150 hover:opacity-85"
						style={{ backgroundColor: "#0286fd", color: "#fff" }}
					>
						<IconApple />
						Download on the App Store
					</a>
					<p className="text-sm" style={{ color: "#8E8E93" }}>
						Available on iOS. Designed for people who actually travel.
					</p>
				</div>
			</section>

			{/* ── Footer */}
			<footer
				className="border-t py-10"
				style={{ borderColor: "#E5E5EA", backgroundColor: "#E9E9EF" }}
			>
				<div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<span className="text-base font-bold tracking-tight">Tripverse</span>
					<span className="text-sm" style={{ color: "#8E8E93" }}>
						© 2025 Tripverse. All rights reserved.
					</span>
				</div>
			</footer>
		</div>
	);
}
