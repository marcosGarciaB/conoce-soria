/*
 * Servicio para buscar imágenes en Google Images sin usar API oficial.
 * Extrae URLs de imágenes parseando el HTML de Google Images.
 */

/**
 * Resultado de búsqueda de imagen.
 */
export interface ImageSearchResult {
	id: string;
	url: string;
	thumbnail: string;
}

/**
 * Busca imágenes en Google Images y retorna las primeras 10 URLs.
 * @param query - Término de búsqueda
 * @param skip - Número de resultados a omitir desde el inicio (por defecto 0)
 * @returns Array de resultados con URLs de imágenes
 */
export const searchGoogleImages = async (
	query: string,
	skip: number = 0
): Promise<ImageSearchResult[]> => {
	try {
		if (!query || !query.trim()) {
			return [];
		}

		const searchQuery = encodeURIComponent(query.trim());
		const url = `https://www.google.com/search?tbm=isch&q=${searchQuery}&ijn=0`;

		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
			},
		});

		if (!response.ok) {
			console.error(
				"[imageSearchService] Error en fetch:",
				response.status
			);
			return [];
		}

		const html = await response.text();

		const imageUrls = extractImageUrls(html);

		const skippedResults = imageUrls.slice(skip);
		const limitedResults = skippedResults.slice(0, 10);

		return limitedResults.map((url, index) => ({
			id: `img-${skip + index}-${Date.now()}`,
			url: url,
			thumbnail: url,
		}));
	} catch (error) {
		console.error("[imageSearchService.searchGoogleImages] Error:", error);
		return [];
	}
};

/**
 * Extrae URLs de imágenes del HTML retornado por Google Images.
 * @param html - HTML de la búsqueda
 * @returns Array de URLs de imágenes
 */
function extractImageUrls(html: string): string[] {
	const urls: string[] = [];
	const seen = new Set<string>();

	const dataSrcPattern = /data-src="([^"]+)"/g;
	let match;
	while ((match = dataSrcPattern.exec(html)) !== null) {
		const url = cleanImageUrl(match[1]);
		if (url && isValidImageUrl(url) && !seen.has(url)) {
			urls.push(url);
			seen.add(url);
		}
	}

	const srcPattern = /<img[^>]+src="([^"]+)"/gi;
	while ((match = srcPattern.exec(html)) !== null) {
		const url = cleanImageUrl(match[1]);
		if (url && isValidImageUrl(url) && !seen.has(url)) {
			urls.push(url);
			seen.add(url);
		}
	}

	const jsonPattern = /"ou":"([^"]+)"/g;
	while ((match = jsonPattern.exec(html)) !== null) {
		const url = decodeURIComponent(match[1]);
		const cleanedUrl = cleanImageUrl(url);
		if (
			cleanedUrl &&
			isValidImageUrl(cleanedUrl) &&
			!seen.has(cleanedUrl)
		) {
			urls.push(cleanedUrl);
			seen.add(cleanedUrl);
		}
	}

	const urlPattern = /https?:\/\/[^\s"<>]+\.(jpg|jpeg|png|gif|webp|bmp)/gi;
	while ((match = urlPattern.exec(html)) !== null) {
		const url = cleanImageUrl(match[0]);
		if (url && isValidImageUrl(url) && !seen.has(url)) {
			urls.push(url);
			seen.add(url);
		}
	}

	return urls;
}

/**
 * Limpia la URL de caracteres extraños o parámetros innecesarios.
 * @param url - URL a limpiar
 * @returns URL limpia o null si no es válida
 */
function cleanImageUrl(url: string): string | null {
	try {
		let cleaned = url
			.replace(/&amp;/g, "&")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">");

		cleaned = cleaned.split("&")[0].split("?")[0];

		if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
			cleaned = cleaned.replace(/=w\d+-h\d+.*$/, "");
			return cleaned;
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Valida que la URL corresponda a una imagen.
 * @param url - URL a validar
 * @returns true si es una URL de imagen válida
 */
function isValidImageUrl(url: string): boolean {
	try {
		new URL(url);
		const imageExtensions = [
			".jpg",
			".jpeg",
			".png",
			".gif",
			".webp",
			".bmp",
			".svg",
		];
		const lowerUrl = url.toLowerCase();

		return (
			imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
			lowerUrl.includes("image") ||
			/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$|#)/i.test(lowerUrl)
		);
	} catch {
		return false;
	}
}

export const imageSearchService = {
	searchGoogleImages,
};
