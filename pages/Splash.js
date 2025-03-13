import React, { useState, useEffect } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import InfiniteScrollImages from "../components/InfiniteScrollImages";

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

// 로고+설명
const Header = styled.View`
  position: absolute;
  top: ${hp("8%")}px;
  left: ${wp("8%")}px;
  width: ${wp("80%")}px;
`;

// 로고 텍스트
const LogoText = styled.Text`
  font-size: ${wp("8%")}px;
  line-height: ${hp("8%")}px;
  font-family: "PartialSansKR";
  color: #32b9b4;
  text-align: left;
`;

// 설명 텍스트
const SloganText = styled.Text`
  font-size: ${wp("5%")}px;
  line-height: ${hp("4%")}px;
  font-weight: 700;
  font-family: "Montserrat-Bold";
  color: #32b9b4;
  text-align: left;
`;

// 시작 버튼 컨테이너
const StartButtonContainer = styled.View`
  position: absolute;
  top: ${hp("80%")}px;
  left: ${wp("12%")}px;
  width: ${wp("80%")}px;
`;

// 시작 버튼
const StartButton = styled.TouchableOpacity`
  border-radius: ${wp("5%")}px;
  background-color: #fff;
  width: 100%;
  height: ${hp("8%")}px;
  justify-content: center;
  align-items: center;
`;

// 시작 버튼 내부 텍스트
const StartButtonText = styled.Text`
  font-size: ${wp("5%")}px;
  line-height: ${hp("5%")}px;
  font-weight: 600;
  font-family: "Montserrat-SemiBold";
  color: #32b9b4;
`;

const Splash = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        PartialSansKR: require("../assets/fonts/PartialSansKR.otf"),
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

      {/* 로고 및 설명 */}
      <Header>
        <LogoText>EcoStep</LogoText>
        <SloganText>오늘도 친환경에</SloganText><SloganText>한 걸음 다가가는 생활!</SloganText>
      </Header>

      {/* 무한 스크롤 이미지 */}
      <InfiniteScrollImages />

      {/* 시작 버튼 */}
      <StartButtonContainer>
        <StartButton onPress={() => navigation.navigate("LogIn")}>
          <StartButtonText>Start</StartButtonText>
        </StartButton>
      </StartButtonContainer>
    </Container>
  );
};

export default Splash;