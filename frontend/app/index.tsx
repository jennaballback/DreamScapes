import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { db } from "../src/firebase";

export default function HomeScreen() {
  useEffect(() => {
    console.log("Firebase project ID:", db.app.options.projectId);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18 }}>DreamScapes + Firebase ✅</Text>
    </View>
  );
}
