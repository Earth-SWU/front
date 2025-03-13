import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import * as Font from "expo-font";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// 1. 랭킹 아이콘
const rankingSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
    <circle cx="18.5" cy="18.5" r="18.5" fill="#32B9B4"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2725 13.0638C19.4777 12.8447 19.6034 12.5494 19.6034 12.2245C19.6034 11.5482 19.0585 11 18.3864 11C17.7143 11 17.1694 11.5482 17.1694 12.2245C17.1694 12.5434 17.2906 12.8338 17.4891 13.0517L13.9751 17.489L7.4019 15.2602C7.42291 15.1701 7.43402 15.0762 7.43402 14.9796C7.43402 14.3033 6.88914 13.7551 6.21701 13.7551C5.54487 13.7551 5 14.3033 5 14.9796C5 15.6559 5.54487 16.2041 6.21701 16.2041C6.23939 16.2041 6.26163 16.2035 6.28371 16.2023L8.80282 26H18.3868V13.449L18.388 13.449V26H27.7323L30.1884 16.2023C30.2102 16.2035 30.2322 16.2041 30.2542 16.2041C30.9264 16.2041 31.4712 15.6559 31.4712 14.9796C31.4712 14.3033 30.9264 13.7551 30.2542 13.7551C29.5821 13.7551 29.0372 14.3033 29.0372 14.9796C29.0372 15.0795 29.0491 15.1766 29.0715 15.2695L22.6893 17.489L19.2725 13.0638Z" fill="white"/>
  </svg>
`;

// 2. 홈 아이콘
const homeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
    <g clip-path="url(#clip0_202_922)">
      <circle cx="18.5" cy="18.5" r="18.5" fill="#32B9B4"/>
      <path d="M18.5 7L9 14V28H14.9375V19.8333H22.0625V28H28V14L18.5 7Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_202_922">
        <rect width="37" height="37" fill="white"/>
      </clipPath>
    </defs>
  </svg>
`;

// 3. 마이페이지 아이콘
const myPageSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
    <circle cx="18.5" cy="18.5" r="18.5" fill="white"/>
    <path d="M18.5 0C8.288 0 0 8.288 0 18.5C0 28.712 8.288 37 18.5 37C28.712 37 37 28.712 37 18.5C37 8.288 28.712 0 18.5 0ZM18.5 7.4C22.0705 7.4 24.975 10.3045 24.975 13.875C24.975 17.4455 22.0705 20.35 18.5 20.35C14.9295 20.35 12.025 17.4455 12.025 13.875C12.025 10.3045 14.9295 7.4 18.5 7.4ZM18.5 33.3C14.7445 33.3 10.3045 31.783 7.141 27.972C10.2675 25.53 14.208 24.05 18.5 24.05C22.792 24.05 26.7325 25.53 29.859 27.972C26.6955 31.783 22.2555 33.3 18.5 33.3Z" fill="#32B9B4"/>
  </svg>
`;

const TabWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: ${wp("5%")};
  position: absolute;
  width: ${wp("90%")}px;
  bottom: ${hp("5%")};
  left: ${wp("5%")};
  right: 0;
`;

const TabButton = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
`;

// 애니메이션 효과가 필요없으므로 Animated 대신 일반 View 사용
const IconWrapper = styled.View`
  align-items: center;
`;

const TabLabel = styled.Text`
  color: ${(props) => (props.selected ? "#32B9B4" : "#000")};
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
  font-family: "Montserrat-Bold";
  text-align: center;
  margin-top: ${hp("1%")};
`;

const TabBar = ({ selectedTab, setSelectedTab }) => {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const scaleAnim = useState(new Animated.Value(1.8))[0];

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

  // 탭 변경 시
  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    navigation.navigate("Main", { screen: tab });
  };

  return (
    <TabWrapper>
      {/* 랭킹 탭 */}
      <TabButton onPress={() => handleTabPress("Rank")}>
        <IconWrapper>
          <SvgXml xml={rankingSvg} width={32} height={32} />
        </IconWrapper>
        <TabLabel selected={selectedTab === "Rank"}>Rank</TabLabel>
      </TabButton>

      {/* 홈 탭 */}
      <TabButton onPress={() => handleTabPress("Home")}>
        <Animated.View
          style={{
            alignItems: "center",
            transform: [
              { scale: scaleAnim }, // 항상 1.8배 크기 유지
              { translateY: -hp("1.2%") }, // 항상 위로 살짝 이동
            ],
          }}
        >
          <SvgXml xml={homeSvg} width={45} height={45} />
        </Animated.View>
      </TabButton>

      {/* 마이페이지 탭 */}
      <TabButton onPress={() => handleTabPress("MyPage")}>
        <IconWrapper>
          <SvgXml xml={myPageSvg} width={32} height={32} />
        </IconWrapper>
        <TabLabel selected={selectedTab === "MyPage"}>My</TabLabel>
      </TabButton>
    </TabWrapper>
  );
};

export default TabBar;