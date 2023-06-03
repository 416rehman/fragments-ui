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
        console.log('User fragments data received', { data });
        return data;
    } catch (err) {
        console.error('Unable to call GET /v1/fragment', { err });
    }
}

export async function getUserFragment(user, fragmentId) {
    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
            headers: user.authorizationHeaders(),
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        console.log('User fragment data received', { res });
        return res;
    } catch (err) {
        console.error('Unable to call GET /v1/fragment', { err });
    }
}

export async function createUserFragment(user, content, contentType) {
    console.log('createUserFragment', { user, data: content, contentType });
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
        console.log('User fragment created', { data });
        return data;
    } catch (err) {
        console.error('Unable to call POST /v1/fragment', { err });
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
        console.log('User fragment updated', { data });
        return data;
    } catch (err) {
        console.error('Unable to call PUT /v1/fragment', { err });
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
        console.log('User fragment deleted', { data });
        return data;
    } catch (err) {
        console.error('Unable to call DELETE /v1/fragment', { err });
    }
}
