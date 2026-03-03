/**
 * Safe SWR fetcher that throws on non-ok responses.
 * Automatically unwraps the backend's standard response envelope:
 *   { success: true, data|history|user|...: <payload>, message: "..." }
 * into just the <payload> so components receive the data directly.
 */
export const apiFetcher = (url: string) =>
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('neurai_token') || ''}`,
            'Content-Type': 'application/json',
        },
    }).then(res => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
    }).then(json => {
        // If the response is already an array, return it directly
        if (Array.isArray(json)) return json;

        // If the response has a { success, ... } wrapper, extract the data payload
        if (json && typeof json === 'object' && 'success' in json) {
            // Common data field names used by the Neurolab backend
            const dataKeys = ['data', 'history', 'user', 'users', 'devices', 'sessions',
                'appointments', 'results', 'items', 'records', 'notifications',
                'partnerships', 'clinics', 'reviews', 'tariffs', 'analytics',
                'uploads', 'patients', 'certifications', 'metrics'];
            for (const key of dataKeys) {
                if (key in json) return json[key];
            }
            // If no known data key, return the object without success/message metadata
            const { success, message, ...rest } = json;
            // If rest has content, return it as the data
            const restKeys = Object.keys(rest);
            if (restKeys.length === 1) return rest[restKeys[0]];
            if (restKeys.length > 1) return rest;
        }
        return json;
    });

/**
 * POST helper for creating resources. Reuses the same auth header pattern.
 */
export const apiPost = (url: string, body: object) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('neurai_token') || ''}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then(res => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
    });

/**
 * PATCH helper for partial updates.
 */
export const apiPatch = (url: string, body: object) =>
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('neurai_token') || ''}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then(res => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
    });

/**
 * Upload helper for multipart/form-data (File uploads)
 */
export const apiUploadFile = (url: string, formData: FormData) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('neurai_token') || ''}`,
            // Do NOT set Content-Type; browser sets it with appropriate boundary
        },
        body: formData,
    }).then(res => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
    });
