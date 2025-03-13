import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity, Animated } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";
import TabBar from "../components/TabBar";
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

// 비료 + 물 컨테이너
const StatusContainer = styled.View`
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: ${hp("16%")};  /* 비료와 물의 컨테이너 위치를 화면 비율에 맞게 조정 */
  right: ${wp("5%")}; /* 오른쪽 간격 */
  gap: ${hp("1%")};  /* 요소 사이 간격을 비율로 */
`;

// 비료와 물 아래에 있는 원
const Circle = styled.View`
  width: ${wp("14%")}; /* 원의 크기를 화면 비율에 맞게 조정 */
  height: ${wp("14%")};
  border-radius: ${wp("10%")}; /* 원형을 만들기 위해 반지름을 크기 절반으로 */
  background-color: #fff;
  align-items: center;
  justify-content: center;
  position: relative;

  /* iOS 그림자 */
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: { width: 0, height: 4 }; 
  shadow-opacity: 0.25;
  shadow-radius: 4px;

  /* Android 그림자 */
  elevation: 4;
`;

// 비료와 물
const Status = styled.View`
  align-items: center;
  position: relative;
  margin-top: ${hp("2%")};  /* 상태들 간 간격을 비율로 조정 */
`;

// 비료와 물 아이콘
const Icon = styled.Image`
  width: ${wp("14%")};
  height: ${wp("14%")};
  position: absolute;
  top: -${hp("1.5%")};
  left: ${wp("0.2%")};  
`;

// 비료와 물 개수
const Count = styled.Text`
  font-size: ${wp("3%")}; 
  font-weight: 700;
  font-family: "Montserrat-Bold";
  color: #000;
  text-align: center;
  position: absolute;
  top: ${hp("4%")};
`;

// 식물 보이는 컨테이너
const ImageContainer = styled.View`
  top: ${hp("42%")};
  align-items: center;
  justify-content: center;
`;

// 식물 이미지
const TreeImage = styled.Image`
  width: ${wp("90%")};
  height: ${wp("90%")};
  position: absolute;
  resize-mode: contain;  // 비율을 유지하면서 화면에 맞게 축소
`;

// 하단 컨테이너
const BottomContainer = styled.View`
  margin-left: ${wp("5%")};
  top: ${hp("58%")};
  width: ${wp("90%")};
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  shadow-color: rgba(31, 126, 123, 0.25);
  shadow-offset: 0 4px;
  shadow-radius: 17px;
  elevation: 17;
  shadow-opacity: 1;
`;

// 식물에 대한 정보들
const TreeInfo = styled.View`
  margin-left: ${wp("7%")};
  margin-right: ${wp("4%")};
  margin-bottom: ${hp("4.5%")};
  flex-direction: row;
`;

// 식물 이름
const TreeName = styled.Text`
  top: ${hp("3%")};
  margin-right: ${wp("2.5%")};
  font-family: "Montserrat-Bold";
  font-weight: 700;
  font-size: 18px;
  color: #000;
`;

// 레벨 프레임
const FrameWrapper = styled.View`
  background-color: #C3F5F3;
  width: ${wp("16%")};
  height: ${hp("3%")};
  top: ${hp("2.8%")};
  border-radius: ${wp("10%")};
  align-items: center;
  justify-content: center;
`;

// 레벨 텍스트
const TreeLevel = styled.Text`
  font-family: "Montserrat-Bold";
  font-weight: 700;
  font-size: 14px;
  color: #32b9b4;
`;

// 레벨 퍼센트
const WateringPercentage = styled.Text`
  font-family: "Montserrat-Bold";
  font-weight: 700;
  font-size: 18px;
  color: #000;
  position: absolute;
  right: ${wp("4%")};
  top: ${hp("3%")};
`;

// 프로그레스 바의 배경
const ProgressBar = styled.View`
  background-color: #d1d1d1;
  height: ${hp("2.5%")};
  border-radius: ${hp("5%")};
  margin-left: ${wp("5%")};
  margin-right: ${wp("5%")};
  margin-bottom: ${hp("2.5%")};
  overflow: hidden;
`;

// 실제로 채워진 진행 부분
const ProgressFill = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #32b9b4;
  height: 100%;
  width: ${props => props.width}%;  // 퍼센트 값으로 동적으로 width를 설정
  border-radius: ${hp("1%")};
