// API helper function to make requests to the backend

// Export an async function called fetchJSON that will be used across the app
export async function fetchJSON(path, options = {}) {
    // Send a fetch request to the backend API
    // It uses the base URL from .env (VITE_API_URL) and appends the given path (e.g. "/books")
    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        // Always send requests with JSON content type
        headers: { "Content-Type": "application/json" },
        // Spread any extra options (method, body, etc.) provided when calling fetchJSON
        ...options,
    });

    // If the response is not successful (status code not in 200-299 range)
    if (!res.ok) {
        // Try to parse the error response as JSON
        const error = await res.json().catch(() => ({}));
        // Throw an error with a useful message (from server or fallback to status text)
        throw new Error(error.error || res.statusText);
    }

    // If successful, parse the response as JSON and return it
    return res.json();
}
