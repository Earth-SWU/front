import React, { useState, useEffect } from "react";
import { Image, Text, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";

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
  font-size: ${wp("8%")}px;
  line-height: ${hp("8%")}px;
  font-family: "PartialSansKR";
  color: #32b9b4;
  text-align: left;
`;

// 로그인 필드 컨테이너
const LoginContainer = styled.View`
  position: absolute;
  top: ${hp("30%")}px;
  left: ${wp("8%")}px;
  width: ${wp("85%")}px;
  gap: ${hp("3%")}px;
  align-items: center;
  justify-content: center;
`;

// Get Started 텍스트
const TitleText = styled.Text`
  font-size: ${wp("8%")}px;
  font-weight: 900;
  font-family: "Montserrat-Black";
  color: #32b9b4;
  text-align: center;
`;

// 아이디 & 비밀번호 입력 필드
const InputContainer = styled.View`
  gap: ${hp("1.5%")}px;
  align-self: stretch;
`;

// 내부 필드
const InputField = styled.TextInput`
  background-color: #fff;
  border: 1px solid #32b9b4;
  border-radius: ${wp("5%")}px;
  padding: ${hp("2.5%")}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #32b9b4;
  font-size: ${wp("4%")}px;
  font-weight: 600;
  font-family: "Inter-SemiBold";
  text-align: left;
  width: ${wp("85%")}px;
`;

// 회원가입 & 비밀번호 찾기 
const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: ${wp("75%")}px;
  margin-left: ${hp("2.5%")}px;
`;

// 회원가입 & 비밀번호 찾기 텍스트
const ActionText = styled.Text`
  color: #32b9b4;
  font-family: "Inter-SemiBold";
  font-weight: 600;
  font-size: ${wp("4%")}px;
  cursor: pointer;
`;

// 로그인 버튼
const LoginButton = styled.TouchableOpacity`
  top: ${hp("2%")}px;
  border-radius: ${wp("5%")}px;
  background-color: #32b9b4;
  width: 100%;
  height: ${hp("8%")}px;
  justify-content: center;
  align-items: center;
`;

// 로그인 버튼 내부 텍스트
const LoginButtonText = styled.Text`
  font-size: ${wp("5%")}px;
  line-height: ${hp("5%")}px;
  font-weight: 600;
  font-family: "Montserrat-SemiBold";
  color: #fff;
`;

const LogIn = () => {
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

      {/* 로고 */}
      <Header>
        <LogoText>EcoStep</LogoText>
      </Header>

      {/* 로그인 입력 컨테이너 */}
      <LoginContainer>
        <TitleText>Log in</TitleText>

        {/* 로그인 입력 필드 */}
        <InputContainer>
          <InputField placeholder="your email" placeholderTextColor="#D1D1D1" />
          <InputField placeholder="password" placeholderTextColor="#D1D1D1" secureTextEntry />

          {/* 회원가입 & 비밀번호 찾기 감싸는 부분 */}
          <Wrapper>
            <ActionText onPress={() => navigation.navigate("SignupStep1")}>Sign up</ActionText>
            <ActionText onPress={() => navigation.navigate("ForgotPwd")}>Forgot password?</ActionText>
          </Wrapper>
        </InputContainer>

        {/* 로그인 버튼 */}
        <LoginButton onPress={() => navigation.replace("Main")}>
          <LoginButtonText>Log in</LoginButtonText>
        </LoginButton>
      </LoginContainer>
    </Container>
  );
};

export default LogIn;