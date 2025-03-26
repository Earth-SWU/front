import axios from 'axios';

// 랭킹 조회 API
export const getRankings = async (token) => {
  try {
    const url = 'http://ecostep.co.kr/api/rankings';
    
    const response = await axios.get(url,{
      headers: {
          Authorization: `Bearer ${token}`,
      },
    });

    console.log("랭킹 목록 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("랭킹 목록 조회 API 에러:", error);
    
    const errorMessage =
      error.response?.data?.error ||
      "네트워크 오류가 발생했습니다. 랭킹 목록 조회를 다시 시도해 주세요.";
    
    throw new Error(errorMessage);
  }
};