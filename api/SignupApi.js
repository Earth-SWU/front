import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 회원가입 API
export const register = async (email, password, confirmPassword, phoneNumber) => {
    const url = "http://ecostep.co.kr/api/users/signup";
    const bodyData = { email, password, confirmPassword, phoneNumber};

    try {
        const response = await axios.post(url, bodyData);
        
        console.log("회원가입 응답:", response.data); // 서버 응답 확인용 로그

        return response.data; // 응답 구조가 맞는지 확인 필요
    } catch (error) {
        console.log("회원가입 에러:", error);
        
        throw new Error(error.response?.data || error.response?.data?.error || "회원가입에 실패했습니다. 다시 시도해 주세요.");
    }
};

// 이메일 인증번호 요청 API
export const sendVerificationCode = async (email) => {
    const url = "http://ecostep.co.kr/api/email-check";

    try {
        console.log("이메일 인증 요청 보냄", { email });

        const response = await axios.post(
            url, 
            { email },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("이메일 인증번호 전송 성공:", response.data);

        return response.data;
    } catch (error) {
        // 응답 로그 상세 출력
        console.error("이메일 인증번호 전송 에러:", error);

        if (error.response) {
            console.error("응답 데이터:", error.response.data);
            console.error("응답 상태코드:", error.response.status);
            console.error("응답 헤더:", error.response.headers);
        } else if (error.request) {
            console.error("요청은 갔지만 응답이 없음:", error.request);
        } else {
            console.error("요청 설정 중 에러 발생:", error.message);
        }

        // 에러 메시지 구성
        const errorMessage = error.response?.data?.error || "네트워크 오류가 발생했습니다. 이메일 인증번호를 다시 시도해 주세요.";
        throw new Error(errorMessage);
    }
};

// 이메일 인증번호 검증 API
export const verifyCode = async (email, code) => {
    const url = "http://ecostep.co.kr/api/verify-code";
    const bodyData = { email, code };

    try {
        const response = await axios.post(url, bodyData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("이메일 인증번호 검증 응답:", response.data);

        if (response.status !== 200) {
            throw new Error(response.data?.error || "인증번호 확인에 실패했습니다.");
        }

        return response.data;
    } catch (error) {
        console.error("이메일 인증번호 검증 에러:", error);

        throw new Error(
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 인증번호를 다시 시도해 주세요."
        );
    }
};

// 나무이름 짓기 API
export const setTreeName = async (token, treeName) => {
    try {
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
            throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
        }

        const url = `http://ecostep.co.kr/api/tree/name/${userId}`;
        const bodyData = { treeName };  // 요청 데이터

        const response = await axios.put(url, bodyData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log("나무이름 짓기 응답:", response.data);  // 서버 응답 확인용 로그

        return response.data;  // 응답 데이터 반환
    } catch (error) {
        console.error("나무이름 짓기 API 에러:", error);

        // 에러 메시지 구성
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 나무 이름을 다시 시도해 주세요.";
        throw new Error(errorMessage);  // 에러 던지기
    }
};

// 리프레시 토큰 발급 API
export const refreshTokenAPI = async (refreshToken) => {
    const url = "http://ecostep.co.kr/api/refresh";
    
    const bodyData = {
        refreshToken: refreshToken,  // 리프레시 토큰
    };

    try {
        console.log("리프레시 토큰 발급 API 호출 준비:", bodyData); 

        // 서버에 요청
        const response = await axios.post(url, bodyData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("리프레시 토큰 발급 응답:", response.data);  // 응답 로그

        // 서버에서 반환된 새 액세스 토큰
        if (response.data && response.data.accessToken) {
            return response.data.accessToken;
        } else {
            throw new Error("리프레시 토큰으로 새 액세스 토큰을 발급받을 수 없습니다.");
        }
    } catch (error) {
        // 에러가 발생한 경우
        if (error.response) {
            console.error("리프레시 토큰 발급 API 오류 응답:", error.response.data);  // 서버 응답 확인
            const errorMessage = error.response?.data?.error || "서버에서 에러가 발생했습니다.";
            throw new Error(errorMessage);  // 사용자에게 적절한 에러 메시지 던지기
        } else {
            console.error("리프레시 토큰 발급 에러 (네트워크 또는 기타 오류):", error.message);
            throw new Error("리프레시 토큰 발급 중 네트워크 오류가 발생했습니다.");
        }
    }
};