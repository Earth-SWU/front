import React, { useState, useEffect } from "react";
import { Text, Alert, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
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

// Get Started 텍스트
const TitleText = styled.Text`
  font-size: ${wp("7%")}px;
  font-weight: 900;
  font-family: "Montserrat-Black";
  color: #32b9b4;
  text-align: center;
  margin-top: ${hp("2%")}px;
  margin-bottom: ${hp("2%")}px;
`;

const SigninForm = styled.View`
  position: absolute;
  top: ${hp("18%")}px;
  left: ${wp("8%")}px;
  gap: ${hp("1.2%")}px;
`;

const SigninWrapper = styled.View`
  gap: ${hp("1.2%")}px;
`;

const QuestionText = styled.Text`
  font-size: ${wp("4%")}px;
  font-weight: bold;
  color: #32b9b4;
`;

const InputField = styled.TextInput`
  width: ${wp("85%")}px;
  background-color: #fff;
  border-radius: ${wp("5%")}px;
  border: 1px solid #32b9b4;
  padding-horizontal: ${wp("4%")}px;
  height: ${hp("6.6%")}px;
  font-size: ${wp("4%")}px;
  color: #32b9b4;
`;

// 비밀번호 필드 컨테이너
const PasswordContainer = styled.View`
  position: relative;
`;

const EyeIcon = styled.TouchableOpacity`
  position: absolute;
  right: ${wp("4%")}px;
  top: ${hp("2%")}px;
`;

const WarningText = styled.Text`
  font-size: ${wp("3.5%")}px;
  color: red;
  margin-left: ${hp("1%")}px;
`;

const SuccessText = styled.Text`
  font-size: ${wp("3.5%")}px;
  color: green;
  margin-left: ${hp("1%")}px;
`;

const NextButton = styled.TouchableOpacity`
  position: absolute;
  left: ${wp("8%")}px;
  bottom: ${hp("5%")};
  background-color: ${props => props.disabled ? "#ccc" : "#32b9b4"};
  width: ${wp("85%")}px;
  height: ${hp("7%")}px;
  justify-content: center;
  align-items: center;
  border-radius: ${wp("5%")}px;
`;

const NextButtonText = styled.Text`
  color: #fff;
  font-size: ${wp("5%")}px;
`;

const SignupStep1 = () => {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [email, setEmail] = useState(""); // 이메일 상태로 변경
  const [primaryField, setPrimaryField] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // 핸드폰 번호 상태

  useEffect(() => {
    Font.loadAsync({
      PartialSansKR: require("../assets/fonts/PartialSansKR.otf"),
    }).then(() => setFontLoaded(true));
  }, []);

  const isPasswordValid = (pwd) => {
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    return pwd.length >= 8 && hasNumber.test(pwd) && hasSpecialChar.test(pwd);
  };

  const passwordsMatch = password === confirmPassword;

  const isFormValid = email && primaryField && isPasswordValid(password) && passwordsMatch && phoneNumber;

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS와 Android에 따라 다른 동작
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <BackgroundImage source={require("../assets/Background.png")} resizeMode="cover" />
          <Header>
            <LogoText>EcoStep</LogoText>
          </Header>

          <SigninForm>
            <TitleText>Get Started</TitleText>

            {/* 이메일 입력 */}
            <SigninWrapper>
              <QuestionText>이메일</QuestionText>
              <InputField 
                placeholder="이메일" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
              />
            </SigninWrapper>
            
            {/* 인증코드 입력 */}
            <SigninWrapper>
              <QuestionText>발송된 인증번호를 입력해주세요</QuestionText>
              <InputField 
                placeholder="인증번호" 
                value={primaryField} 
                onChangeText={setPrimaryField} 
                keyboardType="number-pad"
              />
            </SigninWrapper>
            

            {/* 비밀번호 입력 */}
            <SigninWrapper>
              <QuestionText>비밀번호</QuestionText>
              <PasswordContainer>
                <InputField
                  placeholder="비밀번호"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <EyeIcon onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#32b9b4" />
                </EyeIcon>
              </PasswordContainer>
              {!isPasswordValid(password) && password.length > 0 && (
                <WarningText>비밀번호는 8자 이상, 숫자 및 특수문자를 포함해야 합니다.</WarningText>
              )}

              {/* 비밀번호 확인 입력 */}
              <PasswordContainer>
                <InputField
                  placeholder="비밀번호 재입력"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <EyeIcon onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#32b9b4" />
                </EyeIcon>
              </PasswordContainer>
              {confirmPassword.length > 0 && (
                passwordsMatch
                  ? <SuccessText>비밀번호가 일치합니다.</SuccessText>
                  : <WarningText>비밀번호가 일치하지 않습니다.</WarningText>
              )}
            </SigninWrapper>

            <SigninWrapper>
              {/* 핸드폰 번호 입력 */}
              <QuestionText>전화번호</QuestionText>
              <InputField 
                placeholder="전화번호" 
                value={phoneNumber} 
                onChangeText={setPhoneNumber} 
                keyboardType="phone-pad"
              />
            </SigninWrapper>
            
          </SigninForm>

          {/* 다음 버튼 */}
          <NextButton disabled={!isFormValid} onPress={() => navigation.navigate("SelectTree")}>
            <NextButtonText>Next</NextButtonText>
          </NextButton>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupStep1;
