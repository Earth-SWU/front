import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import Svg, { Path } from "react-native-svg";
import Modal from "../components/Modal";

// 전체 컨테이너
const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: #fff;
`;

// 배경 이미지
const BackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${hp("100%")}px;
`;

// 프로필 컨테이너
const ProfileContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  position: absolute;
  top: ${hp("11%")}px;
  left: ${wp("5%")}px;
  gap: ${wp("4%")};
`;

// 프로필 이미지
const ProfileImg = styled.Image`
  width: ${wp("20%")}px;
  height: ${wp("20%")}px;
  border-radius: ${wp("20%") / 2}px;
  border-width: 2px;
  border-color: #36C597;
`;

// 프로필 우측 텍스트 컨테이너
const TextContainer = styled.View`
  top: ${hp("1.5%")}px;
  gap: ${hp("0.5%")};
`;

// 사용자의 활동 텍스트
const TitleText = styled.Text`
  font-size: ${wp("5.5%")}px;
  font-weight: 700;
  font-family: "Inter-Bold";
  color: #404040;
  text-align: left;
`;

// 서브 텍스트
const SubtitleText = styled.Text`
  font-size: ${wp("3.5%")}px;
  font-weight: 500;
  font-family: "Inter-Medium";
  color: #8c8c8c;
  text-align: left;
`;

// 하단 컨테이너들
const ContentContainer = styled.View`
  top: ${hp("20%")}px;
  left: ${wp("5%")}px;
  margin-top: ${hp("2%")}px;
`;

// 사용자의 프로필 박스
const ProfileBox = styled.View`
  border-radius: 12px;
  background-color: rgba(54, 197, 151, 0.30);
  border: none;
  height: ${hp("8%")}px;
  width: ${wp("90%")}px;
  justify-content: space-between;
  flex-direction: row;
`;

const ItemWrapper = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: ${hp("2%")}px ${wp("3.5%")}px;
`;

// 뱃지 이미지
const Icons = styled.Image`
  width: ${wp("10%")}px;
  height: ${wp("10%")}px;
  resize-mode: contain;
  margin-right: ${wp("2%")}px;
`;

// 세로로 텍스트 배열
const TextWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
`;

// 뱃지 번호
const Num = styled.Text`
  font-size: ${wp("3.5%")}px;
  font-weight: 600;
  color: #404040;
  font-family: "Inter-SemiBold";
`;

// 뱃지 텍스트
const InnerText = styled.Text`
  font-size: ${wp("3.5%")}px;
  font-weight: 500;
  color: #8c8c8c;
`;

// 중간 선
const Line = styled.View`
  borderColor: #32B9B4;
  borderRightWidth: 1;
  margin-top: ${hp("1.5%")}px;
  height: ${hp("5%")}px;
`;

// 탄소 줄이기 목표치 텍스트
const GoalTitleText = styled.Text`
  left: ${wp("4%")}px;
  margin-bottom: ${hp("1%")}px;
  font-size: ${wp("5%")}px;
  font-weight: 700;
  font-family: "Inter-Bold";
  color: #404040;
  text-align: left;
`;

const GoalBox = styled.View`
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  height: ${hp("20.5%")}px;
  width: ${wp("90%")}px;
  padding: ${hp("2%")}px;
  gap: ${wp("0.2%")};
  justify-content: space-between;
`;

const GoalText = styled.Text`
  font-size: ${wp("3.8%")}px;
  font-weight: 500;
  font-family: "Inter-Medium";
  color: #404040;
`;

const GoalAmount = styled.Text`
  font-size: ${wp("4.8%")}px;
  font-weight: 600;
  font-family: "Inter-SemiBold";
  color: #404040;
`;

const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${hp("1%")}px;
`;

const GoalIcon = styled.Image`
  width: ${wp("7%")}px;
  height: ${hp("4%")}px;
  resize-mode: cover;
`;

const TopWrapper = styled.View`
  flex-direction: row;
`;

// 전체 프로그레스 바 (친환경 활동 요약)
const ProgressBarContainer = styled.View`
  background-color: #d1d1d1;
  height: ${hp("2%")}px;
  border-radius: ${hp("1.5%")}px;
  margin-top: ${hp("0.5%")}px;
  flex-direction: row;
  overflow: hidden;
`;

// 개별 항목 프로그레스 바
const ActivitySegment = styled.View`
  height: 100%;
`;

// 개별 항목 컨테이너
const ActivityRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${hp("0.5%")}px;
  padding: 0 ${wp("2%")}px;
`;

// 활동 색상을 나타내는 동그라미
const ActivityCircle = styled.View`
  width: ${wp("2.5%")}px;
  height: ${wp("2.5%")}px;
  border-radius: ${wp("2.5%") / 2}px;
  margin-right: ${wp("2%")}px;
`;

// 개별 항목 텍스트 (왼쪽 정렬)
const ActivityInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

// 개별 항목 텍스트
const ActivityText = styled.Text`
  font-size: ${wp("3%")}px;
  font-weight: 500;
  font-family: "Inter-Medium";
  color: #404040;
`;

const DateRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: left;
  gap: ${wp("3%")}px;
  margin-left:${wp("0.5%")}px;
  margin-bottom: ${hp("0.5%")}px;
`;

const DateText = styled.Text`
  font-size: ${wp("3.5%")}px;
  font-weight: 500;
  font-family: "Inter-Medium";
  color: #32b9b4;
  margin-left: ${wp("2%")}px;
`;

