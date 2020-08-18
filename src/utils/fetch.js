/**
 * @param {string} url
 * @param {object} options
 * @param {object} [headers]
 * @returns {Promise<object>}
 */
export async function jsonFetch(url, options, headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
}) {
    const response = await fetch(url, {
        headers,
        ...options
    });

    const responseData = await response.json();
    if (response.ok) {
        return responseData;
    }
    throw responseData;
}
