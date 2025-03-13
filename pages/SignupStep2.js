import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, Alert, Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import * as Font from "expo-font";

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

// 로고 부분
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

// 회원가입 폼 부분
const SigninForm = styled.View`
  position: absolute;
  top: ${hp("18%")}px;
  left: ${wp("8%")}px;
  gap: ${hp("1.2%")}px;
`;

// 질문 텍스트
const QuestionText = styled.Text`
  font-size: ${wp("4%")}px;
  letter-spacing: ${wp("-0.2%")}px;
  line-height: ${hp("2%")}px;
  font-weight: 900;
  font-family: "Inter-Black";
  color: #32b9b4;
  text-align: left;
`;

// 입력 필드 스타일
const InputField = styled.TextInput`
  width: 100%;
  background-color: #fff;
  border-radius: ${wp("5%")}px;
  border: 1px solid #32b9b4;
  padding-horizontal: ${wp("4%")}px;
  padding-vertical: ${hp("1.5%")}px;
  z-index: 1;
  height: ${hp("7%")}px;
  font-size: ${wp("4%")}px; // 텍스트 크기 조정
  color: #32b9b4; // 텍스트 색상 설정
`;

// 파일 업로드, 약관 동의 버튼 스타일
const ActionButton = styled(TouchableOpacity)`
  width: 100%;
  background-color: #fff;
  border-radius: ${wp("5%")}px;
  border: 1px solid #32b9b4;
  padding-horizontal: ${wp("4%")}px;
  padding-vertical: ${hp("1.5%")}px;
  z-index: 1;
  height: ${hp("7%")}px;
  justify-content: center;
  align-items: center;
`;

const TermsModal = styled.View`
  background-color: #fff;
  padding: ${hp('3%')}px ${wp('5%')}px;
  border-radius: 10px;
  width: ${wp('80%')}px;  /* 화면 너비의 80% */
  height: ${hp('60%')}px;  /* 화면 높이의 60% */
  position: absolute;
  top: 20%;
  left: 10%;
  z-index: 999;
  elevation: 5;
`;

const ModalBackground = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 배경을 어두운 색으로 처리 */
`;

const TermsText = styled.Text`
  font-size: ${hp('2.5%')}px;
  color: #333;
  margin-bottom: ${hp('2%')}px;
`;

const CheckBoxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${hp('2%')}px;
`;

const CheckBox = styled.TouchableOpacity`
  width: ${wp('5%')}px;
  height: ${wp('5%')}px;
  border-radius: 3px;
  border: 1px solid #32b9b4;
  margin-right: ${wp('2%')}px;
  background-color: ${({ checked }) => (checked ? "#32b9b4" : "#fff")};
`;

const AcceptButton = styled.TouchableOpacity`
  margin-top: ${hp('3%')}px;
  background-color: #32b9b4;
  padding: ${hp('2%')}px;
  border-radius: 5px;
  align-items: center;
`;

const AcceptButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const TermsContent = styled.Text`
  font-size: ${hp('2%')}px;
  color: #555;
`;

// 저장 버튼
const SubmitButton = styled.TouchableOpacity`
  position: absolute;
  top: ${hp("88%")}px;
  left: ${wp("8%")}px;
  border-radius: ${wp("5%")}px;
  background-color: #32b9b4;
  width: ${wp("85%")}px;
  height: ${hp("7%")}px;
  justify-content: center;
  align-items: center;
`;

// 저장 버튼 내부 텍스트
const SubmitButtonText = styled.Text`
  font-size: ${wp("5%")}px;
  line-height: ${hp("5%")}px;
  font-weight: 600;
  font-family: "Montserrat-SemiBold";
  color: #fff;
`;

