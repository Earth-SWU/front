import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

// SVG 아이콘 컴포넌트
const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        top: 80,
        left: 25, 
        zIndex: 999,
      }}
      onPress={() => navigation.goBack()} // 이전 페이지로 돌아가기
    >
      <Svg xmlns="http://www.w3.org/2000/svg" width="12" height="21" viewBox="0 0 12 21" fill="none">
        <Path
          d="M12 2.4675L4.583 10.5L12 18.5325L9.7166 21L-3.85895e-07 10.5L9.7166 0L12 2.4675Z"
          fill="#D1D1D1"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default BackButton;