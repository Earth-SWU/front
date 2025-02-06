import React, { useEffect, useRef } from "react";
import { View, Image, Animated, StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

const images = [
    require("../assets/splash1.png"),
    require("../assets/splash2.png"),
    require("../assets/splash3.png"),
    require("../assets/splash4.png"),
];

const InfiniteScrollImages = () => {
    const scrollX = useRef(new Animated.Value(0)).current; // 스크롤 애니메이션을 위한 Animated Value

    useEffect(() => {
        // 애니메이션을 무한 반복하면서 스크롤 위치를 이동시키도록 설정
        const loopAnimation = () => {
            Animated.timing(scrollX, {
                toValue: width * images.length - 394, // 이동할 거리 (모든 이미지 합)
                duration: 12000, // 이동 시간
                useNativeDriver: false, // Native Driver를 사용하지 않음
            }).start(() => {
                scrollX.setValue(0); // 애니메이션 끝나면 다시 0으로 리셋
                loopAnimation(); // 재귀적으로 애니메이션 반복
            });
        };

        loopAnimation();
    }, []);

    // translateX를 설정하여 이미지들이 1, 2, 3, 4 순으로 자연스럽게 이동
    const translateX = scrollX.interpolate({
        inputRange: [0, width, width * 2, width * 3, width * 4, width * 5], // 각 이미지의 시작 위치
        outputRange: [0, -width, -width * 2, -width * 3, -width * 4, -width * 5], // 각 이미지의 끝 위치
        extrapolate: "clamp",
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.scrollContainer,
                    { transform: [{ translateX }] }, // translateX 적용하여 이동
                ]}
            >
                {[...images, ...images].map((img, index) => (
                    <Image key={index} source={img} style={styles.image} />
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        top: hp("30%"),
        width: wp("100%"),
        height: hp("40%"),
    },
    scrollContainer: {
        flexDirection: "row",
        width: wp("100%"),
    },
    image: {
        width: wp("75%"),
        height: hp("40%"),
        resizeMode: "contain",
    },
});

export default InfiniteScrollImages;
