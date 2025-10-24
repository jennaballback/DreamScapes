import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { signUpWithEmail } from "../src/services/auth";

export default function SignUp() {
  const router = useRouter();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [interpretationPreference, setInterpretationPreference] =
    useState<"psychological" | "cultural">("psychological");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // if logged in already, go home
  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  const valid = () => email.trim() && password.length >= 6 && password === confirm;

  const onSignUp = async () => {
    if (!valid()) {
      return Alert.alert(
        "Check your input",
        "Password must be at least 6 characters and match confirmation."
      );
    }
    try {
      setLoading(true);
      await signUpWithEmail(
        email.trim(),
        password,
        displayName.trim(),
        interpretationPreference
      );
      // onAuthStateChanged will redirect
    } catch (e: any) {
      Alert.alert("Sign up failed", e.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 8 }}>
        Create your account
      </Text>

      <TextInput
        placeholder="Display name"
        value={displayName}
        onChangeText={setDisplayName}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      {/* quick input for preference; you can replace with a toggle later */}
      <TextInput
        placeholder='Interpretation preference: "psychological" or "cultural"'
        autoCapitalize="none"
        value={interpretationPreference}
        onChangeText={(v) =>
          setInterpretationPreference(
            v === "cultural" ? "cultural" : "psychological"
          )
        }
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <TextInput
        placeholder="Password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />
      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <TouchableOpacity
        onPress={onSignUp}
        disabled={loading}
        style={{ backgroundColor: "#111827", padding: 14, borderRadius: 12, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {loading ? "Creating..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12 }}>
        <Text>Already have an account? </Text>
        <Link href="/login" style={{ fontWeight: "700" }}>
          Log in
        </Link>
      </View>
    </View>
  );
}
