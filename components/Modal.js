import React, { useState, useEffect, useRef } from "react";
import { Animated, PanResponder, View, Text, StyleSheet, Modal as RNModal, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Svg, { Path } from "react-native-svg";
import { getMissionList, completeMission, checkAttendanceMission, verifyReceiptMission, walkStepsMission, useTumblerMission } from "../api/MissionApi";
import { getAccessToken } from "../Auth";
import { checkMissionForBadge } from "../api/BadgeApi";
import { PermissionsAndroid, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import ToastAlarm from "./ToastAlarm";
import * as SecureStore from 'expo-secure-store';
import * as ImageManipulator from 'expo-image-manipulator';

// 모달 외부 스타일
const ModalWrapper = styled.View`
  background-color: #fff;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 2px;
  position: absolute;
  bottom: 0;
`;

// 상단 바 (드래그 핸들)
const DragHandle = styled.View`
  width: 100px;
  height: 5px;
  background-color: #ccc;
  border-radius: 2.5px;
  align-self: center;
  margin-vertical: 10px;
`;

// 상단 컨테이너
const TopContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${hp("2%")};
`;

// 상단 왼쪽 텍스트 컨테이너
const TextContainer = styled.View`
  flex-direction: column;
  margin-right: ${wp("10%")}; 
`;

// 오늘의 미션 제목 텍스트
const Title = styled.Text`
  margin-top: 30px;
  font-size: 25px;
  line-height: 25px;
  font-family: "Montserrat-Bold";
  font-weight: 700;
  color: #000;
  left: 30px;
`;

// 오늘의 날짜 텍스트
const DateText = styled.Text`
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  font-family: "Montserrat-Medium";
  color: #000;
  left: 30px;
  margin-top: 10px;
`;

// 물뿌리개 아이콘
const WateringIcon = styled.Image`
  width: ${wp("22%")};
  height: ${wp("22%")};
  top: ${hp("1%")};
  left: ${wp("14%")};
`;

// 하단 미션 컨테이터
const ModalContent = styled.View`
  width: 100%;
  padding-horizontal: 20px;
  padding-vertical: 6px;
  justify-content: center;
  align-items: center;
  margin-bottom: ${hp("2%")};
`;

// 각 미션 아이템들
const MissionItem = styled(TouchableOpacity)`
  border-radius: 10px;
  background-color: ${({ disabled }) => (disabled ? '#E2E2E2' : '#effbfb')};
  height: 64px;
  width: 100%;
  margin-bottom: 16px;
  align-items: flex-start;
  justify-content: center;
  padding-left: 87px;
  position: relative;
`;

// 미션 왼쪽 아이콘 밑에 원
const Circle = styled.View`
  width: ${wp("12%")};
  height: ${wp("12%")};
  border-radius: ${wp("10%")};
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: ${hp("1%")}; 
  left: ${wp("4%")};
`;

// 미션 왼쪽 아이콘들 (Circle 내부 아이콘)
const Icon = styled.Image`
  width: ${wp("8%")};
  height: ${wp("8%")};
  position: absolute;
`;

// 미션 오른쪽 아이콘들
const ArrowIcon = styled(Svg)`
  width: ${wp("5%")}; 
  height: ${hp("3%")};
  position: absolute;
  left: ${wp("80%")};
  bottom: ${wp("5%")};
`;

// 미션 내부 텍스트
const MissionText = styled.Text`
  font-size: 14px;
  font-family: "Montserrat-Bold";
  font-weight: 700;
  color: #000;
  position: absolute;
  top: 23px;
  left: 87px;
`;

// 권한 요청 함수
const requestActivityRecognitionPermission = async () => {
  if (Platform.OS === 'android') {
    const { status } = await Permissions.askAsync(Permissions.ACTIVITY_RECOGNITION);
    if (status !== 'granted') {
      alert('걸음 수 추적 권한이 필요합니다.');
    }
  }
};

const Modal = ({ visible, onClose }) => {
  const [missions, setMissions] = useState([]);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const [startPos, setStartPos] = useState(0);
  const [steps, setSteps] = useState(0);  // 걸음 수 상태
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 각 미션 완료 여부 상태 추가
  const [isAttendanceMissionCompleted, setIsAttendanceMissionCompleted] = useState(false);
  const [isConsumeMissionCompleted, setIsConsumeMissionCompleted] = useState(false);
  const [isTumblerMissionCompleted, setIsTumblerMissionCompleted] = useState(false);
  const [isStepMissionCompleted, setIsStepMissionCompleted] = useState(false);

  const [badgeMessage, setBadgeMessage] = useState(""); // 획득한 뱃지 이름
  const [showToast, setShowToast] = useState(false); // Toast 표시 여부

  const panResponder = PanResponder.create({
    // 터치가 시작되었을 때 PanResponder를 활성화할지 여부를 결정
    onStartShouldSetPanResponder: () => true,

    // 사용자가 터치를 시작할 때 호출됨
    onPanResponderGrant: (_, gestureState) => {
      // 터치 시작 위치(y 좌표)를 저장
      setStartPos(gestureState.moveY);
    },

    // 사용자가 손가락을 움직일 때 호출됨
    onPanResponderMove: (_, gestureState) => {
      // 아래 방향으로 드래그하는 경우에만 애니메이션 값 변경
      if (gestureState.moveY - startPos > 0) {
        slideAnim.setValue(gestureState.moveY - startPos);
      }
    },

    // 사용자가 손을 떼었을 때 호출됨
    onPanResponderRelease: (_, gestureState) => {
      // 일정 거리 이상 드래그했으면 모달을 닫는 애니메이션 실행
      if (gestureState.moveY - startPos > 10) {
        Animated.timing(slideAnim, {
          toValue: 400,  // 아래로 이동하는 애니메이션
          duration: 200,
          useNativeDriver: true,
        }).start(onClose);
      } else {
        // 10px 이하로 드래그했다면 원래 위치
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!visible) onClose();
      });
    }
  }, [visible]);

  useEffect(() => {
    requestActivityRecognitionPermission();

    const loadSteps = async () => {
      const today = getTodayDate();
      const savedSteps = await getSavedSteps(today); // 저장된 걸음 수 가져오기
      setSteps(savedSteps);
      setLastUpdatedDate(today);
    };

    loadSteps();

    // 걸음 수 추적
    const subscription = Pedometer.watchStepCount(result => {
      const currentSteps = result.steps;
      setSteps(currentSteps); // 상태 업데이트
      saveSteps(currentSteps); // 걸음 수 저장
    });

    return () => subscription.remove();
  }, []);

  const saveSteps = async (steps) => {
    try {
      const today = getTodayDate();
      await SecureStore.setItemAsync(today, JSON.stringify(steps)); // 오늘 날짜에 해당하는 걸음 수 저장
    } catch (error) {
      console.error('걸음 수 저장 오류:', error);
    }
  };

  const getSavedSteps = async (date) => {
    try {
      const savedSteps = await SecureStore.getItemAsync(date); // 특정 날짜의 걸음 수를 가져옴
      return savedSteps ? JSON.parse(savedSteps) : 0; // 값이 없으면 0 반환
    } catch (error) {
      console.error('걸음 수 불러오기 오류:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("토큰을 찾을 수 없습니다.");
    
        const response = await getMissionList(token);
        console.log("미션 목록:", response);
    
        const missionList = response?.missions;
        if (Array.isArray(missionList)) {
          missionList.forEach((mission) => {
            if (mission.missionType === "ATTENDANCE" && mission.completed) {
              setIsAttendanceMissionCompleted(true);
            }
            if (mission.missionType === "RECEIPT" && mission.completed) {
              setIsConsumeMissionCompleted(true);
            }
            if (mission.missionType === "TUMBLER" && mission.completed) {
              setIsTumblerMissionCompleted(true);
            }
            if (mission.missionType === "WALK" && mission.completed) {
              setIsStepMissionCompleted(true);
            }
          });
        }
      } catch (error) {
        console.error("미션 목록 조회 오류:", error);
      }
    };
  
    fetchMissions();
  }, []);

  const handleCheckMissionForBadge = async (missionId) => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("토큰을 찾을 수 없습니다.");

      // 미션 목록을 조회하여 뱃지 획득을 체크
      const response = await checkMissionForBadge(token, missionId);
      console.log("미션 완료 뱃지 체크:", response);

      // 뱃지를 획득한 경우
      if (response.success) {
        setBadgeMessage(response.badgeName); // 뱃지 이름 설정
        setShowToast(true); // Toast 표시
      }
    } catch (error) {
      console.error("뱃지 체크 오류:", error);
    }
  };

  const currentDate = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = months[currentDate.getMonth()];
  const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`; // 날짜를 형식에 맞게 변환

  const handleCheckAttendance = async () => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("토큰을 찾을 수 없습니다.");
  
      // 미션 목록 조회
      const response = await getMissionList(token);
      console.log("미션 목록:", response);
  
      const missionList = response?.missions;
      if (!Array.isArray(missionList)) {
        throw new Error("미션 목록이 배열이 아닙니다.");
      }
  
      // "출석 체크" 미션 찾기 (type이 "attendance"인 미션)
      const attendanceMission = missionList.find(missions => missions.missionType === "ATTENDANCE" && !missions.completed);
      console.log("출석 체크 미션:", attendanceMission);  // 여기서 로그로 확인
  
      if (attendanceMission) {
        const missionId = attendanceMission.id;  // 출석 체크 미션의 ID
        console.log("Completing mission with ID:", missionId);
  
        // 출석 체크 미션 완료
        const checkAttendanceResponse = await checkAttendanceMission(token);
        console.log("출석 체크 완료 응답:", checkAttendanceResponse);
  
        // 미션 수행 완료
        const missionCompletionResponse = await completeMission(token, missionId);
        console.log("미션 완료 응답:", missionCompletionResponse);
  
        // 출석 체크 미션 완료 상태 변경
        setIsAttendanceMissionCompleted(true);
        handleCheckMissionForBadge(missionId);
        alert("출석 체크 미션을 완료했습니다!");
      } else {
        alert("출석 체크 미션이 완료되었거나 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("출석 체크 미션 완료 오류:", error);
      alert("출석 체크 미션을 완료하지 못했습니다.");
      setIsAttendanceMissionCompleted(false);
    }
  };

  const handleCheckWalkMission = async () => {
    try {
      if (steps >= 3000 && !isStepMissionCompleted) {
        await completeWalkMission();
      } else {
        alert(`3000보를 달성해야 합니다.`);
      }
    } catch (error) {
      console.error("걷기 미션 완료 오류:", error);
      alert("걷기 미션을 완료할 수 없습니다.");
    }
  };  

  const completeWalkMission = async () => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("토큰을 찾을 수 없습니다.");

      // 미션 목록 조회
      const response = await getMissionList(token);
      console.log("미션 목록:", response);

      const missionList = response?.missions;
      if (!Array.isArray(missionList)) {
        throw new Error("미션 목록이 배열이 아닙니다.");
      }

      // "3000보 걷기" 미션 찾기
      const walkMission = missionList.find(mission => mission.missionType === "WALK" && !mission.completed);
      console.log("3000보 걷기 미션:", walkMission);

      if(walkMission){
        const missionId = walkMission.id;  // 미션 ID
        console.log("Completing walk with ID:", missionId);

        const missionCompletionResponse = await walkStepsMission(token);
        console.log("3000보 이상 걷기 미션 완료:", missionCompletionResponse);

        setIsStepMissionCompleted(true);
        handleCheckMissionForBadge(missionId);
        
        alert("3000보 걷기 미션을 완료했습니다!");
      }
    } catch (error) {
      console.error("미션 완료 오류:", error);
      alert("미션 완료에 실패했습니다.");
    }
  };  

  // 소비 내역 미션 핸들러
  const handleUploadReceipt = async () => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("토큰을 찾을 수 없습니다.");

      // 미션 목록 조회
      const response = await getMissionList(token);
      console.log("미션 목록:", response);

      const missionList = response?.missions;
      if (!Array.isArray(missionList)) {
        throw new Error("미션 목록이 배열이 아닙니다.");
      }
  
      // "소비 내역 업로드" 미션 찾기
      const receiptMission = missionList.find(mission => mission.missionType === "RECEIPT" && !mission.completed);
      console.log("소비 내역 업로드 미션:", receiptMission);

      if (receiptMission) {
        const missionId = receiptMission.id;  // 미션 ID
        console.log("Completing mission with ID:", missionId);
  
        // 사용자에게 이미지 선택 UI를 제공
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log(result);
    
        if (result.canceled) {
          alert("이미지 선택이 취소되었습니다.");
          return;
        }
    
        // 선택된 이미지
        const receiptFile = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "receipt.jpg",
        };

        // 소비 내역 인증 미션 완료
        const verifyResponse = await verifyReceiptMission(token, receiptFile);
        console.log("소비 내역 업로드 응답:", verifyResponse);

        // 미션 완료 처리
        const missionCompletionResponse = await completeMission(token, missionId);
        console.log("미션 완료 응답:", missionCompletionResponse);

        // 소비 내역 미션 완료 상태 변경
        setIsConsumeMissionCompleted(true);
        handleCheckMissionForBadge(missionId);
        alert("소비 내역 인증이 완료되었습니다!");
      } else {
        alert("소비 내역 업로드 미션이 완료되었거나 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("소비 내역 업로드 오류:", error);
      alert("소비 내역 업로드에 실패했습니다.");
    }
  };

  // 텀블러 인증 핸들러
  const handleUseTumbler = async () => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("토큰을 찾을 수 없습니다.");

      const response = await getMissionList(token);
      console.log("미션 목록:", response);

      const missionList = response?.missions;
      if (!Array.isArray(missionList)) {
        throw new Error("미션 목록이 배열이 아닙니다.");
      }
    
      const tumblerMission = missionList.find(
        (mission) => mission.missionType === "TUMBLER" && !mission.completed
      );
      console.log("텀블러 인증 미션:", tumblerMission);

      if (!tumblerMission) {
        alert("텀블러 인증 미션이 완료되었거나 찾을 수 없습니다.");
        return;
      }
  
      // 카메라 실행하여 사진 찍기
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.assets || result.assets.length === 0) {
        alert("사진 촬영이 취소되었습니다.");
        return;
      }
  
    // 촬영된 이미지 압축 (해상도 줄이기 + 파일 크기 줄이기)
    const manipResult = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 800, height: 600 } }],  // 해상도를 800x600으로 줄임
      { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }  // 압축률 0.2로 조정
    );
  
      const tumblerFile = {
        uri: manipResult.uri,
        type: "image/jpeg",
        name: "tumbler.jpg",
      };
  
      // 텀블러 인증 API 호출 (form-data로 파일 전송)
      const tumblerResponse = await useTumblerMission(token, tumblerFile);
      console.log("텀블러 미션 완료 응답:", tumblerResponse);
  
      if (tumblerResponse === "미션 실패") {
        alert("텀블러 인증에 실패했습니다. 다시 시도해주세요.");
        return;
      }
  
      // 미션 완료 API 호출
      const missionCompletionResponse = await completeMission(token, tumblerMission.id);
      console.log("미션 완료 응답:", missionCompletionResponse);
  
      setIsTumblerMissionCompleted(true);
      handleCheckMissionForBadge(tumblerMission.id);
      alert("텀블러 인증 미션을 완료했습니다!");
    } catch (error) {
      console.error("텀블러 인증 미션 완료 오류:", error);
      alert("텀블러 인증 미션을 완료하지 못했습니다.");
      setIsTumblerMissionCompleted(false);
    }
  };
  
  // ✅ 권한을 미리 요청하는 useEffect 추가 (앱 실행 시 한 번만 실행)
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("카메라 권한이 필요합니다.");
      }
    })();
  }, []);

  return (
    <RNModal transparent={true} visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,  // 부모 크기에 맞게 배경을 설정
          backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 반투명 배경
          opacity: backgroundOpacity,  // 애니메이션 적용된 opacity
        }}
      />
      {/* 모달 컨텐츠 */}
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ModalWrapper>
          {/* 상단 드래그 핸들 */}
          <View {...panResponder.panHandlers}>
            <DragHandle />
          </View>

          {/* 상단 컨테이너 */}
          <TopContainer>
            <TextContainer>
            <Title>Today’s Mission</Title>
            <DateText>{`오늘은 ${formattedDate}이에요!`}</DateText>
          </TextContainer>
          <WateringIcon source={require("../assets/wateringcan.png")} />
          </TopContainer>

          <ModalContent>
            {/* 출석하기 */}
            <MissionItem 
              onPress={handleCheckAttendance}
              disabled={isAttendanceMissionCompleted}
            >
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>출석하고 물 받아가세요!</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 소비 내역 업로드 */}
            <MissionItem
              onPress={handleUploadReceipt}
              disabled={isConsumeMissionCompleted}
            >
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>소비 내역 인증하기</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 텀블러 사용 */}
            <MissionItem
              onPress={handleUseTumbler}
              disabled={isTumblerMissionCompleted}
            >
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>텀블러 사용하기</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 3000걸음 걷기 */}
            <MissionItem 
              onPress={handleCheckWalkMission}
              disabled={isStepMissionCompleted}
            >
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>
                {isStepMissionCompleted ? "3000보 걷기" : `3000보 걷기 (${steps}/3000)`}
              </MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 잔반 줄이기 */}
            {/* <MissionItem>
              <Circle><Icon source={require("../assets/fertilizer.png")} /></Circle>
              <MissionText>테스트</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem> */}
            {/* 5000걸음 이상 */}
            {/* <MissionItem>
              <Circle><Icon source={require("../assets/fertilizer.png")} /></Circle>
              <MissionText>테스트</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem> */}
          </ModalContent>
        </ModalWrapper>
      </Animated.View>

      {/* 뱃지 획득 시 Toast 표시 */}
      {showToast && <ToastAlarm badgeName={badgeMessage} />}
    </RNModal>
  );
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // "YYYY-MM-DD" 형태로 반환
};

export default Modal;