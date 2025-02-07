import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import { Calendar } from "react-native-calendars";

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

const MyPage = () => {
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

        {/* 캘린더 추가 */}
        <View style={{ marginTop: hp("18%"), paddingHorizontal: wp("8%") }}>
            <Calendar
            // 기본 날짜 설정
            current={new Date().toISOString().split('T')[0]} // 오늘 날짜로 설정
            minDate={"2023-01-01"} // 캘린더 최소 날짜 설정
            onDayPress={(day) => {
                console.log("selected day", day);
            }}
            monthFormat={"yyyy MM"} // 월 포맷
            hideExtraDays={true} // 보이지 않는 날 숨기기
            theme={{
                selectedDayBackgroundColor: "#32b9b4", // 선택된 날의 배경색
                selectedDayTextColor: "#fff", // 선택된 날의 텍스트 색
                todayTextColor: "#32b9b4", // 오늘 날짜의 텍스트 색
                dayTextColor: "#000", // 일반적인 날의 텍스트 색
                arrowColor: "#32b9b4", // 화살표 색상
                monthTextColor: "#32b9b4", // 월 텍스트 색
                textSectionTitleColor: "#32b9b4", // 월 이름 텍스트 색
            }}
            />
        </View>
    </Container>
  );
};

export default MyPage;