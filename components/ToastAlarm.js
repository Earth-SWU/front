import React, { useEffect, useState, useRef } from "react";
import { Animated, Image } from "react-native";
import styled from "styled-components/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Badge from "../assets/badge.png";

// 전체 알람 컨테이너 (애니메이션 적용)
const ToastContainer = styled(Animated.View)`
  position: absolute;
  top: ${hp("8.5%")}px;
  align-self: center;
  flex-direction: row;
  align-items: center;
  background-color: #baecd8;
  padding: ${hp("1%")}px ${wp("5%")}px;
  border-radius: ${wp("2.5%")}px;
  gap: ${wp("15%")}px;
  elevation: 5;
  shadow-color: black;
  shadow-opacity: 0.1;
  shadow-radius: ${wp("2.5%")}px;
  shadow-offset: { width: 0, height: 2 };
`;

// 아이콘과 텍스트를 감싸는 컨테이너
const AlarmContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${wp("1.8%")}px;
`;

// 아이콘 배경
const IconWrapper = styled.Image`
  border-radius: ${wp("1.5%")}px;
  width: ${wp("9%")}px;
  height: ${hp("4.5%")}px;
  justify-content: center;
  align-items: center;
`;

// 텍스트 스타일
const AlarmText = styled.Text`
  font-size: ${wp("3.6%")}px;
  font-weight: 500;
  font-family: "Inter-Medium";
  color: #3e916f;
  text-align: center;
`;

// 뱃지 이름 텍스트
const BadgeText = styled.Text`
  font-size: ${wp("4%")}px;
  font-weight: 700;
  font-family: "Inter-Bold";
  color: #545454;
  text-align: center;
`;

const ToastAlarm = ({ badgeName }) => {
  const slideAnim = useRef(new Animated.Value(-hp("12%"))).current; // 초기 위치: 화면 밖
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badgeName) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // 3초 후 토스트 숨김
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -hp("12%"),
          duration: 500,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      }, 3000);
    }
  }, [badgeName]);

  return isVisible ? (
    <ToastContainer style={{ transform: [{ translateY: slideAnim }] }}>
      <AlarmContent>
        <IconWrapper source={Badge} style={{ width: wp("9%"), height: hp("4.5%") }} />
        <AlarmText>뱃지를 획득했어요</AlarmText>
      </AlarmContent>
      <BadgeText>{badgeName}</BadgeText>
    </ToastContainer>
  ) : null;
};

export default ToastAlarm;