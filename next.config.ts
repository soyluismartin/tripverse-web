import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
		],
	},
};

export default nextConfig;

/** Solo `next dev`: no ejecutar en `next build` / CI de Pages (evita side effects con Wrangler/Miniflare). */
if (process.env.NODE_ENV === "development") {
	void initOpenNextCloudflareForDev();
}
