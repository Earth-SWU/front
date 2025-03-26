import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { isLoggedIn, removeTokens } from "./Auth";
import { hasSelectedTree }from "./UserPreferences";
import LogIn from "./pages/LogIn";
import Splash from "./pages/Splash";
import SelectTree from "./pages/SelectTree";
import Home from "./pages/Home";
import ForgotPwd from "./pages/ForgotPwd";
import Rank from "./pages/Rank";
import MyPage from "./pages/MyPage";
import TabBar from "./components/TabBar";
import SignupStep1 from "./pages/SignupStep1";
import SignupStep2 from "./pages/SignupStep2";
import BadgeCollectionScreen from "./pages/BadgeCollectionScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>}
      screenOptions={{
        headerShown: false, // 상단 제목 바 숨기기
        tabBarLabel: () => null, // 탭 이름 숨기기
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Rank" component={Rank} />
      <Tab.Screen name="MyPage" component={MyPage} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedInState, setIsLoggedInState] = useState(null);
  const [hasTree, setHasTree] = useState(null);

  // 로그인 버튼을 눌렀을 때 로그인 상태를 확인하는 함수
  const checkLoginStatus = async () => {
    const loggedIn = await isLoggedIn(); // 로그인 상태 확인
    const treeSelected = await hasSelectedTree(); // 나무 선택 여부 확인
    setIsLoggedInState(loggedIn); // 로그인 상태 업데이트
    setHasTree(treeSelected); // 나무 선택 여부 업데이트
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedInState ? (
          hasTree ? (
            // 로그인 O + 나무 선택 O
            <>
              <Stack.Screen name="Main" component={BottomTabNavigator} />
              <Stack.Screen name="BadgeCollection" component={BadgeCollectionScreen} />
            </>
          ) : (
            // 로그인 O + 나무 선택 X
              <>
                <Stack.Screen name="SelectTree" component={SelectTree} />
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                <Stack.Screen name="BadgeCollection" component={BadgeCollectionScreen} />
              </>
            )
          ) : (
          // 로그인되지 않은 상태일 경우
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="LogIn">
            {() => <LogIn onLoginSuccess={checkLoginStatus} />}
            </Stack.Screen>
            <Stack.Screen name="SignupStep1" component={SignupStep1} />
            <Stack.Screen name="SignupStep2" component={SignupStep2} />
            <Stack.Screen name="ForgotPwd" component={ForgotPwd} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
