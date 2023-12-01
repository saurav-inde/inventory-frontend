
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
const UserTypeSelectionScreen = ({ navigation }) => {
  const navigateToAuth = (isVendor) => {
    navigation.navigate("Auth", { isVendor });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.outlinedButton}
        onPress={() => navigateToAuth(false)}
      >
        <Text style={styles.outlinedButtonText}>I am buyer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filledButton}
        onPress={() => navigateToAuth(true)}
      >
        <Text style={styles.buttonText}>I am vendor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  outlinedButton: {
    width: "50%",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "black", // Change the color as needed
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  filledButton: {
    width: "50%",
    backgroundColor: "black", // Change the color as needed
    padding: 16,
    // padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white", // Text color for both buttons
    textAlign: "center",
    fontSize: 18,
  },
  outlinedButtonText: {
    color: "black", // Text color for both buttons
    textAlign: "center",
    fontSize: 18,
  },
});

export default UserTypeSelectionScreen;
