// app/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { createUser } from "../src/services/dbAuth"; // <- from the file we wrote

export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);

  async function handleSignup() {
    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert("Missing info", "Please fill out all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await createUser({
        firstName,
        lastName,
        username,
        email,
        password, // dev only
        interpretationPreference: "psychological",
      });

      Alert.alert("Account created", "You can log in now.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-8">Create account</Text>

      <Text className="mb-2 text-gray-700">First name</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Anna"
      />

      <Text className="mb-2 text-gray-700">Last name</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Brooks"
      />

      <Text className="mb-2 text-gray-700">Username</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        placeholder="annab"
      />

      <Text className="mb-2 text-gray-700">Email</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="anna@example.com"
      />

      <Text className="mb-2 text-gray-700">Password</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <Text className="mb-2 text-gray-700">Confirm password</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        placeholder="••••••••"
      />

      <TouchableOpacity
        disabled={loading}
        onPress={handleSignup}
        className={`w-full py-4 rounded-xl ${loading ? "bg-gray-400" : "bg-indigo-500"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Create account</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600 mr-2">Already have an account?</Text>
        <Link href="/login" className="text-indigo-600 font-semibold">
          Log in
        </Link>
      </View>
    </View>
  );
}


/*// app/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { createUser } from "../src/services/dbAuth"; // <-- correct relative path from /app

export default function SignUp() {
  const router = useRouter();

  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [username, setUsername]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);

    // basic validation
    if (!firstName || !lastName || !username || !email || !password || !confirm) {
      setError("Please fill out all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const created = await createUser({
        firstName,
        lastName,
        username,
        email,
        password, // DEV-ONLY; will be replaced with Firebase Auth later
      });

      // minimal UX: toast/alert and go to Home tab
      Alert.alert("Account created", `Welcome, ${created.firstName}!`);
      router.replace("/"); // go Home (or router.replace("/login") if you want login next)
    } catch (e: any) {
      setError(e?.message ?? "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, backgroundColor: "white" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>Create account</Text>

      {error ? (
        <Text style={{ color: "crimson", marginBottom: 4 }}>{error}</Text>
      ) : null}

      <TextInput
        placeholder="First name"
        autoCapitalize="words"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last name"
        autoCapitalize="words"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        style={[
          styles.button,
          { opacity: loading ? 0.6 : 1 },
        ]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <Text style={{ textAlign: "center", marginTop: 8, opacity: 0.7 }}>
        By signing up you agree to our totally real terms 💜
      </Text>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center" as const,
    marginTop: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "700" as const,
    fontSize: 16,
  },
};
*/