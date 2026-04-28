import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

/**
 * Sin `next/font/google` en el layout: en Cloudflare Workers el pipeline de fuentes
 * remotas puede romper el SSR global (500 en "/" aunque la página sea client-only).
 * La pila system-ui está definida en `globals.css` como `--font-inter`.
 */
export const metadata: Metadata = {
	title: 'Tripverse — Plan your next trip in seconds',
	description:
		'Tripverse turns your travel ideas into a complete, personalized route — with stops, transport, activities, costs, and a full trip guide. All powered by AI. All in one place.',
	openGraph: {
		title:       'Tripverse — Plan your next trip in seconds',
		description: 'AI-powered travel planning. Complete routes, trip guides, and cost estimates — all in one app.',
		type:        'website',
	},
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className="antialiased">
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	)
}
