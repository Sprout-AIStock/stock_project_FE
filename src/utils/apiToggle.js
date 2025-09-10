const originalFetch = window.fetch;
let apiBlocked = false;

export const disableAPI = () => {
    if (!apiBlocked) {
        window.fetch = mockFetch;
        apiBlocked = true;
    }
};

export const enableAPI = () => {
    window.fetch = originalFetch;
    apiBlocked = false;
};