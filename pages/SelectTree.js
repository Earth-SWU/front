import React, { useState, useEffect } from "react";
import { Text, Alert, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView,ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import { setTreeName } from "../api/SignupApi";
import { getAccessToken } from "../Auth";
import { earnBeginnerBadge } from "../api/BadgeApi";
import TreeImg from '../assets/splash4.png';
import ToastAlarm from "../components/ToastAlarm";

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
  width: ${wp("85%")}px;
  margin-top: ${hp("68%")};
  margin-left: ${wp("8%")}px;
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
  background-color: ${props => props.disabled ? "#ccc" : "#32b9b4"};
  width: ${wp("85%")}px;
  height: ${hp("7%")}px;
  justify-content: center;
  align-items: center;
  border-radius: ${wp("5%")}px;
  margin-top: ${hp("5%")};
  margin-left: ${wp("8%")}px;
`;

const NextButtonText = styled.Text`
  color: #FFF;
  font-family: "Inter";
  font-size: ${wp("4%")}px;
`;

const SelectTree = () => {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [name, setName] = useState(""); // 나무 이름 상태
  const [badgeMessage, setBadgeMessage] = useState(""); // 획득한 뱃지 이름
  const [showToast, setShowToast] = useState(false); // Toast 표시 여부

  useEffect(() => {
    Font.loadAsync({
      PartialSansKR: require("../assets/fonts/PartialSansKR.otf"),
    }).then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  // 완료 버튼 클릭 시
  const handleNext = async () => {
    if (!name) return;
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("사용자 토큰을 찾을 수 없습니다.");
      }

      // 나무 이름 짓기 API 호출
      await setTreeName(token, name);

      // 비기너 뱃지 API를 한 번만 호출하고 그 결과를 상태에 저장
      const beginnerBadge = await earnBeginnerBadge(token);
      if (beginnerBadge) {
        setBadgeMessage(beginnerBadge);
        setShowToast(true);
      }

      // 토스트가 일정 시간 동안 표시된 후 Main 화면으로 이동 (예: 3초 딜레이)
      setTimeout(() => {
        navigation.navigate("Main");
      }, 3000);
    } catch (error) {
      Alert.alert("오류", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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

            {/* 완료 버튼 */}
            <NextButton disabled={!name} onPress={handleNext}>
              <NextButtonText>완료</NextButtonText>
            </NextButton>

            {/* 비기너 뱃지 획득 시 Toast 표시 */}
            {showToast && <ToastAlarm badgeName={badgeMessage} />}
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SelectTree;