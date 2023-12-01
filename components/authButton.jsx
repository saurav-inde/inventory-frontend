import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AuthButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.authButton} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  authButton: {
    backgroundColor: "black",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});

export default AuthButton;
