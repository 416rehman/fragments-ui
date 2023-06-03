// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
    try {
        const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
            // Generate headers with the proper Authorization bearer token to pass
            headers: user.authorizationHeaders(),
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('User fragments data received', {data});
        return data;
    } catch (err) {
        console.error('Unable to call GET /v1/fragment', {err});
    }
}

/**
 * Given an authenticated user, request a single fragment for this user from the
 * @param user
 * @param fragmentId
 * @param as "txt" | "md" | "html" | "json" | "png" | "jpeg" | "webp" | "gif" | "jpg" etc
 */
export async function getUserFragment(user, fragmentId, as = "") {
    try {
        const extension = as ? `.${as}` : "";
        const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}${extension}`, {
            headers: user.authorizationHeaders(),
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        const contentType = res.headers.get("content-type");
        let data = null;
        switch (contentType) {
            case "application/json":
                data = await res.json()
                break
            case "text/html":
            case "text/markdown":
            case "text/plain":
                data = await res.text()
                break
            case "image/png":
            case "image/jpeg":
                data = await res.blob()
                break
            default:
                data = await res.text()
                break
        }
        console.log('User fragment data received', {data});
        return data;
    } catch (err) {
        console.error('Unable to call GET /v1/fragment', {err});
    }
}

export async function createUserFragment(user, content, contentType) {
    console.log('createUserFragment', {user, data: content, contentType});
    try {
        const res = await fetch(`${apiUrl}/v1/fragments`, {
            method: 'POST',
            headers: {
                ...user.authorizationHeaders(),
                'Content-Type': contentType,
            },
            body: content,
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('User fragment created', {data});
        return data;
    } catch (err) {
        console.error('Unable to call POST /v1/fragment', {err});
    }
}

export async function updateUserFragment(user, fragmentId, contentType, newContent) {
    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
            method: 'PUT',
            headers: {
                ...user.authorizationHeaders(),
                'Content-Type': contentType,
            },
            body: newContent
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('User fragment updated', {data});
        return data;
    } catch (err) {
        console.error('Unable to call PUT /v1/fragment', {err});
    }
}

export async function deleteUserFragment(user, fragmentId) {
    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
            method: 'DELETE',
            headers: user.authorizationHeaders(),
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('User fragment deleted', {data});
        return data;
    } catch (err) {
        console.error('Unable to call DELETE /v1/fragment', {err});
    }
}
