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

// 미션 왼쪽에 있는 아이콘 밑에 원
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

// 미션 왼쪽 아이콘(캘린더)
const CalendarIcon = styled.View`
  width: ${wp("16%")};
  height: ${wp("16%")};
  position: absolute;
  left: ${wp("7.3%")};
  bottom: -${wp("4.7%")};
`;

// 미션 왼쪽 아이콘들
const Icon = styled.View`
  width: ${wp("16%")};
  height: ${wp("16%")};
  position: absolute;
  left: ${wp("6.9%")};
  bottom: -${wp("4.8%")};
`;

// 미션 왼쪽 아이콘(사람)
const WalkIcon = styled.View`
  width: ${wp("16%")};
  height: ${wp("16%")};
  position: absolute;
  left: ${wp("6.2%")};
  bottom: -${wp("4.1%")};
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
  line-height: 14px;
  font-family: "Montserrat-Bold";
  font-weight: 700;
  color: #000;
  position: absolute;
  top: 25px;
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
  const formattedDate = `${monthName} ${currentDate.getDate()}, ${currentDate.getFullYear()}`; // 날짜를 형식에 맞게 변환

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
            <DateText>{`Today is ${formattedDate}!`}</DateText>
          </TextContainer>
          <WateringIcon source={require("../assets/wateringcan.png")} />
          </TopContainer>

          <ModalContent>
            {/* 출석하기 */}
            <MissionItem>
              <Circle />
              <CalendarIcon>
                {/* react-native-svg를 사용하여 SVG 렌더링 */}
                <Svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                  <Path d="M19.0809 2.33333H17.9046V0H15.5522V2.33333H6.14261V0H3.79021V2.33333H2.614C1.30842 2.33333 0.273359 3.38333 0.273359 4.66667L0.261597 21C0.261597 22.2833 1.30842 23.3333 2.614 23.3333H19.0809C20.3747 23.3333 21.4333 22.2833 21.4333 21V4.66667C21.4333 3.38333 20.3747 2.33333 19.0809 2.33333ZM19.0809 21H2.614V9.33333H19.0809V21ZM7.31882 14H4.96641V11.6667H7.31882V14ZM12.0236 14H9.67122V11.6667H12.0236V14ZM16.7284 14H14.376V11.6667H16.7284V14ZM7.31882 18.6667H4.96641V16.3333H7.31882V18.6667ZM12.0236 18.6667H9.67122V16.3333H12.0236V18.6667ZM16.7284 18.6667H14.376V16.3333H16.7284V18.6667Z" fill="#32B9B4" />
                </Svg>
              </CalendarIcon>
              <MissionText>Attendance and getting water</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 소비 내역 업로드 */}
            <MissionItem>
              <Circle />
              <Icon>
                {/* react-native-svg를 사용하여 SVG 렌더링 */}
                <Svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                  <Path d="M20.4169 4H4.28612C3.16705 4 2.27986 4.89 2.27986 6L2.26978 18C2.26978 19.11 3.16705 20 4.28612 20H20.4169C21.536 20 22.4333 19.11 22.4333 18V6C22.4333 4.89 21.536 4 20.4169 4ZM20.4169 18H4.28612V12H20.4169V18ZM20.4169 8H4.28612V6H20.4169V8Z" fill="#32B9B4" />
                </Svg>
              </Icon>
              <MissionText>Certification of consumption</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 대중교통 이용 */}
            <MissionItem>
              <Circle />
              <Icon>
                {/* react-native-svg를 사용하여 SVG 렌더링 */}
                <Svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                  <Path d="M12.3515 2.5C7.8954 2.5 4.28613 3 4.28613 6.5V16.5C4.28613 17.38 4.67932 18.17 5.29431 18.72V20.5C5.29431 21.05 5.74799 21.5 6.30248 21.5H7.31066C7.86515 21.5 8.31883 21.05 8.31883 20.5V19.5H16.3842V20.5C16.3842 21.05 16.8379 21.5 17.3924 21.5H18.4006C18.9551 21.5 19.4087 21.05 19.4087 20.5V18.72C20.0237 18.17 20.4169 17.38 20.4169 16.5V6.5C20.4169 3 16.8077 2.5 12.3515 2.5ZM18.0578 5.49H6.64526C7.19976 4.96 8.63136 4.5 12.3515 4.5C16.0717 4.5 17.5033 4.96 18.0578 5.49ZM18.4006 7.49V10.5H6.30248V7.49H18.4006ZM18.0578 17.23L17.7654 17.5H6.93763L6.64526 17.23C6.5142 17.12 6.30248 16.87 6.30248 16.5V12.5H18.4006V16.5C18.4006 16.87 18.1889 17.12 18.0578 17.23Z" fill="#32B9B4"/>
                  <Path d="M8.82292 16.5C9.65812 16.5 10.3352 15.8284 10.3352 15C10.3352 14.1716 9.65812 13.5 8.82292 13.5C7.98772 13.5 7.31066 14.1716 7.31066 15C7.31066 15.8284 7.98772 16.5 8.82292 16.5Z" fill="#32B9B4"/>
                  <Path d="M15.8801 16.5C16.7153 16.5 17.3924 15.8284 17.3924 15C17.3924 14.1716 16.7153 13.5 15.8801 13.5C15.0449 13.5 14.3679 14.1716 14.3679 15C14.3679 15.8284 15.0449 16.5 15.8801 16.5Z" fill="#32B9B4"/>
                </Svg>
              </Icon>
              <MissionText>Use public transportation</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 텀블러 사용 */}
            <MissionItem>
              <Circle />
              <Icon>
                {/* react-native-svg를 사용하여 SVG 렌더링 */}
                <Svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                  <Path d="M3.27795 2L5.30438 20.23C5.42537 21.23 6.27223 22 7.31065 22H17.3924C18.4308 22 19.2777 21.23 19.3987 20.23L21.4251 2H3.27795ZM17.3924 20L7.31065 20.01L6.19158 10H18.5014L17.3924 20ZM18.7333 8H5.96978L5.52618 4H19.1668L18.7333 8ZM12.3515 19C14.0251 19 15.376 17.66 15.376 16C15.376 14 12.3515 10.6 12.3515 10.6C12.3515 10.6 9.327 14 9.327 16C9.327 17.66 10.678 19 12.3515 19ZM12.3515 13.91C12.9463 14.82 13.3597 15.64 13.3597 16C13.3597 16.55 12.906 17 12.3515 17C11.797 17 11.3433 16.55 11.3433 16C11.3433 15.63 11.7567 14.81 12.3515 13.91Z" fill="#32B9B4"/>
                </Svg>
              </Icon>
              <MissionText>Use tumbler at campus cafe</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 잔반 줄이기 */}
            <MissionItem>
              <Circle />
              <Icon>
                {/* react-native-svg를 사용하여 SVG 렌더링 */}
                <Svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                  <Path d="M8.11671 13.1285L10.9698 10.2985L3.89245 3.28853C2.3197 4.84853 2.3197 7.37853 3.89245 8.94853L8.11671 13.1285ZM14.9521 11.3185C16.4946 12.0285 18.6622 11.5285 20.2652 9.93853C22.1908 8.02853 22.5638 5.28853 21.0818 3.81853C19.6099 2.35853 16.8475 2.71853 14.9118 4.62853C13.3088 6.21853 12.8047 8.36853 13.5205 9.89853L3.68074 19.6585L5.10226 21.0685L12.0486 14.1985L18.9848 21.0785L20.4064 19.6685L13.4701 12.7885L14.9521 11.3185Z" fill="#32B9B4"/>
                </Svg>
              </Icon>
              <MissionText>Zero food waste at cafeteria</MissionText>
              <ArrowIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27" fill="none">
                <Path d="M0.713867 23.8275L11.3072 13.5L0.713867 3.1725L3.97513 0L17.8528 13.5L3.97513 27L0.713867 23.8275Z" fill="#C2C2C2"/>
              </ArrowIcon>
            </MissionItem>
            {/* 5000걸음 이상 */}
            <MissionItem>
              <Circle />
              <WalkIcon>
                {/* react-native-svg를 사용하여 SVG 렌더링 */}
                <Svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                  <Path d="M16.6117 6.5625C17.9979 6.5625 19.1321 5.4375 19.1321 4.0625C19.1321 2.6875 17.9979 1.5625 16.6117 1.5625C15.2254 1.5625 14.0912 2.6875 14.0912 4.0625C14.0912 5.4375 15.2254 6.5625 16.6117 6.5625ZM11.9489 10.8125L8.42025 28.4375H11.0667L13.3351 18.4375L15.9816 20.9375V28.4375H18.502V19.0625L15.8555 16.5625L16.6117 12.8125C18.25 14.6875 20.7704 15.9375 23.5429 15.9375V13.4375C21.1485 13.4375 19.1321 12.1875 18.1239 10.4375L16.8637 8.4375C16.158 7.325 14.7465 6.875 13.5241 7.3875L7.16003 10.0625V15.9375H9.68047V11.6875L11.9489 10.8125Z" fill="#32B9B4"/>
                </Svg>
              </WalkIcon>
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