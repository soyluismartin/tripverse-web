/** DIAGNÓSTICO SSR (rama fix/minimal-ssr-diagnostic): layout mínimo sin CSS ni fuentes. */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
