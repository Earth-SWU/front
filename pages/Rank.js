import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import TabBar from "../components/TabBar";
import { ScrollView } from "react-native-gesture-handler";

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

// 로고
const Header = styled.View`
  position: absolute;
  top: ${hp("8%")}px;
  left: ${wp("8%")}px;
  width: ${wp("80%")}px;
`;

// 로고 텍스트
const LogoText = styled.Text`
  font-size: ${wp("6%")}px;
  line-height: ${hp("8%")}px;
  font-weight: 700;
  font-family: "Inter";
  color: #404040;
  text-align: left;
`;

// 사용자의 프로필 박스
const ProfileBox = styled.View`
  border-radius: 12px;
  background-color: #ffffff;
  border: none;
  height: ${hp("6%")}px;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: ${hp("1.5%")}px;
`;

// 랭킹 컨테이너
const RankContainer = styled.View`
    height: ${hp("68%")}px;
    width: ${wp("90%")}px;
    padding: ${hp("2%")}px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: rgba(253, 253, 253, 0.6);
    margin-left: ${wp("5%")}px;
    margin-top: ${hp("15%")}px;
`;

// 랭킹 1~3등 부분
const TopRankContainer = styled.View`
  position: absolute;
  height: ${hp("65%")}px;
  width: ${wp("50%")}px;
  align-items: center;
  justify-content: center;
`;

// 1~3등 박스
const TopRankBox = styled.View`
  align-items: center;
  justify-content: center;
  position: absolute;
  ${({ position }) =>
    position === 0
      ? `top: 10px; left: 58%; z-index: 2;`
      : position === 1
      ? `top: 65px; right: 30%;`
      : `top: 65px; left: 105%;`}
`;

// 1~3등 프로필 이미지 (크기 조건 추가)
const TopRankProfile = styled.Image`
  width: ${({ isFirstPlace }) => (isFirstPlace ? "120px" : "90px")};
  height: ${({ isFirstPlace }) => (isFirstPlace ? "120px" : "90px")};
  border-radius: 50px;
  margin-bottom: 5px;
  z-index: ${({ isFirstPlace }) => (isFirstPlace ? 2 : 1)}; // Make 1st place come to front
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
  width: 100%;
  height: 300px;
  margin-top: ${hp("25%")}px;
`;

// 4등~10등 텍스트 wrapper
const TextWrapper = styled.View`
  display: flex;
  align-items: center;
  margin-left: ${wp("5%")}px;
  gap: 10px;
  flex-direction: row;
`;

// 4등~10등 등수&프로필 이름 텍스트
const RankText = styled.Text`
  color: #404040;
  font-family: Inter;
  font-size: 14px;
  font-weight: 700;
`;

// 4등~10등 등수 프로필
const RankProfile = styled.Image`
  width: 28px;
  height: 28px;
  border-radius: 28px;
`;

// 4등~10등 level 퍼센트
const PercentText = styled.Text`
  color: #727272;
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
`;

const Rank = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation(); 

  // 랭킹 데이터 (임의 설정)
  const rankings = [
    { rank: 1, name: "swuni", level: "99%", image: require("../assets/rank1.png") },
    { rank: 2, name: "개똥", level: "99%", image: require("../assets/rank2.png") },
    { rank: 3, name: "비타민부족", level: "99%", image: require("../assets/rank2.png") },
    { rank: 4, name: "뚜비두밥", level: "98%", image: require("../assets/profile.png") },
    { rank: 5, name: "자각몽마스터", level: "95%", image: require("../assets/profile.png") },
    { rank: 6, name: "마시멜로", level: "92%", image: require("../assets/profile.png") },
    { rank: 7, name: "코딩마스터", level: "88%", image: require("../assets/profile.png") },
    { rank: 8, name: "냥냥펀치", level: "85%", image: require("../assets/profile.png") },
    { rank: 9, name: "스페이스오디세이", level: "83%", image: require("../assets/profile.png") },
    { rank: 10, name: "무한도전", level: "80%", image: require("../assets/profile.png") },
  ];

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

  // 1~3등과 4~10등 데이터 분리
  const topRankings = rankings.slice(0, 3); 
  const otherRankings = rankings.slice(3);

  return (
    <Container>
      <BackgroundImage source={require("../assets/Background.png")} resizeMode="cover" />

      {/* 로고 */}
      <Header>
        <LogoText>랭킹</LogoText>
      </Header>

      <RankContainer>
        {/* 1~3등 상단 랭킹 */}
        <TopRankContainer>
          {topRankings.map((user, index) => (
            <TopRankBox key={user.rank} position={index}>
              <RankText>{user.rank}</RankText>
              <TopRankProfile source={user.image} resizeMode="contain" isFirstPlace={user.rank === 1}/>
              <RankText>{user.name}</RankText>
              <PercentText>Level {user.level}</PercentText>
            </TopRankBox>
          ))}
        </TopRankContainer>

        {/* 4~10등 리스트 */}
        <ScrollContainer>
          {otherRankings.map((user) => (
            <ProfileBox key={user.rank}>
              <TextWrapper>
                <RankText>{user.rank}</RankText>
                <RankProfile source={user.image} resizeMode="contain" />
                <RankText>{user.name}</RankText>
                <PercentText>Level {user.level}</PercentText>
              </TextWrapper>
            </ProfileBox>
          ))}
        </ScrollContainer>
      </RankContainer>
    </Container>
  );
};

export default Rank;
