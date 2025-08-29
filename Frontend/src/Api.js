// A singlpe place to define all Api calls to the backend

// Base URL for API calls
// Uses an environemntal variable in production (Vercel), falls back to localhost for local dev
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";
// Base URL for general API endpoints (movies, shows, lists, etc.)
export const URL = `${API_BASE}/api` // Points to the backend
// Base URL specifically for user/authentication endpoints
const USER_URL = `${API_BASE}/api/user`; // Keeps user routes separate

// A helper function to send requests to backend consistently
async function fetchApi(url, method = "GET", data) { // url = endpoint, method = HTTP method, data = optional body
    // Define options for the fetch request
    const options = {
        method, // HTTP method like GET, POST, etc.
        headers: {"Content-Type": "application/json"}, // Tell server we are sending JSON
        credentials: "include", // Include cookies (needed for login sessions)
    };

    if (data) { // If we have a request body (e.g., POST with data), attach it as JSON
        options.body = JSON.stringify(data); // Convert JS object into JSON string
    }
    // Actually send the HTTP request
    const response = await fetch(url, options); // Wait until server responds
    // If server responds with an error (not 200 - 299), throw an error
    if (!response.ok) {
        throw new Error(await response.text()); // Convert error response to text and throw
    }
    // If everything is OK, parse the response body as JSON
    return response.json(); // Returns a JS object/array that caller can use 
}

// User Authentication
/**
 * @param {string} username 
 * @param {string} password 
 */
export function userRegistration(username, password) { // Register a new user account
    return fetchApi(`${USER_URL}/register`, "POST", {username, password}); // Calls POST /api/user/register with username and password
}

/**
 * @param {string} username 
 * @param {string} password 
 */
export function userLogin(username, password) { // Log in an existing user
    return fetchApi(`${USER_URL}/login`, "POST", {username, password}); // Calls POST /api/user/login with credentials 
}

export function userLogout() { // Log out current user
    return fetchApi(`${USER_URL}/logout`, "POST"); // Calls POST /api/user/logout
}

export function fetchMe() { // Fetch information about the currently logged in user
    return fetchApi(`${USER_URL}/me`, "GET"); // Calls GET /api/user/me
}

// Movies
/**
 * @param {string} title - optional search term
 */
export function fetchMovies(title = "") { // Fetch movies from the backend, optionally filtred by title
    // Build URL differently depending on whether title is provided
    const url = title ? `${URL}/movies?title=${encodeURIComponent(title)}` : `${URL}/movies`; // If searching, add ?title= query parameter and if there is no title, fetch all movies
    return fetchApi(url); // Make GET request
}
/**
 * @param {object} object - movie object with details like title, year, etc. 
 */
export function addMovie(object) { // Add a new movie to the backend
    return fetchApi(`${URL}/movies`, "POST", object); // Post /api/movies with movie data
}

// Shows
export function fetchShows(title = "") { // Fetch shows from the backend, optionally filtred by title
    // Build URL depending on if title provided
    const url = title ? `${URL}/shows?title=${encodeURIComponent(title)}` : `${URL}/shows`; // EncodeURIComponent ensures safe query string
    return fetchApi(url); // Make GET request
}
export function addShow(object) { // Add a new show to backend
    return fetchApi(`${URL}/shows`, "POST", object); // POST /api/shows
}



// User WatchList & Favourites for Movies and Shows
/** 
 * Add a movie to user's list (watchlist, favourites, etc.)
 * @param {string} username - user performing actiom
 * @param {string} tmdbId - unique ID from TMDB API
 * @param {string} type - type of list ("watchlist" or "favourites")
 * @param {object} entertainementObject - movie data
 */

export function addMovieList(username, tmdbId, type, entertainementObject) {
    return fetchApi(`${URL}/user/movielist/${type}/add`, "POST", {username, tmdbId, type, ...entertainementObject,}); // POST /api/user/movielist/{type}/add and spread operator merges all fields
}
// Reemove a movie from user's list
export function removeMovieList(username, tmdbId, type) {
    return fetchApi(`${URL}/user/movielist/${type}/remove`, "POST", {username, tmdbId, type}); // POST /api/user/movielist/{type}/remove
}
// Fetch movies from a user's list
export function fetchMovieList(username, type) {
    return fetchApi(`${URL}/user/movielist/${type}?username=${encodeURIComponent(username)}`); // GET /api/user/movielist/{type}?username=user
}

// Add a show to user's list
export function addShowList(username, tmdbId, type, entertainementObject) {
    return fetchApi(`${URL}/user/showlist/${type}/add`, "POST", {username, tmdbId, type, ...entertainementObject,}); // POST /api/user/showlist/{type}/add
}
export function removeShowList(username, tmdbId, type) { // Remove a show from user's list
    return fetchApi(`${URL}/user/showlist/${type}/remove`, "POST", {username, tmdbId, type}); // POST /api/user/showlist/{type}/remove
}
export function fetchShowList(username, type) { // Fetch shows from a user's list
    return fetchApi(`${URL}/user/showlist/${type}?username=${encodeURIComponent(username)}`); // GET /api/user/showlist/{type}?username=user
}