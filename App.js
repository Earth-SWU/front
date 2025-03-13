import "react-native-gesture-handler";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LogIn from "./pages/LogIn";
import Splash from "./pages/Splash";
import SelectTree from "./pages/SelectTree";
import Home from "./pages/Home";
import ForgotPwd from "./pages/ForgotPwd";
import Rank from "./pages/Rank";
import MyPage from "./pages/MyPage";
import TabBar from "./components/TabBar"; // 커스텀 TabBar
import SignupStep1 from "./pages/SignupStep1";
import SignupStep2 from "./pages/SignupStep2";
import Badge from "./pages/Badge";
import BadgeCollectionScreen from "./pages/BadgeCollectionScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const [selectedTab, setSelectedTab] = useState("Home");  // selectedTab 상태 추가

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <TabBar {...props} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      )}
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
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SignupStep1" component={SignupStep1} />
        <Stack.Screen name="SelectTree" component={SelectTree} />
        <Stack.Screen name="SignupStep2" component={SignupStep2} />
        <Stack.Screen name="ForgotPwd" component={ForgotPwd} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="Badge" component={Badge} />
        <Stack.Screen name="BadgeCollection" component={BadgeCollectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
