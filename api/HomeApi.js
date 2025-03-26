import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 메인화면 API
export const getTreeDate = async (token) => {
    try {
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }

        const url = `http://ecostep.co.kr/api/home/${userId}`;
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error("메인화면 조회 API 에러:", error);
        throw new Error("메인화면 데이터 조회 실패. 다시 시도해 주세요.");
    }
};

// 물주기 API
export const waterTree = async (token) => {
    try {
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }

        const url = `http://ecostep.co.kr/api/tree/water/${userId}`;
        
        const response = await axios.post(url, {}, { 
            headers: {
                Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가
            }
        });

        console.log("물주기 응답:", response.data);  // 서버 응답 확인용 로그

        return response.data;  // 응답 데이터 반환
    } catch (error) {
        console.error("물주기 API 에러:", error);

        // 에러 메시지 구성
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 물주기를 다시 시도해 주세요.";
        throw new Error(errorMessage);  // 에러 던지기
    }
};