import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
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

// 프로필 컨테이너
const ProfileContainer = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  position: absolute;
  top: ${hp("15%")}px;
  left: ${wp("5%")}px;
  gap: ${wp("6%")};
`;

// 프로필 이미지
const ProfileImg = styled.Image`
  width: ${wp("26%")}px;
  height: ${wp("26%")}px;
  border-radius: ${wp("26%") / 2}px;
  border-width: 2px;
  border-color: #36C597;
`;

// 프로필 우측 텍스트 컨테이너
const TextContainer = styled.View`
  top: ${hp("2.5%")}px;
  gap: ${hp("0.5%")};
`;

// 사용자의 활동 텍스트
const TitleText = styled.Text`
  font-size: ${wp("5.5%")}px;
  font-weight: 700;
  font-family: "Inter-Bold";
  color: #404040;
  text-align: left;
`;

// 서브 텍스트
const SubtitleText = styled.Text`
  font-size: ${wp("3.5%")}px;
  font-weight: 500;
  font-family: "Inter-Medium";
  color: #8c8c8c;
  text-align: left;
`;

// 뱃지 제목 스타일
const BadgeTitle = styled.View`
    height: ${hp("6%")}px;
    width: ${wp("90%")}px;
    margin-top: ${hp("30%")}px;
    margin-left: ${wp("5%")}px;
    borderTopLeftRadius: 12px;
    borderTopRightRadius: 12px;
    background-color: rgba(50, 185, 180, 0.2);
    border-style: solid;
    border-color: rgba(50, 185, 180, 0.5);
    border-bottom-width: 1px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

// 뱃지 텍스트
const BadgeText = styled.Text`
    font-size: ${wp("4%")}px;
    font-weight: 500;
    font-family: "Inter-SemiBold";
    color: #32b9b4;
    text-align: left;
`;

// 뱃지 그리드 컨테이너 (여러 뱃지를 그리드로 배치)
const BadgeGrid = styled.View`
    height: ${hp("46%")}px;
    width: ${wp("90%")}px;
    padding: ${hp("2%")}px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: rgba(253, 253, 253, 0.6);
    margin-left: ${wp("5%")}px;
    margin-top: ${hp("0%")}px;
`;

// 각 뱃지 아이템 (터치 가능)
const BadgeItem = styled.TouchableOpacity`
    width: ${wp("30%")}px;
    height: ${wp("30%")}px;
    align-items: center;
    justify-content: center;
`;

// 뱃지 이미지
const BadgeImage = styled.Image`
  width: ${wp("24%")}px;
  height: ${wp("24%")}px;
  resize-mode: contain;
`;

const BadgeCollectionScreen = () => {
    const navigation = useNavigation();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [name, setName] = useState("swuni")

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

    // 6종류의 뱃지 키 배열
    const badgeKeys = ["1", "2", "3", "4", "5", "6"];
    // 획득한 뱃지 목록
    const acquiredBadges = ["3"];

    // 뱃지 이미지 매핑
    const badgeImages = {
        1: require("../assets/badge1.png"),
        2: require("../assets/badge2.png"),
        3: require("../assets/badge3.png"),
        4: require("../assets/badge4.png"),
        5: require("../assets/badge5.png"),
        6: require("../assets/badge6.png"),
        nobadge1: require("../assets/nobadge1.png"),
        nobadge2: require("../assets/nobadge2.png"),
        nobadge3: require("../assets/nobadge3.png"),
        nobadge4: require("../assets/nobadge4.png"),
        nobadge5: require("../assets/nobadge5.png"),
        nobadge6: require("../assets/nobadge6.png")
    };

    return (
        <Container>
            <BackgroundImage source={require("../assets/Background.png")} resizeMode="cover" />

            <BackButton/>

            {/* 프로필 부분 */}
            <ProfileContainer>
            <ProfileImg resizeMode="contain" source={require('../assets/profile.png')}/>
            <TextContainer>
                <TitleText>{name}님의 뱃지</TitleText>
                <SubtitleText>{acquiredBadges.length}개의 뱃지를 획득했어요</SubtitleText>
            </TextContainer>
            </ProfileContainer>

            <BadgeTitle>
                <BadgeText>뱃지</BadgeText>
            </BadgeTitle>

            <BadgeGrid>                
                {badgeKeys.map((key, index) => {
                const isAcquired = acquiredBadges.includes(key);
                // 획득한 경우 badge{key}.png, 미획득시 nobadge{key}.png
                const imageSource = isAcquired
                ? badgeImages[key]
                : badgeImages[`nobadge${key}`];
                return (
                    <BadgeItem
                        key={index}
                        onPress={() => {
                            if (isAcquired) {
                                navigation.navigate("Badge", { badgeKey: key });
                            }
                        }}
                        activeOpacity={isAcquired ? 0.7 : 1}  // 미획득 뱃지일 경우 클릭 효과 없애기
                        style={{ opacity: isAcquired ? 1 : 0.8 }}  // 미획득 뱃지는 불투명하게 처리
                    >
                    <BadgeImage source={imageSource} />
                    </BadgeItem>
                );
                })}
            </BadgeGrid>

            <TabBar/>
        </Container>
    );
};

export default BadgeCollectionScreen;
