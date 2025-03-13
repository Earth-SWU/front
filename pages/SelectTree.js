import React, { useState, useEffect } from "react";
import { Text, Alert, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import TreeImg from '../assets/splash4.png';

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
  top: ${hp("22%")}px;
  font-size: ${wp("7%")}px;
  font-weight: 900;
  font-family: "Inter-Black";
  color: #32b9b4;
  text-align: center;
  margin-top: ${hp("2%")}px;
`;

// 식물 이미지
const TreeImage = styled.Image`
  margin-top: ${hp("29%")}px;
  width: ${wp("100%")};
  height: ${wp("100%")};
  position: absolute;
  resize-mode: contain;  // 비율을 유지하면서 화면에 맞게 축소
`;

const InputField = styled.TextInput`
  position: absolute;
  top: ${hp("74%")}px;
  left: ${wp("8%")}px;
  width: ${wp("85%")}px;
  background-color: #fff;
  border-radius: ${wp("5%")}px;
  border: 1px solid #32b9b4;
  padding-horizontal: ${wp("4%")}px;
  height: ${hp("7%")}px;
  font-size: ${wp("4%")}px;
  text-align: center;
  color: #32b9b4;
`;

const NextButton = styled.TouchableOpacity`
  position: absolute;
  top: ${hp("88%")}px;
  left: ${wp("8%")}px;
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

const SelectTree = () => {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [name, setName] = useState(""); // 이메일 상태로 변경
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

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <BackgroundImage source={require("../assets/Background.png")} resizeMode="cover" />
          <Header>
            <LogoText>EcoStep</LogoText>
          </Header>

            <TitleText>나무에 이름을 지어주세요</TitleText>

            <TreeImage resizeMode="contain" source={TreeImg}/>

            {/* 나무 이름 */}
            <InputField 
              placeholder="이름" 
              value={name} 
              onChangeText={setName} 
            />

          {/* 다음 버튼 */}
          <NextButton disabled={!name} onPress={() => navigation.navigate("Main")}>
            <NextButtonText>완료</NextButtonText>
          </NextButton>
        </Container>
      </TouchableWithoutFeedback>
  );
};

export default SelectTree;
