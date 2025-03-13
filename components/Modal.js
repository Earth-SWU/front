import React, { useState, useEffect, useRef } from "react";
import { Animated, PanResponder, View, Text, StyleSheet, Modal as RNModal, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Svg, { Path } from "react-native-svg";

// 모달 외부 스타일
const ModalWrapper = styled.View`
  background-color: #fff;
  width: 100%;
  border-radius: 20px;
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
  background-color: #effbfb;
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

const Modal = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const [startPos, setStartPos] = useState(0);

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

  const currentDate = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = months[currentDate.getMonth()];
  const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth()}월 ${currentDate.getDate()}일`; // 날짜를 형식에 맞게 변환

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
            <MissionItem>
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>출석하고 물 받아가세요!</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 소비 내역 업로드 */}
            <MissionItem>
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>소비 내역 인증하기</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 대중교통 이용 */}
            <MissionItem>
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>텀블러 사용하기</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 텀블러 사용 */}
            <MissionItem>
              <Circle><Icon source={require("../assets/water.png")} /></Circle>
              <MissionText>3000걸음 걷기</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 잔반 줄이기 */}
            <MissionItem>
              <Circle><Icon source={require("../assets/fertilizer.png")} /></Circle>
              <MissionText>Zero food waste at cafeteria</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 5000걸음 이상 */}
            <MissionItem>
              <Circle><Icon source={require("../assets/fertilizer.png")} /></Circle>
              <MissionText>Verify 5000 steps</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
          </ModalContent>
        </ModalWrapper>
      </Animated.View>
    </RNModal>
  );
};

export default Modal;