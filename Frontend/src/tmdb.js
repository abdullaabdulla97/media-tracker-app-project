// Provides functions to call The Movie Database (TMDB) API

// API key is read from environment variables (must start with REACT_APP_ for create-react-app)
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Base URL for TMDB API requests
const URL = "https://api.themoviedb.org/3";

// Base URL for TMDB images (w500 means width = 500px)
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

/**
 * Helper function to call TMDB API endpoints
 * @param {string} apiPath - The endpoint path (e.g., "/trending/movie/week")
 * @param {object} queryParameters - Extra query parameters (like page, query text, etc.)
 */
async function tmdbFetch(apiPath, queryParameters = {}) {
    // Start building the query string by including the API key
    let query = "?api_key=" + API_KEY;

    // Loops through all provided query parameters and adds them to the query string
    for (const key in queryParameters) {
        // Only adds the property if it belongs directly to the object (not inherited)
        if (queryParameters.hasOwnProperty(key)) {
            // Append key=value to the query string, ensuring both are URL-encoded
            query += `&${encodeURIComponent(key)}=${encodeURIComponent(queryParameters[key])}`;
        }
    }
    
    // Combine base URL, API path, and query string into the final URL
    const url = URL + apiPath + query;

    // Call the TMDB API using fetch
    const response = await fetch(url);

    // If the response status is not OK (e.g., 401 unauthorized), throw an error
    if (!response.ok) {
        throw new Error(response.status); // Pass along the HTTP status code
    }

    // If successful, parse the response as JSON and return it
    return response.json();
}


/**
 * Fetch trending content from TMDB
 * @param {string} type - "movie" or "tv"
 * @param {string} timeWindow - "day" or "week"
 * @param {number} page - Page number for pagination
 * @returns {object} results array and total_pages count
 */
export async function fetchTrending(type = "movie", timeWindow = "week", page = 1) {
    // Call TMDB endpoint /trending/{type}/{timeWindow}
    const data = await tmdbFetch(`/trending/${type}/${timeWindow}`, {page});
    // Return results array and total_pages (default empty array / 1 if missing)
    return {results: data.results || [], total_pages: data.total_pages || 1};
}

/**
 * Fetch popular movies or TV shows
 * @param {string} type - "movie" or "tv"
 * @param {number} page - Page number
 */
export async function fetchPopular(type = "movie", page = 1) {
    // Call TMDB endpoint /{type}/popular
    const data = await tmdbFetch(`/${type}/popular`, {page});
    return {results: data.results || [], total_pages: data.total_pages || 1};
}

/**
 * Fetch top-rated movies or TV shows
 * @param {string} type - "movie" or "tv"
 * @param {number} page - Page number
 */
export async function fetchTopRated(type = "movie", page = 1) {
    // Call TMDB endpoint /{type}/top_rated
    const data = await tmdbFetch(`/${type}/top_rated`, {page});
    return {results: data.results || [], total_pages: data.total_pages || 1};
}

/**
 * Search for movies or TV shows
 * @param {string} type - "movie" or "tv"
 * @param {string} query - Search text
 * @param {number} page - Page number
 */
export async function fetchSearch(type = "movie", query, page = 1) {
    // If no query provided, return empty results immediately
    if (!query) {
        return {results: [], total_pages: 0};
    }
    // Call TMDB endpoint /search/{type}?query=...
    const data = await tmdbFetch(`/search/${type}`, {query, page});
    return {results: data.results || [], total_pages: data.total_pages || 1};
}

/**
 * Build a full image URL for a TMDB poster
 * @param {string} path - The path returned by TMDB (e.g., "/tmdb.jpg")
 * @returns {string} Full URL to the image or "" if path is missing
 */
export function tmdbFetchImage(path) {
    // If TMDB gave us a path, return full URL; otherwise return empty string
    return path ? `${IMAGE_BASE}${path}` : "";
}
