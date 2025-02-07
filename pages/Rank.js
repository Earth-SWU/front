import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import TabBar from "../components/TabBar";

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
  top: ${hp("7%")}px;
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

const Rank = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation(); // 네비게이션 훅 사용

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

      {/* 로고 */}
      <Header>
        <LogoText>EcoStep</LogoText>
      </Header>

    </Container>
  );
};

export default Rank;