const SignupStep2 = () => {
  // 미디어 라이브러리 접근 권한
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUrl, setImageUrl] = useState(null);

  // 앱 실행 시 권한 요청
  useEffect(() => {
    (async () => {
      if (!status?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const uploadImage = async () => {
    console.log("📸 Upload button pressed!");

    let permission = status;
    if (!status?.granted) {
      const newPermission = await requestPermission();
      permission = newPermission;
    }

    if (!permission?.granted) {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("📂 File Picker Result:", result);

    if (!result.canceled && result.assets.length > 0) {
      console.log("✅ Selected Image:", result.assets[0].uri);
      setImageUrl(result.assets[0].uri);
    } else {
      console.log("❌ User canceled image picker");
    }
  };

  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [value, setValue] = useState(null);
  const [subValue, setSubValue] = useState(null);
  // 상태 변수 추가
  const [schoolName, setSchoolName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [primaryField, setPrimaryField] = useState("");

  // 개인 변수 부분
  const [appPurpose, setAppPurpose] = useState("");  // 앱 사용 목적
  const [customPurpose, setCustomPurpose] = useState("");  // 직접 입력된 앱 사용 목적
  const [ecoActivity, setEcoActivity] = useState("");  // 최근 친환경 활동
  const [customEcoActivity, setCustomEcoActivity] = useState("");  // 직접 입력된 친환경 활동

  // 약관동의 변수
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPrivacyAccepted, setPrivacyAccepted] = useState(false);
  const [isMarketingAccepted, setMarketingAccepted] = useState(false);
  const [isServiceTermsAccepted, setServiceTermsAccepted] = useState(false); // 서비스 약관 동의
  const [isLocationAccepted, setLocationAccepted] = useState(false); // 위치 정보 동의
  const [isPushNotificationsAccepted, setPushNotificationsAccepted] = useState(false); // 푸시 알림 동의

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // Submit 버튼 활성화 조건 체크
  const isFormValid = 
    schoolName && 
    primaryField && 
    imageUrl && 
    isPrivacyAccepted &&
    isServiceTermsAccepted && 
    isLocationAccepted && 
    isPushNotificationsAccepted;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAccept = () => {
    if (
      isPrivacyAccepted &&
      isServiceTermsAccepted &&
      isLocationAccepted &&
      isPushNotificationsAccepted
    ) {
      setIsTermsAccepted(true);  // 약관 동의 완료 시 상태 변경
      setModalVisible(false);
    } else {
      alert("Please accept the terms and conditions.");
    }
  };

  const termButtonText = isTermsAccepted ? "All terms accepted" : "Please accept the terms";

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        PartialSansKR: require("../assets/fonts/PartialSansKR.otf")
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

      {/* 회원가입 폼 부분 */}
      <SigninForm>
        {/* 첫 번째 질문 */}
        <QuestionText>Are you a student, a company, or an individual?</QuestionText>
        <Dropdown
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: wp("5%"),
            borderWidth: 1,
            borderColor: "#32b9b4",
            paddingHorizontal: wp("4%"),
            paddingVertical: hp("1.5%"),
            height: hp("7%"),
          }}
          data={[
            { label: "Student", value: "student" },
            { label: "Company", value: "company" },
            { label: "Individual", value: "individual" },
          ]}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select"
          placeholderStyle={{ color: "#d1d1d1", fontSize: wp("4%") }}
          value={value}
          onChange={(item) => {
            setValue(item.value);
            setSubValue(null); // 선택 변경 시 추가 질문 초기화
          }}
        />

        {/* 학생, 기업, 개인에 선택에 따라 다른 질문들 */}
        {/* 1. 학생 */}
        {value === "student" && (
          <>
            {/* 두 번째 질문 */}
            <QuestionText>What is your school's name?</QuestionText>
            <Dropdown
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: wp("5%"),
                borderWidth: 1,
                borderColor: "#32b9b4",
                paddingHorizontal: wp("4%"),
                paddingVertical: hp("1.5%"),
                height: hp("7%"),
              }}
              data={[
                { label: "Engineering", value: "engineering" },
                { label: "Arts", value: "arts" },
                { label: "Science", value: "science" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Choose your school’s name"
              placeholderStyle={{ color: "#d1d1d1", fontSize: wp("4%") }}
              value={subValue}
              onChange={(item) => setSubValue(item.value)}
            />
            <InputField
              placeholder="Enter school’s name directly"
              value={schoolName}
              onChangeText={(text) => setSchoolName(text)}
            />
            {/* 세 번째 질문 */}
            <QuestionText>What is your primary field of study?</QuestionText>
            <InputField
              placeholder="Enter directly"
              value={primaryField}
              onChangeText={(text) => setPrimaryField(text)}
            />
            {/* 네 번째 질문 - 파일 업로드 */}
            <QuestionText>Please upload your student ID</QuestionText>
            <ActionButton onPress={uploadImage}>
              <Text style={{ color: "#32b9b4", fontSize: 16, fontWeight: "600" }}>
                {imageUrl ? "Image Selected" : "Upload student ID"}
              </Text>
            </ActionButton>

            {/* 다섯 번째 질문 - 약관 동의 */}
            <QuestionText>Please check the terms and conditions</QuestionText>
            <ActionButton onPress={toggleModal}>
              <Text style={{ color: "#32b9b4", fontSize: 16, fontWeight: "600" }}>
                {termButtonText}
              </Text>
            </ActionButton>
          </>
        )}

        {/* 2. 기업 */}
        {value === "company" && (
          <>
            {/* 두 번째 질문 */}  
            <QuestionText>What is your company’s name?</QuestionText>
            <Dropdown
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: wp("5%"),
                borderWidth: 1,
                borderColor: "#32b9b4",
                paddingHorizontal: wp("4%"),
                paddingVertical: hp("1.5%"),
                height: hp("7%"),
              }}
              data={[
                { label: "Engineering", value: "engineering" },
                { label: "Arts", value: "arts" },
                { label: "Science", value: "science" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Choose your company’s name"
              placeholderStyle={{ color: "#d1d1d1", fontSize: wp("4%") }}
              value={subValue}
              onChange={(item) => setSubValue(item.value)}
            />
            <InputField
              placeholder="Enter company’s name directly"
              value={companyName}
              onChangeText={(text) => setCompanyName(text)}
            />
            {/* 세 번째 질문 */}
            <QuestionText>What department are you in?</QuestionText>
            <InputField
              placeholder="Enter directly"
              value={primaryField}
              onChangeText={(text) => setPrimaryField(text)}
            />
            {/* 네 번째 질문 - 파일 업로드 */}
            <QuestionText>Please upload your Employee ID</QuestionText>
            <ActionButton onPress={uploadImage}>
              <Text style={{ color: "#32b9b4", fontSize: 16, fontWeight: "600" }}>
                {imageUrl ? "Image Selected" : "Upload employee ID"}
              </Text>
            </ActionButton>

            {/* 다섯 번째 질문 - 약관 동의 */}
            <QuestionText>Please check the terms and conditions</QuestionText>
            <ActionButton onPress={toggleModal}>
              <Text style={{ color: "#32b9b4", fontSize: 16, fontWeight: "600" }}>
                {termButtonText}
              </Text>
            </ActionButton>
          </>
        )}

        {/* 3. 개인 */}
        {value === "individual" && (
          <>
            {/* 두 번째 질문 */}
            <QuestionText>For what purpose do you use this app?</QuestionText>
            <Dropdown
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: wp("5%"),
                borderWidth: 1,
                borderColor: "#32b9b4",
                paddingHorizontal: wp("4%"),
                paddingVertical: hp("1.5%"),
                height: hp("7%"),
              }}
              data={[
                { label: "Engineering", value: "engineering" },
                { label: "Arts", value: "arts" },
                { label: "Science", value: "science" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select your purpose"
              placeholderStyle={{ color: "#d1d1d1", fontSize: wp("4%") }}
              value={appPurpose}
              onChange={(item) => setAppPurpose(item.value)}
            />
            <InputField
              placeholder="Enter directly"
              value={customPurpose}
              onChangeText={(text) => setCustomPurpose(text)}
            />
            {/* 세 번째 질문 */}
            <QuestionText>What eco-friendly activities do you do recently?</QuestionText>
            <Dropdown
              style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: wp("5%"),
                borderWidth: 1,
                borderColor: "#32b9b4",
                paddingHorizontal: wp("4%"),
                paddingVertical: hp("1.5%"),
                height: hp("7%"),
              }}
              data={[
                { label: "Engineering", value: "engineering" },
                { label: "Arts", value: "arts" },
                { label: "Science", value: "science" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select eco-friendly activity"
              placeholderStyle={{ color: "#d1d1d1", fontSize: wp("4%") }}
              value={ecoActivity}
              onChange={(item) => setEcoActivity(item.value)}
            />
            <InputField
              placeholder="Enter directly"
              value={customEcoActivity}
              onChangeText={(text) => setCustomEcoActivity(text)}
            />

            {/* 네 번째 질문 - 약관 동의 */}
            <QuestionText>Please check the terms and conditions</QuestionText>
            <ActionButton onPress={toggleModal}>
              <Text style={{ color: "#32b9b4", fontSize: 16, fontWeight: "600" }}>
                {termButtonText}
              </Text>
            </ActionButton>
          </>
        )}
      </SigninForm>

      {/* 약관 동의 모달 */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={toggleModal}>
          <ModalBackground />
        </TouchableWithoutFeedback>

        <TermsModal>
          <ScrollView contentContainerStyle={{ padding: hp('1%') }}><TermsText>
            <Text style={{ fontWeight: "bold" }}>Terms and Conditions</Text>
          </TermsText>

          
            <TermsContent>
              <Text style={{ fontWeight: "bold" }}>{"\n"}1. 개인정보 수집 및 이용 동의{"\n"}{"\n"}</Text>
              <Text>
                본 앱은 회원가입 및 서비스 제공을 위해 사용자님의 개인정보를 수집합니다.
                수집되는 개인정보는 이름, 이메일, 연락처 등이 포함됩니다.
                이 정보는 앱의 기능을 제공하고 사용자에게 맞춤형 서비스를 제공하기 위한 목적으로만 사용됩니다.{"\n"}
              </Text>
            </TermsContent>


            <CheckBoxContainer>
              <CheckBox
                checked={isPrivacyAccepted}
                onPress={() => setPrivacyAccepted(!isPrivacyAccepted)}
              />
              <Text>개인정보 수집 및 이용에 동의합니다.</Text>
            </CheckBoxContainer>

            <TermsContent>
              <Text style={{ fontWeight: "bold" }}>{"\n"}2. 서비스 이용 약관 동의{"\n"}{"\n"}</Text>
              <Text>
                본 앱을 사용함으로써, 사용자는 서비스 제공에 대한 규칙 및 조건을 준수해야 합니다. 본
                약관은 사용자가 앱을 사용하기 위한 기본 조건을 정의하며, 위반 시 서비스 제한 또는 계정
                정지가 될 수 있습니다.{"\n"}
              </Text>
            </TermsContent>

            <CheckBoxContainer>
              <CheckBox
                checked={isServiceTermsAccepted}
                onPress={() => setServiceTermsAccepted(!isServiceTermsAccepted)}
              />
              <Text>서비스 이용 약관에 동의합니다.</Text>
            </CheckBoxContainer>

            <TermsContent>
              <Text style={{ fontWeight: "bold" }}>{"\n"}3. 위치 정보 동의{"\n"}{"\n"}</Text>
              <Text>
                본 앱은 위치 기반 서비스를 제공하며, 사용자님의 위치 정보를 수집하여 서비스를 개선할 수
                있습니다. 위치 정보는 앱의 기능을 제공하는 데 사용됩니다.{"\n"}
              </Text>
            </TermsContent>

            <CheckBoxContainer>
              <CheckBox
                checked={isLocationAccepted}
                onPress={() => setLocationAccepted(!isLocationAccepted)}
              />
              <Text>위치 정보 수집에 동의합니다.</Text>
            </CheckBoxContainer>

            <TermsContent>
              <Text style={{ fontWeight: "bold" }}>{"\n"}4. 푸시 알림 동의{"\n"}{"\n"}</Text>
              <Text>
                본 앱은 사용자가 앱 내 알림을 받을 수 있도록 푸시 알림을 사용할 수 있습니다. 푸시 알림은
                중요 정보나 마케팅 알림 등을 포함할 수 있습니다.{"\n"}
              </Text>
            </TermsContent>

            <CheckBoxContainer>
              <CheckBox
                checked={isPushNotificationsAccepted}
                onPress={() => setPushNotificationsAccepted(!isPushNotificationsAccepted)}
              />
              <Text>푸시 알림을 수신하는 것에 동의합니다.</Text>
            </CheckBoxContainer>
            
            <TermsContent>
              <Text style={{ fontWeight: "bold" }}>{"\n"}5. 마케팅 활용 동의{"\n"}{"\n"}</Text>
              <Text>
                본 앱은 사용자의 개인정보를 마케팅 목적으로 활용할 수 있습니다. 사용자는 이메일, SMS
                등을 통해 마케팅 정보를 제공받을 수 있습니다. 마케팅 동의는 선택사항입니다.{"\n"}
              </Text>
            </TermsContent>

            <CheckBoxContainer>
              <CheckBox
                checked={isMarketingAccepted}
                onPress={() => setMarketingAccepted(!isMarketingAccepted)}
              />
              <Text>마케팅 정보 수신에 동의합니다. (선택)</Text>
            </CheckBoxContainer>

            <AcceptButton onPress={handleAccept}>
              <AcceptButtonText>Accept</AcceptButtonText>
            </AcceptButton>
          </ScrollView>
        </TermsModal>
      </Modal>

      {/* 저장 버튼 */}
      <SubmitButton disabled={!isFormValid} onPress={() => navigation.navigate("Home")}>
        <SubmitButtonText>Submit</SubmitButtonText>
      </SubmitButton>
    </Container>
  );
};

export default SignupStep2;
