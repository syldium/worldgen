/**
 * @param {string} url
 * @param {object} options
 */
export async function jsonFetch(url, options) {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        ...options
    });

    const responseData = await response.json();
    if (response.ok) {
        return responseData;
    }
    throw responseData;
}