const MyPage = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation(); // 네비게이션 훅 사용
  const [name, setName] = useState("swuni")
  const [amount, setAmount] = useState(15); // 절감량
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const goal = 20;
  const badgeCount = 10;
  const completedMissions = 3;
  const totalMissions = 6;
  const currentLevel = 1;

  // 친환경 활동 데이터 예시
  const activities = [
    { name: "텀블러 사용하기", amount: 5, color: "#32B9B4" },
    { name: "대중교통 이용하기", amount: 3, color: "#80CECC" },
    { name: "잔반없는 식사하기", amount: 4, color: "#B9F1EF" },
    { name: "기타", amount: 3, color: "#D1D1D1" },
  ];

  const [modalVisible, setModalVisible] = useState(false);  // 모달의 표시 여부

  const showModal = () => {
    setModalVisible(true); // 모달 띄우기
  };

  const hideModal = () => {
    setModalVisible(false); // 모달 닫기
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "PartialSansKR": require("../assets/fonts/PartialSansKR.otf"),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  const handleArrowClick = (direction) => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth.getMonth() - 1); // 이전 달
    } else {
      newDate.setMonth(currentMonth.getMonth() + 1); // 다음 달
    }
    setCurrentMonth(newDate);
  };

  const formattedDate = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container>
        <BackgroundImage source={require("../assets/Background.png")} resizeMode="cover" />

        {/* 프로필 부분 */}
        <ProfileContainer>
          <ProfileImg resizeMode="contain" source={require('../assets/profile.png')}/>
          <TextContainer>
            <TitleText>{name}님의 활동</TitleText>
            <SubtitleText>한 달 간의 기록을 확인해보세요</SubtitleText>
          </TextContainer>
        </ProfileContainer>

        <ContentContainer>
          <ProfileBox>
            {/* 첫 번째 항목: 뱃지 */}
            <ItemWrapper onPress={() => navigation.navigate('BadgeCollection')}>
              <Icons source={require("../assets/badge.png")} />
              <TextWrapper>
                <Num>{badgeCount}</Num>
                <InnerText>Badge</InnerText>
              </TextWrapper>
            </ItemWrapper>

            <Line/>

            {/* 두 번째 항목: 미션 */}
            <ItemWrapper onPress={showModal}>
              <Icons source={require("../assets/mission.png")} />
              <TextWrapper>
                <Num>{`${completedMissions}/${totalMissions}`}</Num>
                <InnerText>Mission</InnerText>
              </TextWrapper>
            </ItemWrapper>

            <Line/>

            {/* 세 번째 항목: 레벨 */}
            <ItemWrapper>
              <Icons source={require("../assets/level.png")} />
              <TextWrapper>
                <Num>{currentLevel}</Num>
                <InnerText>Level</InnerText>
              </TextWrapper>
            </ItemWrapper>
          </ProfileBox>
        </ContentContainer>

        {/* 모달 컴포넌트 */}
        <Modal visible={modalVisible} onClose={hideModal} />

        <ContentContainer>
          <GoalTitleText>탄소 줄이기 목표치</GoalTitleText>
          <GoalBox>
            <GoalText>탄소 절감량</GoalText>
            <GoalAmount>{amount}/{goal}</GoalAmount>
            {[...Array(2)].map((_, rowIndex) => (
              <IconRow key={rowIndex}>
                {[...Array(10)].map((_, colIndex) => {
                  const index = rowIndex * 10 + colIndex + 1;
                  return (
                    <GoalIcon
                      key={index}
                      source={require("../assets/tree.png")}
                      opacity={index <= amount ? 1 : 0.3} // 절감량에 따라 투명도 조절
                    />
                  );
                })}
              </IconRow>
            ))}
          </GoalBox>
        </ContentContainer>

        <ContentContainer>
          <GoalTitleText>한 달 간의 활동</GoalTitleText>
          <GoalBox>
            {/* 날짜 및 월 이동 부분 추가 */}
            <DateRow>
              <TouchableOpacity onPress={() => handleArrowClick("prev")}>
                <Svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none">
                  <Path d="M8.44331 1.97666L3.4703 7.62134L8.44331 13.266L6.91232 15L0.397461 7.62134L6.91232 0.242676L8.44331 1.97666Z" fill="#D1D1D1"/>
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleArrowClick("next")}>
                <Svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none">
                  <Path d="M0.511719 1.97666L5.48472 7.62134L0.511719 13.266L2.04271 15L8.55756 7.62134L2.04271 0.242676L0.511719 1.97666Z" fill="#D1D1D1"/>
                </Svg>
              </TouchableOpacity>
            </DateRow>
            {/* 친환경 활동 통계 */}
            <TopWrapper>
              <GoalText>친환경 활동 통계</GoalText>
              <DateText>{formattedDate}</DateText>
            </TopWrapper>
            
            {/* 전체 프로그레스 바 (항목 비율 반영) */}
            <ProgressBarContainer>
              {activities.map((activity, index) => {
                const width = `${(activity.amount / goal) * 100}%`;
                return (
                  <ActivitySegment
                    key={index}
                    style={{ width, backgroundColor: activity.color }}
                  />
                );
              })}
            </ProgressBarContainer>

            {/* 개별 항목 설명 (색상 원 & % 표시) */}
            {activities.map((activity, index) => (
              <ActivityRow key={index}>
                <ActivityInfo>
                  {/* 색상 동그라미 */}
                  <ActivityCircle style={{ backgroundColor: activity.color }} />
                  {/* 항목명 */}
                  <ActivityText>{activity.name}</ActivityText>
                </ActivityInfo>
                {/* 절감 비율 % 표시 */}
                <ActivityText style={{ color: activity.color }}>
                  {(activity.amount / goal * 100).toFixed(1)}%
                </ActivityText>
              </ActivityRow>
            ))}
          </GoalBox>
        </ContentContainer>
    </Container>
  );
};

export default MyPage;