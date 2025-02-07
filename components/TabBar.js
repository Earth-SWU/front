import React, { useState, useEffect } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
import * as Font from "expo-font";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// 1. 랭킹 아이콘
const rankingSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
    <circle cx="18.5" cy="18.5" r="18.5" fill="#32B9B4"/>
    <path d="M13.3113 24.8314C12.8361 24.3561 13.0838 24.4901 11.9376 24.1833C11.4175 24.0439 10.9603 23.7759 10.5469 23.4549L8.06573 29.5382C7.82566 30.1272 8.27409 30.767 8.90955 30.743L11.791 30.6331L13.7729 32.7265C14.2104 33.188 14.9782 33.0442 15.2182 32.4552L18.0647 25.4761C17.4719 25.8064 16.814 26 16.1337 26C15.0673 26 14.0654 25.585 13.3113 24.8314ZM28.9343 29.5382L26.4531 23.4549C26.0397 23.7765 25.5825 24.0439 25.0624 24.1833C23.9102 24.4918 24.1628 24.3572 23.6887 24.8314C22.9346 25.585 21.9322 26 20.8658 26C20.1855 26 19.5276 25.8059 18.9348 25.4761L21.7812 32.4552C22.0213 33.0442 22.7896 33.188 23.2266 32.7265L25.209 30.6331L28.0904 30.743C28.7259 30.767 29.1743 30.1267 28.9343 29.5382ZM22.3828 23.5938C23.2184 22.7434 23.3141 22.8167 24.5041 22.4924C25.2637 22.2852 25.8576 21.6809 26.061 20.9076C26.4701 19.3545 26.364 19.5421 27.4801 18.4057C28.0363 17.8397 28.2534 17.0145 28.05 16.2412C27.6415 14.6892 27.6409 14.9058 28.05 13.3521C28.2534 12.5789 28.0363 11.7537 27.4801 11.1877C26.364 10.0513 26.4701 10.2383 26.061 8.68576C25.8576 7.91249 25.2637 7.30821 24.5041 7.10095C22.9794 6.68478 23.1632 6.79361 22.0459 5.65668C21.4897 5.09067 20.6787 4.86919 19.9191 5.07646C18.395 5.49207 18.6077 5.49262 17.0809 5.07646C16.3213 4.86919 15.5103 5.09013 14.9541 5.65668C13.8379 6.79306 14.0217 6.68478 12.4965 7.10095C11.7369 7.30821 11.143 7.91249 10.9395 8.68576C10.531 10.2383 10.6366 10.0513 9.5204 11.1877C8.96424 11.7537 8.74658 12.5789 8.95057 13.3521C9.35908 14.9031 9.35963 14.6865 8.95057 16.2407C8.74713 17.014 8.96424 17.8392 9.5204 18.4057C10.6366 19.5421 10.5305 19.3545 10.9395 20.9076C11.143 21.6809 11.7369 22.2852 12.4965 22.4924C13.7204 22.826 13.8117 22.7735 14.6172 23.5938C15.3407 24.3304 16.4678 24.4622 17.3374 23.9121C17.6851 23.6914 18.0884 23.5741 18.5003 23.5741C18.9121 23.5741 19.3155 23.6914 19.6632 23.9121C20.5322 24.4622 21.6593 24.3304 22.3828 23.5938ZM13.3408 14.6231C13.3408 11.723 15.6508 9.37207 18.5 9.37207C21.3492 9.37207 23.6592 11.723 23.6592 14.6231C23.6592 17.5231 21.3492 19.8741 18.5 19.8741C15.6508 19.8741 13.3408 17.5231 13.3408 14.6231Z" fill="white"/>
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
  left: ${wp("5%")}px;
  right: 0;
`;

const TabButton = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
`;

const AnimatedIcon = styled(Animated.View)`
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

  // 애니메이션 값 설정
  const scaleAnim = {
    Rank: useState(new Animated.Value(1))[0],
    Home: useState(new Animated.Value(1))[0],
    MyPage: useState(new Animated.Value(1))[0],
  };

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

  // 탭 변경 함수
  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    navigation.navigate('Main', { screen: tab });  // 수정된 부분

    // 아이콘 크기 애니메이션 실행 (아이콘이 커지고 유지됨)
    Animated.spring(scaleAnim[tab], {
      toValue: 1.8, // 커지는 크기
      useNativeDriver: true,
    }).start();

    // 다른 아이콘 크기를 원래대로 돌아가게 만드는 애니메이션
    Object.keys(scaleAnim).forEach((key) => {
      if (key !== tab) {
        Animated.spring(scaleAnim[key], {
          toValue: 1, // 크기 복원
          useNativeDriver: true,
        }).start();
      }
    });
  };

  return (
    <TabWrapper>
      {/* 랭킹 탭 */}
      <TabButton onPress={() => handleTabPress("Rank")}>
        <AnimatedIcon
          style={{
            transform: [
              { scale: scaleAnim.Rank },
              { translateY: selectedTab === "Rank" ? -hp("1.2%") : 0 },
            ],
          }}
        >
          <SvgXml xml={rankingSvg} width={selectedTab === "Rank" ? 45 : 32} height={selectedTab === "Rank" ? 45 : 32} />
        </AnimatedIcon>
        {selectedTab !== "Rank" && <TabLabel selected={selectedTab === "Rank"}>Rank</TabLabel>}
      </TabButton>

      {/* 홈 탭 */}
      <TabButton onPress={() => handleTabPress("Home")}>
        <AnimatedIcon
          style={{
            transform: [
              { scale: scaleAnim.Home },
              { translateY: selectedTab === "Home" ? -hp("1.2%") : 0 },
            ],
          }}
        >
          <SvgXml xml={homeSvg} width={selectedTab === "Home" ? 45 : 32} height={selectedTab === "Home" ? 45 : 32} />
        </AnimatedIcon>
        {selectedTab !== "Home" && <TabLabel selected={selectedTab === "Home"}>Home</TabLabel>}
      </TabButton>

      {/* 마이페이지 탭 */}
      <TabButton onPress={() => handleTabPress("MyPage")}>
        <AnimatedIcon
          style={{
            transform: [
              { scale: scaleAnim.MyPage },
              { translateY: selectedTab === "MyPage" ? -hp("1.2%") : 0 },
            ],
          }}
        >
          <SvgXml xml={myPageSvg} width={selectedTab === "MyPage" ? 45 : 32} height={selectedTab === "MyPage" ? 45 : 32} />
        </AnimatedIcon>
        {selectedTab !== "MyPage" && <TabLabel selected={selectedTab === "MyPage"}>My</TabLabel>}
      </TabButton>
    </TabWrapper>
  );
};

export default TabBar;