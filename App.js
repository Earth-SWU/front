import "react-native-gesture-handler";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LogIn from "./pages/LogIn";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import ForgotPwd from "./pages/ForgotPwd";
import Rank from "./pages/Rank";
import MyPage from "./pages/MyPage";
import TabBar from "./components/TabBar"; // 커스텀 TabBar

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
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ForgotPwd" component={ForgotPwd} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
