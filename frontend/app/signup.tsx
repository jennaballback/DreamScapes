import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { signUpWithEmail } from "../src/ts/auth";
import type { InterpretationPref } from "../src/types/UserProfile";

export default function SignUp() {
  const router = useRouter();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [interpretationPreference, setInterpretationPreference] =
    useState<InterpretationPref>("psychological");
  const [loading, setLoading]     = useState(false);

  useEffect(() => { if (user) router.replace("/"); }, [user]);

  const valid =
    firstName.trim() && lastName.trim() && username.trim() &&
    email.trim() && password.length >= 6 && password === confirm;

  const onSignUp = async () => {
    if (!valid) return Alert.alert("Check your input", "Fill all fields; password ≥ 6 and matches.");
    try {
      setLoading(true);
      await signUpWithEmail(
        email.trim(),
        password,
        firstName.trim(),
        lastName.trim(),
        username.trim(),
        interpretationPreference
      );
      Alert.alert("Account created", "User + profile created."); // temp feedback
  } catch (e: any) {
    console.log("SIGNUP ERROR:", e);
    Alert.alert("Sign up failed", e?.message ?? "Unknown error");
  } finally {
    setLoading(false);
  }
  };

  return (
    <View style={{ flex:1, padding:24, justifyContent:"center", gap:12 }}>
      <Text style={{ fontSize:28, fontWeight:"700" }}>Create your account</Text>

      <TextInput placeholder="First name" value={firstName} onChangeText={setFirstName}
        style={{ borderWidth:1, borderRadius:12, padding:12 }} />
      <TextInput placeholder="Last name" value={lastName} onChangeText={setLastName}
        style={{ borderWidth:1, borderRadius:12, padding:12 }} />
      <TextInput placeholder="Username" autoCapitalize="none" value={username} onChangeText={setUsername}
        style={{ borderWidth:1, borderRadius:12, padding:12 }} />
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail} style={{ borderWidth:1, borderRadius:12, padding:12 }} />
      <TextInput placeholder="Password (min 6)" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth:1, borderRadius:12, padding:12 }} />
      <TextInput placeholder="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm}
        style={{ borderWidth:1, borderRadius:12, padding:12 }} />

      {/* Preference toggle */}
      <View style={{ flexDirection:"row", gap:8, marginTop:4 }}>
        <TouchableOpacity
          onPress={() => setInterpretationPreference("psychological")}
          style={{ padding:10, borderRadius:10,
                   backgroundColor: interpretationPreference==="psychological" ? "#111827" : "#e5e7eb" }}>
          <Text style={{ color: interpretationPreference==="psychological" ? "white" : "black" }}>
            Psychological
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setInterpretationPreference("cultural_hindu")}
          style={{ padding:10, borderRadius:10,
                   backgroundColor: interpretationPreference==="cultural_hindu" ? "#111827" : "#e5e7eb" }}>
          <Text style={{ color: interpretationPreference==="cultural_hindu" ? "white" : "black" }}>
            Cultural (Hindu)
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onSignUp} disabled={loading}
        style={{ backgroundColor:"#111827", padding:14, borderRadius:12, alignItems:"center", marginTop:8 }}>
        <Text style={{ color:"white", fontWeight:"600" }}>{loading ? "Creating..." : "Sign Up"}</Text>
      </TouchableOpacity>
    </View>
  );
}