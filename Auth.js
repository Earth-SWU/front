import * as SecureStore from 'expo-secure-store';
import { refreshTokenAPI } from './api/SignupApi';
import base64 from 'base-64';

const STORAGE_KEY_ACCESS_TOKEN = 'accessToken';
const STORAGE_KEY_REFRESH_TOKEN = 'refreshToken';

// 토큰 저장
export const saveTokens = async (accessToken, refreshToken) => {
    try {
        console.log("토큰 저장 시작:", accessToken, refreshToken);
        await SecureStore.setItemAsync(STORAGE_KEY_ACCESS_TOKEN, accessToken);
        await SecureStore.setItemAsync(STORAGE_KEY_REFRESH_TOKEN, refreshToken);
        console.log("토큰 저장 완료");
    } catch (error) {
        console.error("토큰 저장 오류:", error);
    }
};

// 액세스 토큰 가져오기
export const getAccessToken = async () => {
    try {
        const accessToken = await SecureStore.getItemAsync(STORAGE_KEY_ACCESS_TOKEN);
        console.log("가져온 액세스 토큰:", accessToken); // 디버깅 로그
        return accessToken;
    } catch (error) {
        console.error("액세스 토큰 가져오기 오류:", error);
        return null;
    }
};

// 리프레시 토큰 가져오기
export const getRefreshToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync(STORAGE_KEY_REFRESH_TOKEN);
        console.log("리프레시 토큰:", refreshToken);
        return refreshToken;
    } catch (error) {
        console.error("리프레시 토큰 가져오기 오류:", error);
        return null;
    }
};

// 토큰 삭제
export const removeTokens = async () => {
    try {
        await SecureStore.deleteItemAsync(STORAGE_KEY_ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEY_REFRESH_TOKEN);
    } catch (error) {
        console.error("토큰 삭제 오류:", error);
    }
};

// 리프레시 토큰으로 새 액세스 토큰 발급 후 저장
export const refreshAccessToken = async () => {
    const refreshToken = await getRefreshToken();
    const accessToken = await getAccessToken();

    if (refreshToken && accessToken) {
        try {
            console.log("리프레시 토큰과 액세스 토큰 사용 시작:", refreshToken, accessToken);
            const newAccessToken = await refreshTokenAPI(refreshToken);  // 기존 액세스 토큰과 리프레시 토큰을 함께 전달
            if (newAccessToken) {
                console.log("새 액세스 토큰 발급 완료:", newAccessToken);
                await saveTokens(newAccessToken, refreshToken);  // 새로운 액세스 토큰과 리프레시 토큰 저장
                return newAccessToken;
            } else {
                console.log("새 액세스 토큰 발급 실패: 응답 없음");
                return null;
            }
        } catch (error) {
            console.log("리프레시 토큰으로 액세스 토큰 발급 실패:", error);
            return null;
        }
    } else {
        console.log("리프레시 토큰 또는 액세스 토큰이 없습니다.");
        return null;
    }
};

// 액세스 토큰의 만료 여부를 체크하는 함수
const isAccessTokenExpired = (accessToken) => {
    if (!accessToken) return true;
    try {
        const payload = accessToken.split('.')[1];
        const decoded = JSON.parse(base64.decode(payload)); // JSON.parse 추가
        console.log("Decoded Token:", decoded);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("JWT Decode Error:", error);
        return true;
    }
};

// 액세스 토큰 유효성 확인
export const getValidAccessToken = async () => {
    let accessToken = await getAccessToken();
    console.log("getValidAccessToken - 기존 액세스 토큰:", accessToken);

    // 액세스 토큰이 있고, 만료되지 않았다면 그대로 사용
    if (accessToken && !isAccessTokenExpired(accessToken)) {
        console.log("유효한 액세스 토큰 있음.");
        return accessToken;
    } else {
        console.log("액세스 토큰 없음 또는 만료됨. 리프레시 토큰 사용하여 새 액세스 토큰 발급 시도...");
        accessToken = await refreshAccessToken(); // 리프레시 토큰으로 새 액세스 토큰 발급

        // 새 액세스 토큰이 발급된 경우
        if (accessToken) {
            console.log("새 액세스 토큰 발급 완료:", accessToken);
            return accessToken;
        } else {
            console.log("새 액세스 토큰 발급 실패");
            return null;
        }
    }
};

// 사용자 로그인 상태 체크 (액세스 토큰의 유효성 포함)
export const isLoggedIn = async () => {
    const accessToken = await getValidAccessToken(); // 유효한 액세스 토큰 가져오기
    console.log("isLoggedIn - 최종 액세스 토큰:", accessToken);

    if (accessToken) {
        console.log("로그인 상태: true");
        return true; // 액세스 토큰이 있으면 로그인 상태로 간주
    } else {
        console.log("로그인 상태: false");
        return false; // 액세스 토큰이 없으면 로그인 상태 아님
    }
};