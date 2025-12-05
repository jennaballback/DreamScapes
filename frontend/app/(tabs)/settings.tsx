// app/(tabs)/settings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../src/firebase";
import { useDbAuth as useAuth } from "../../src/context/AuthContext";

const SettingsScreen = () => {
  const { user, signOut, updateUserProfileInContext } = useAuth();

  // Safety: handle null user just in case
  if (!user) {
    return (
      <View className="flex-1 bg-[#f6f7fb] items-center justify-center px-4">
        <Text className="text-gray-600 mb-3">
          You need to be logged in to view settings.
        </Text>
        <Text className="text-xs text-gray-400">
          Try logging in again from the Home page.
        </Text>
      </View>
    );
  }

  const u: any = user;

  // --- Local state for Edit Profile form ---
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [firstName, setFirstName] = useState<string>(u.firstName ?? "");
  const [lastName, setLastName] = useState<string>(u.lastName ?? "");
  const [username, setUsername] = useState<string>(u.username ?? "");
  const [email, setEmail] = useState<string>(u.email ?? "");
  const [password, setPassword] = useState<string>(u.password ?? "");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Appearance toggles (just UI for now)
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Dream data state
  const [clearingDreams, setClearingDreams] = useState(false);

  const fullName =
    firstName || lastName ? `${firstName} ${lastName}`.trim() : "DreamScapes user";

  const handleStartEditing = () => {
    setError(null);
    setSuccess(null);
    setEditing(true);
    setConfirmPassword("");
  };

  const handleCancelEditing = () => {
    // reset to existing user values
    setFirstName(u.firstName ?? "");
    setLastName(u.lastName ?? "");
    setUsername(u.username ?? "");
    setEmail(u.email ?? "");
    setPassword(u.password ?? "");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
    setEditing(false);
  };

  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedUser = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedUser || !trimmedEmail) {
      setError("First name, last name, username, and email are required.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedPass && trimmedPass !== trimmedConfirm) {
      setError("Password and confirm password do not match.");
      return;
    }

    try {
      setSaving(true);

      // Update Firestore document
      const userId = u.id;
      if (!userId) {
        throw new Error("Missing user document id; cannot update profile.");
      }

      const userRef = doc(db, "user", userId);
      const updates: any = {
        firstName: trimmedFirst,
        lastName: trimmedLast,
        username: trimmedUser,
        email: trimmedEmail,
      };

      // Only update password if user actually entered one
      if (trimmedPass) {
        updates.password = trimmedPass;
      }

      await updateDoc(userRef, updates);

      // Update AuthContext so rest of app sees new info
      updateUserProfileInContext({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        username: trimmedUser,
        email: trimmedEmail,
        ...(trimmedPass ? { password: trimmedPass } : {}),
      });

      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err?.message ?? "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Ask before clearing all dreams
  const confirmClearDreamEntries = () => {
    Alert.alert(
      "Clear dream entries",
      "This will permanently delete all dream entries associated with your account. This cannot be undone. Do you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: clearDreamEntries },
      ]
    );
  };

  // Actually delete dream_entry docs for this user
  const clearDreamEntries = async () => {
    try {
      setClearingDreams(true);

      const ownerId: string | undefined = u.id ?? u.uid ?? u.email;
      if (!ownerId) {
        throw new Error("Missing user identifier; cannot clear dream entries.");
      }

      const dreamsRef = collection(db, "dream_entry");
      const batch = writeBatch(db);
      let totalDeleted = 0;

      // Case 1: new entries using userId
      const qUserId = query(dreamsRef, where("userId", "==", ownerId));
      const snapUserId = await getDocs(qUserId);
      snapUserId.forEach((docSnap) => {
        batch.delete(docSnap.ref);
        totalDeleted += 1;
      });

      // Case 2: older entries stored as user == ownerId
      const qUserField = query(dreamsRef, where("user", "==", ownerId));
      const snapUserField = await getDocs(qUserField);
      snapUserField.forEach((docSnap) => {
        batch.delete(docSnap.ref);
        totalDeleted += 1;
      });

      // Case 3: very old entries stored as "user/<id>"
      const legacyKey = `user/${ownerId}`;
      const qLegacy = query(dreamsRef, where("user", "==", legacyKey));
      const snapLegacy = await getDocs(qLegacy);
      snapLegacy.forEach((docSnap) => {
        batch.delete(docSnap.ref);
        totalDeleted += 1;
      });

      console.log("clearDreamEntries -> ownerId:", ownerId, "to delete:", totalDeleted);

      if (totalDeleted === 0) {
        Alert.alert("No dream entries", "You do not have any dream entries to clear.");
        return;
      }

      await batch.commit();

      Alert.alert(
        "Dream entries cleared",
        `Deleted ${totalDeleted} dream entr${totalDeleted === 1 ? "y" : "ies"}.`
      );
    } catch (err: any) {
      console.error("Error clearing dream entries:", err);
      Alert.alert(
        "Error",
        err?.message ?? "There was a problem clearing your dream entries."
      );
    } finally {
      setClearingDreams(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f6f7fb] px-4 py-6"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Page heading */}
      <Text className="text-center text-xs tracking-[3px] text-gray-400 mb-1">
        SETTINGS
      </Text>

      <Text className="text-2xl font-bold text-center mb-6">
        Account & App
      </Text>

      {/* ACCOUNT SECTION */}
      <View className="bg-white rounded-2xl shadow-sm px-5 py-4 mb-6">
        <Text className="text-xs text-gray-500 mb-1">Logged in as</Text>
        <Text className="text-lg font-semibold">{fullName}</Text>
        {email ? (
          <Text className="text-sm text-gray-600 mb-4">{email}</Text>
        ) : null}

        {/* VIEW mode / EDIT mode */}
        {!editing ? (
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={handleStartEditing}
              className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200"
            >
              <Text className="text-gray-700 font-medium text-sm">
                Edit profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={signOut}
              className="px-4 py-2 rounded-full bg-gray-900 border border-gray-900"
            >
              <Text className="text-white font-medium text-sm">Sign out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-2">
            {/* Errors / success messages */}
            {error && (
              <Text className="text-red-600 text-xs mb-2">{error}</Text>
            )}
            {success && (
              <Text className="text-green-600 text-xs mb-2">{success}</Text>
            )}

            {/* First name */}
            <Text className="text-xs text-gray-600 mb-1">First name</Text>
            <TextInput
              className="mb-3 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor="#9ca3af"
            />

            {/* Last name */}
            <Text className="text-xs text-gray-600 mb-1">Last name</Text>
            <TextInput
              className="mb-3 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor="#9ca3af"
            />

            {/* Username */}
            <Text className="text-xs text-gray-600 mb-1">Username</Text>
            <TextInput
              className="mb-3 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800"
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />

            {/* Email */}
            <Text className="text-xs text-gray-600 mb-1">Email</Text>
            <TextInput
              className="mb-3 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9ca3af"
            />

            {/* Password */}
            <Text className="text-xs text-gray-600 mb-1">
              Password (leave blank to keep current)
            </Text>
            <TextInput
              className="mb-3 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800"
              value={password}
              onChangeText={setPassword}
              placeholder="New password"
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />

            {/* Confirm password */}
            <Text className="text-xs text-gray-600 mb-1">Confirm password</Text>
            <TextInput
              className="mb-4 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-800"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />

            {/* Buttons */}
            <View className="flex-row justify-end mt-1">
              <TouchableOpacity
                onPress={handleCancelEditing}
                disabled={saving}
                className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 mr-2"
              >
                <Text className="text-gray-700 font-medium text-sm">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={saving}
                className={`px-4 py-2 rounded-full ${
                  saving ? "bg-blue-300" : "bg-blue-600"
                }`}
              >
                <Text className="text-white font-medium text-sm">
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* APPEARANCE SECTION */}
      <View className="bg-white rounded-2xl shadow-sm px-5 py-4 mb-6">
        <Text className="text-base font-semibold mb-2">Appearance</Text>

        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-sm font-medium text-gray-800">
              Dark mode
            </Text>
            <Text className="text-xs text-gray-500">
              {Platform.OS === "web"
                ? "Future option to switch the site to a darker theme."
                : "Future option to use a darker app theme."}
            </Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-800">
              Larger text
            </Text>
            <Text className="text-xs text-gray-500">
              Make dream entries and UI text easier to read.
            </Text>
          </View>
          <Switch value={largeText} onValueChange={setLargeText} />
        </View>
      </View>

      {/* DREAM DATA SECTION – Clear dream entries with confirmation popup */}
<View className="bg-white rounded-2xl shadow-sm px-5 py-4 mb-6">
  <Text className="text-base font-semibold mb-2">Dream data</Text>
  <Text className="text-sm text-gray-600 mb-4">
    Remove all dream entries associated with your account.
    This action cannot be undone.
  </Text>

  {/* BUTTON → opens confirmation popup */}
  <TouchableOpacity
    disabled={clearingDreams}
    onPress={() => {
      Alert.alert(
        "Clear all dream entries?",
        "This will permanently delete every dream you've saved.\nThis CANNOT be undone.\n\nAre you sure?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, delete all",
            style: "destructive",
            onPress: clearDreamEntries, // <-- deletion only executes if confirmed
          },
        ]
      );
    }}
    className={`px-4 py-3 rounded-full border ${
      clearingDreams
        ? "bg-red-300 border-red-300"
        : "bg-red-50 border-red-500"
    }`}
  >
    <Text className="text-center text-red-700 font-semibold text-sm">
      {clearingDreams ? "Deleting..." : "Clear dream entries"}
    </Text>
  </TouchableOpacity>
</View>


      {/* SUPPORT / ABOUT SECTION */}
      <View className="bg-white rounded-2xl shadow-sm px-5 py-4">
        <Text className="text-base font-semibold mb-2">Support & About</Text>

        <Text className="text-sm text-gray-600 mb-3">
          DreamScapes is a place to track your dreams, explore patterns, and
          get gentle interpretations. If you notice any issues or have ideas,
          we would love to hear from you.
        </Text>

        <TouchableOpacity
          disabled
          className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 opacity-70"
        >
          <Text className="text-sm font-medium text-gray-700">
            Send feedback (coming soon)
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-400 mt-4">
          v0.1 • Settings prototype
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
