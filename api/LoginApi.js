import axios from 'axios';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// 로그인 API
export const login = async (email, password) => {
    const url = "http://ecostep.co.kr/api/users/login";
    const bodyData = { email, password };

    try {
        const response = await axios.post(url, bodyData, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("API 응답 데이터:", response.data);

        const { accessToken, refreshToken, userId, email: userEmail } = response.data;

        if (!accessToken || typeof accessToken !== 'string') {
            throw new Error("토큰 값이 올바르지 않습니다.");
        }

        console.log("userId:", userId);
        console.log("로그인 성공:", userEmail);
        console.log("발급된 액세스 토큰:", accessToken);
        console.log("발급된 리프레시 토큰:", refreshToken);

        // SecureStore에 저장
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await SecureStore.setItemAsync("userId", JSON.stringify(userId));

        return { message: "로그인 성공", token: accessToken };
    } catch (error) {
        // 서버 응답 메시지를 가져오고 없으면 기본 메시지 설정
        const errorMessage = error.response?.data || "로그인에 실패했습니다. 다시 시도해 주세요.";

        // Alert 창으로 서버 응답 메시지 띄우기
        Alert.alert("로그인 실패", errorMessage);

        throw error;
    }
};