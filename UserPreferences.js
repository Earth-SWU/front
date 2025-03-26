import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getAccessToken } from "./Auth";

export const hasSelectedTree = async () => {
  try {
    const token = await getAccessToken();
    if(!token){
      console.log("토큰이 없습니다.")
      return false;
    }

    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      return false;
    }

    // 사용자 프로필 API
    const url = `http://ecostep.co.kr/api/profile/${userId}`;
    const response = await axios.get(url,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.treeName !== null;
  } catch (error) {
    if (error.response) {
      // 서버에서 응답을 반환했을 때
      console.error("서버 오류:", error.response.status);  // 상태 코드
      console.error("서버 응답 데이터:", error.response.data);  // 오류 응답 데이터
    } else {
      // 네트워크 오류나 기타 오류
      console.error("네트워크 또는 클라이언트 오류:", error.message);
    }
    return false;
  }
};