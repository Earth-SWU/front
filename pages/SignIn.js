import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import styled from "styled-components/native";
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

// 선택지 스타일
const DropdownWrapper = styled(Dropdown)`
  width: 100%;
  background-color: #fff;
  border-radius: ${wp("5%")}px;
  border: 1px solid #32b9b4;
  padding-horizontal: ${wp("4%")}px;
  padding-vertical: ${hp("1.5%")}px;
  z-index: 1;
  height: ${hp("7%")}px;
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

// 파일 업로드 버튼 스타일
const UploadButton = styled(TouchableOpacity)`
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

const SignIn = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [value, setValue] = useState(null);
  const [subValue, setSubValue] = useState(null);
  // 상태 변수 추가
  const [schoolName, setSchoolName] = useState("");
  const [primaryField, setPrimaryField] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false); // 약관 동의 상태
  const [selectedFile, setSelectedFile] = useState(null); // 업로드된 파일

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === "success") {
        setSelectedFile(result.uri);
      }
    } catch (error) {
      console.log("Error picking document", error);
    }
  };

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
        <DropdownWrapper
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
        {value === "student" && (
          <>
            {/* 두 번째 질문 */}
            <QuestionText>What is your school's name?</QuestionText>
            <DropdownWrapper
              data={[
                { label: "Engineering", value: "engineering" },
                { label: "Arts", value: "arts" },
                { label: "Science", value: "science" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="choese your school’s name"
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
            <TouchableOpacity onPress={handleDocumentPick}>
              <UploadButton>
                <Text style={{ color: "#32b9b4", fontSize: wp("4%"), fontWeight: "600" }}>
                  {selectedFile ? selectedFile : "Upload student ID"}
                </Text>
              </UploadButton>
            </TouchableOpacity>
            {/* 다섯 번째 질문 - 약관 동의 */}
            <QuestionText>Please check the terms and conditions</QuestionText>

          </>
        )}

        {value === "company" && (
          <>
            <QuestionText>What is your company’s name?</QuestionText>
            <DropdownWrapper
              data={[
                { label: "Tech", value: "tech" },
                { label: "Finance", value: "finance" },
                { label: "Healthcare", value: "healthcare" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select industry"
              value={subValue}
              onChange={(item) => setSubValue(item.value)}
            />
          </>
        )}

        {value === "individual" && (
          <>
            <QuestionText>For what purpose do you use this app?</QuestionText>
            <DropdownWrapper
              data={[
                { label: "Travel", value: "travel" },
                { label: "Fitness", value: "fitness" },
                { label: "Music", value: "music" },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select interest"
              value={subValue}
              onChange={(item) => setSubValue(item.value)}
            />
          </>
        )}
      </SigninForm>

      {/* 저장 버튼 */}
      <SubmitButton>
        <SubmitButtonText>Submit</SubmitButtonText>
      </SubmitButton>
    </Container>
  );
};

export default SignIn;
