import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  // GPT API 요청 함수
  const sendMessageToGPT = async (userMessage) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: userMessage }],
          temperature: 0.7,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API 오류:", error);
      return "죄송해요, 답변을 가져오는 데 문제가 발생했어요.";
    }
  };

  // 메시지 전송 핸들러
  const onSend = useCallback(async (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0].text;
    const botResponse = await sendMessageToGPT(userMessage);

    const botMessage = {
      _id: Math.random().toString(36).substring(7),
      text: botResponse,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "환경 챗봇",
        avatar: "https://cdn-icons-png.flaticon.com/512/2784/2784445.png",
      },
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
  }, []);

  return <GiftedChat messages={messages} onSend={(messages) => onSend(messages)} user={{ _id: 1 }} />;
};

export default ChatScreen;