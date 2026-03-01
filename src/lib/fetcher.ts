/**
 * Safe SWR fetcher that throws on non-ok responses.
 * When the fetcher throws, SWR keeps the fallbackData instead of
 * overriding it with the error response body.
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
