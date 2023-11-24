import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { addNickname } from "../reducers/users";
import { useDispatch } from "react-redux";

export default function HomeScreen({ navigation }) {
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState("");
  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });
  if (!fontsLoaded) {
    return null;
  }

  const handlePress = () => {
    if (nickname.length === 0 || !nickname.trim()) {
      setErrorMsg("Please enter a nickname !");
      return;
    }
    dispatch(addNickname(nickname));
    setErrorMsg("");
    navigation.navigate("TabNavigator");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image
        style={styles.image}
        source={require("../assets/home-image.png")}
      />
      <Text style={styles.title}>Welcome to Locate Me</Text>
      <TextInput
        style={styles.input}
        placeholder="Nickname"
        onChangeText={(value) => setNickname(value)}
        value={nickname}
      />
      <Text style={styles.error}>{errorMsg.length > 0 && errorMsg}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress()}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Go to map</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 35,

    fontFamily: "Pacifico_400Regular",
  },
  image: {
    width: "100%",
    height: "60%",
  },
  input: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "#B733D0",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    width: "80%",
    backgroundColor: "#B733D0",
    borderRadius: 12,
  },
  textButton: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
});
