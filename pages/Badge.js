import React, { useState, useEffect } from "react";
import { Image, View, Text } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import TabBar from "../components/TabBar";
import BackButton from "../components/BackButton";

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

// 뱃지 컨테이너
const ImageContainer = styled.View`
  position: absolute;
  top: ${hp("20%")}px;
  width: ${wp("100%")}px;
  align-items: center;
  justify-content: center;
`;

// 뱃지 이미지
const BadgeImage = styled.Image`
  width: ${wp("72%")}px;
  height: ${wp("72%")}px;
  resize-mode: contain;
`;

// 텍스트 컨테이너
const TextContainer = styled.View`
  position: absolute;
  top: ${hp("54%")}px;
  width: ${wp("100%")}px;
  align-items: center;
  justify-content: center;
`;

// 뱃지 제목
const BadgeTitle = styled.Text`
  font-size: ${wp("6%")}px;
  font-weight: 900;
  font-family: "Inter-Black";
  color: #000;
  margin-top: ${hp("2%")}px;
  text-align: center;
`;

// 뱃지 설명
const BadgeDescription = styled.Text`
  font-size: ${wp("4%")}px;
  font-weight: 600;
  font-family: "Inter-SemiBold";
  color: #545454;
  text-align: center;
  margin-top: ${hp("1%")}px;
`;

// 친환경 활동 통계 컨테이너
const TopWrapper = styled.View`
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  height: ${hp("12%")}px;
  width: ${wp("90%")}px;
  padding: ${hp("2%")}px;
  justify-content: center;
  margin-top: ${hp("65%")}px;
  margin-left: ${wp("5%")}px;
`;

const GoalText = styled.Text`
  font-size: ${wp("4%")}px;
  font-weight: 700;
  font-family: "Inter";
  color: #000000;
  margin-bottom: ${hp("1%")}px;
`;

// 프로그레스 바 컨테이너
const ProgressBarContainer = styled.View`
  position: relative; // 상대 위치 지정
  background-color: #B9F1EF;
  height: ${hp("1.5%")}px;
  border-radius: ${hp("1.5%")}px;
  overflow: hidden;
`;

// 프로그레스 바 채워진 부분
const ProgressFill = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #B9F1EF;
  height: 100%;
  width: ${props => props.width}%;
`;

// 🔥 본인의 위치 표시 (동그라미)
const UserMarker = styled.View`
  position: absolute;
  top: -${hp("1.5%")}px; // 프로그레스 바 위에 배치
  left: ${props => props.position}%;
  width: ${hp("2%")}px;
  height: ${hp("2%")}px;
  background-color: #32B9B4;
  border-radius: 50%;
`;

// 🔥 본인 위치 위의 "You're here!" 텍스트
const MarkerText = styled.Text`
  position: absolute;
  top: -${hp("4%")}px;
  left: ${props => props.position}%;
  font-size: ${wp("3.5%")}px;
  font-weight: 700;
  color: #000;
`;

// 🔥 본인 위치 아래의 순위 텍스트
const RankText = styled.Text`
  position: absolute;
  top: ${hp("2%")}px;
  left: ${props => props.position}%;
  font-size: ${wp("3.5%")}px;
  font-weight: 700;
  color: #000;
`;

const Badge = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [userRank, setUserRank] = useState(10); // 예제: 상위 10%

  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "PartialSansKR": require("../assets/fonts/PartialSansKR.otf"),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container>
      <BackgroundImage source={require("../assets/Background.png")} resizeMode="cover" />

      <BackButton/>

      {/* 뱃지 */}
      <ImageContainer>
        <BadgeImage source={require("../assets/badge3.png")} resizeMode="contain"/>
      </ImageContainer>

      {/* 텍스트 */}
      <TextContainer>
        <BadgeTitle>텀블러 선구자</BadgeTitle>
        <BadgeDescription>플라스틱을 줄이는데에 앞서고 있어요!</BadgeDescription>
      </TextContainer>

      {/* 친환경 활동 통계 */}
      <TopWrapper>
        <GoalText>순위(%)</GoalText>
        <ProgressBarContainer>
          <ProgressFill width={100 - userRank} />

          {/* 🔥 본인의 위치 마커 */}
          <UserMarker position={100 - userRank} />
          <MarkerText position={100 - userRank}>You're here!</MarkerText>
          <RankText position={100 - userRank}>Top {userRank}%</RankText>
        </ProgressBarContainer>
      </TopWrapper>

      <TabBar />
    </Container>
  );
};

export default Badge;