import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 뱃지 조회 API
export const getUserBadges = async (token) => {

    try {
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }

        const url = `http://ecostep.co.kr/api/me/badge/${userId}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log("사용자 뱃지 조회 응답:", response.data);  // 서버 응답 확인용 로그

        return response.data;  // 뱃지 목록 응답 데이터 반환
    } catch (error) {
        console.log("뱃지 조회 API 에러:", error);

        // 에러 메시지 구성
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 뱃지 조회를 다시 시도해 주세요.";
        throw new Error(errorMessage);  // 에러 던지기
    }
};

// 비기너 뱃지 API
export const earnBeginnerBadge = async (token) => {
    try {
        const userId = await SecureStore.getItemAsync("userId");
        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }
        const url = `http://ecostep.co.kr/api/beginner/${userId}`;
        const response = await axios.post(
            url,
            null,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("비기너 뱃지 획득 응답:", response.data);
        return response.data;
    } catch (error) {
        console.error("비기너 뱃지 API 에러:", error.response?.data || error.message);
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 비기너 뱃지를 다시 시도해 주세요.";
        throw new Error(errorMessage);
    }
};

// 뱃지 지급 API
export const checkMissionForBadge = async (token, missionId) => {
    try {
        const userId = await SecureStore.getItemAsync("userId");
        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }

        const url = `http://ecostep.co.kr/api/missions/badge/check`;

        const requestBody = {
            userId: userId,
            missionId: missionId,
        };

        const response = await axios.post(url, requestBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // 응답 데이터 출력
        console.log("뱃지 지급 응답:", response.data);

        // "뱃지가 성공적으로 지급되었습니다." 메시지가 포함된 경우
        if (response.data.message === "뱃지가 성공적으로 지급되었습니다.") {
            return { message: response.data.message, data: response.data };
        }

        // 다른 메시지는 무시하고 그냥 종료
        return { message: "뱃지 지급 상태 확인 완료", data: response.data };
    } catch (error) {
        console.log("뱃지 지급 API 에러:", error.response?.data || error.message);

        // 에러 메시지 구성
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 뱃지 지급을 다시 시도해 주세요.";
        throw new Error(errorMessage);
    }
};