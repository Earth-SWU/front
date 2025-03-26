import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 마이페이지 API
export const getMyPage = async (token) => {

    try {
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }

        const url = `http://ecostep.co.kr/api/me/${userId}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log("마이페이지 응답:", response.data);  // 서버 응답 확인용 로그

        return response.data;  // 응답 데이터 반환
    } catch (error) {
        console.error("마이페이지 API 에러:", error);

        // 에러 메시지 구성
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 마이페이지를 다시 시도해 주세요.";
        throw new Error(errorMessage);  // 에러 던지기
    }
};

// 사용자 정보 반환 API
export const getProfile = async (token) => {

    try {
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }
        const url = `http://ecostep.co.kr/api/profile/${userId}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log("프로필 정보 응답:", response.data);  // 서버 응답 확인용 로그

        return response.data;  // 응답 데이터 반환
    } catch (error) {
        console.error("프로필 정보 API 에러:", error);

        // 에러 메시지 구성
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 프로필 정보를 다시 시도해 주세요.";
        throw new Error(errorMessage);  // 에러 던지기
    }
}