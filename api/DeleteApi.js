import axios from 'axios';

// 회원탈퇴 API
export const deleteUser = async (token) => {
    const url = "http://ecostep.co.kr/api/users/delete";

    try {
        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log("회원탈퇴 응답:", response.data);  // 서버 응답 확인용 로그

        return response.data;  // 응답 데이터 반환
    } catch (error) {
        console.error("회원탈퇴 API 에러:", error);

        // 에러 메시지 구성
        const errorMessage =
            error.response?.data?.error ||
            "네트워크 오류가 발생했습니다. 회원탈퇴를 다시 시도해 주세요.";
        throw new Error(errorMessage);  // 에러 던지기
    }
};