`;

// 오늘의 미션 컨테이너
const MissionContainer = styled(TouchableOpacity)`
  margin-left: ${wp("5%")};
  margin-right: ${wp("5%")};
  margin-bottom: ${hp("3%")};
  border-radius: 10px;
  background: #C3F5F3;
  flex-direction: row;
`;

// 미션 왼쪽 부분 텍스트 컨테이너
const MissionTextContainer = styled.View`
  flex-direction: column;
  margin-right: ${wp("10%")}; 
`;

// 오늘의 미션 제목
const MissionTitle = styled.Text`
  font-family: "Montserrat-Bold";
  font-weight: 700;
  font-size: 16px;
  color: #000;
  margin-top: ${hp("2%")};
  margin-left: ${wp("4%")};
`;

// 미션 설명
const MissionDescription = styled.Text`
  font-size: 12px;
  font-family: "Montserrat-Medium";
  color: #000;
  margin-top: ${hp("0.5%")};
  margin-bottom: ${hp("2%")};
  margin-left: ${wp("4%")};
`;

// 물뿌리개 아이콘
const WateringIcon = styled.Image`
  width: ${wp("17%")};
  height: ${wp("17%")};
  margin-left: ${wp("8%")};
`;

const Home = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation(); // 네비게이션 훅 사용
  const [fertilizerCount, setFertilizerCount] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [level, setLevel] = useState(1);  // 레벨 단계
  const [showMission, setShowMission] = useState(false); // 미션 창 보이기 여부
  const [progress, setProgress] = useState(50);  // 진행 상태
  const name = "swuni";

  const [modalVisible, setModalVisible] = useState(false);  // 모달의 표시 여부

  const showModal = () => {
    setModalVisible(true); // 모달 띄우기
  };

  const hideModal = () => {
    setModalVisible(false); // 모달 닫기
  };

  // 각 레벨에 맞는 이미지 배열 (이미지 파일을 프로젝트에 넣고 경로 설정)
  const imageSources = [
    require("../assets/splash1.png"),  // 레벨 1 이미지
    require("../assets/splash2.png"),  // 레벨 2 이미지
    require("../assets/splash3.png"),  // 레벨 3 이미지
    require("../assets/splash4.png"),  // 레벨 4 이미지
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

  return (
    <Container>
      <BackgroundImage source={require("../assets/Background.png")} resizeMode="cover" />

      {/* 로고 */}
      <Header>
        <LogoText>EcoStep</LogoText>
      </Header>

      {/* 오른쪽 상단 컨테이너 */}
      <StatusContainer>
        {/* 비료
        <Status>
          <Circle/>
          <Icon source={require("../assets/fertilizer.png")} />
          <Count>{fertilizerCount}</Count>
        </Status> */}
        {/* 물 */}
        <Status>
          <Circle/>
          <Count>{waterCount}</Count>
          <Icon source={require("../assets/water.png")} />
        </Status>
      </StatusContainer>

      {/* 식물 보이는 컨테이너 */}
      <ImageContainer>
        {/* 레벨에 맞는 이미지를 보여줌 */}
        <TreeImage
          resizeMode="contain"
          source={imageSources[level - 1]}  // 레벨에 따라 이미지를 설정
        />
      </ImageContainer>

      {/* 하단 컨테이너 */}
      <BottomContainer>
        {/* 나무 정보 */}
        <TreeInfo>
          <TreeName>{name}'s Tree</TreeName>
          {/* 레벨 표시 */}
          <FrameWrapper>
            <TreeLevel>Level {level}</TreeLevel>
          </FrameWrapper>
          <WateringPercentage>{progress}%</WateringPercentage>
        </TreeInfo>

        {/* 프로그레스 바 */}
        <ProgressBar>
          {/* 실제 진행 상태를 보여주는 부분 */}
          <ProgressFill width={progress} />
        </ProgressBar>

        {/* 오늘의 미션 */}
        <MissionContainer onPress={showModal}>
          <MissionTextContainer>
            <MissionTitle>Today's Mission</MissionTitle>
            <MissionDescription>미션을 수행하고 물을 받으세요!</MissionDescription>
          </MissionTextContainer>
          <WateringIcon source={require("../assets/wateringcan.png")} />
        </MissionContainer>
      </BottomContainer>

      {/* 모달 컴포넌트 */}
      <Modal visible={modalVisible} onClose={hideModal} />

      {/* 하단 탭 */}
      <TabBar/>
    </Container>
  );
};

export default Home;