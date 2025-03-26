import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 미션 목록 조회 API
export const getMissionList = async (token) => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
    }
    const url = `http://ecostep.co.kr/api/missions/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("미션 목록 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("미션 목록 조회 API 에러:", error);
    const errorMessage =
      error.response?.data?.error ||
      "네트워크 오류가 발생했습니다. 미션 목록 조회를 다시 시도해 주세요.";
    throw new Error(errorMessage);
  }
};

// 미션 수행 완료 API
export const completeMission = async (token, missionId) => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
    }
    const url = `http://ecostep.co.kr/api/missions/complete`;
    const response = await axios.post(url, { userId, missionId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("미션 수행 완료 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("미션 수행 완료 API 에러:", error);
    const errorMessage =
      error.response?.data?.error ||
      "네트워크 오류가 발생했습니다. 미션 완료를 다시 시도해 주세요.";
    throw new Error(errorMessage);
  }
};

// 미션 - 출석체크 API
export const checkAttendanceMission = async (token) => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
    }
    const url = `http://ecostep.co.kr/api/missions/attend/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("출석체크 미션 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("출석체크 미션 API 에러:", error);
    const errorMessage =
      error.response?.data?.error ||
      "네트워크 오류가 발생했습니다. 출석체크 미션을 다시 시도해 주세요.";
    throw new Error(errorMessage);
  }
};

// 미션 - 영수증 인증 API
export const verifyReceiptMission = async (token, receiptFile) => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
    }

    const url = `http://ecostep.co.kr/api/missions/receipt`;
    const formData = new FormData();
    
    formData.append("message", JSON.stringify({
      images: [{ format: "jpg", name: "demo" }],
      requestId: "123e4567-e89b-12d3-a456-426614174000",
      version: "V2",
      timestamp: Date.now(),
    }));
    
    formData.append("file", {
      uri: receiptFile.uri,
      name: "receipt.jpg",
      type: "image/jpg",
    });

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        "X-OCR-SECRET": "anF0a0J3bU9FWk9qSE1Kam95cUFVaXBITWRqdHhObUE="
      },
    });
    
    console.log("영수증 인증 미션 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("영수증 인증 미션 API 에러:", error);
    const errorMessage =
      error.response?.data?.error ||
      "네트워크 오류가 발생했습니다. 영수증 인증 미션을 다시 시도해 주세요.";
    throw new Error(errorMessage);
  }
};

// 미션 - 텀블러 사용하기 API
export const useTumblerMission = async (token, tumblerFile) => {
  try {
    const url = `http://ecostep.co.kr/api/missions/tumbler`;
    
    // FormData 생성 및 파일 추가
    const formData = new FormData();
    formData.append("file", {
      uri: tumblerFile.uri,
      type: tumblerFile.type,
      name: tumblerFile.name,
    });
    
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("텀블러 사용 미션 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("텀블러 사용 미션 API 에러:", error);
    const errorMessage =
      error.response?.data?.error ||
      "네트워크 오류가 발생했습니다. 텀블러 사용 미션을 다시 시도해 주세요.";
    throw new Error(errorMessage);
  }
};

// 미션 - 3000보 이상 걷기 API
export const walkStepsMission = async (token) => {
  try {
    const userId = await SecureStore.getItemAsync("userId");
    if (!userId) {
      throw new Error("사용자 ID를 찾을 수 없습니다. 로그인 상태를 확인하세요.");
    }
    const url = `http://ecostep.co.kr/api/missions/walk/${userId}`;
    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("3000보 이상 걷기 미션 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("3000보 이상 걷기 미션 API 에러:", error);
    const errorMessage =
      error.response?.data?.error ||
      "네트워크 오류가 발생했습니다. 걷기 미션을 다시 시도해 주세요.";
    throw new Error(errorMessage);
  }
};
