// Mock fetch 함수 - API 호출을 차단하고 Mock 데이터 반환
const mockFetch = (url, options = {}) => {
    console.log(`🚫 API 호출 차단됨: ${url}`);

    return Promise.reject(new Error('API 호출이 비활성화되었습니다 (Mock 모드)'));
};

// 전역 fetch를 Mock으로 교체
const originalFetch = window.fetch;
let apiBlocked = false;

export const disableAPI = () => {
    if (!apiBlocked) {
        window.fetch = mockFetch;
        apiBlocked = true;
        console.log('🚫 모든 API 호출이 비활성화되었습니다');
    }
};

export const enableAPI = () => {
    if (apiBlocked) {
        window.fetch = originalFetch;
        apiBlocked = false;
        console.log('✅ API 호출이 활성화되었습니다');
    }
};

// 앱 시작 시 API 비활성화
disableAPI();
