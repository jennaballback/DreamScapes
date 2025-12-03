// app/(tabs)/profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../src/firebase";
import { useDbAuth as useAuth } from "../../src/context/AuthContext";

// A single dream row as used by the profile screen list
type DreamRow = {
  id: string;
  title?: string;
  text?: string;
  createdAt?: string | number | Date;
  userId?: string;
};

type StatItemProps = {
  label: string;
  value: string | number;
};

// Small stat pill
const StatItem = ({ label, value }: StatItemProps) => (
  <View className="items-center mr-4">
    <Text className="text-lg font-bold">{value}</Text>
    <Text className="text-gray-500 text-sm">{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [dreams, setDreams] = useState<DreamRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ entries: number }>({ entries: 0 });

  // Fetch dreams belonging only to the current user
  const fetchDreams = async () => {
    if (!user || !user.id) return;

    setLoading(true);
    try {
      const ownerId = user.id;

      // IMPORTANT:
      //  - use the same collection name you use when creating dreams ("dream_entry")
      //  - filter by userId so we only get this user's entries
      const qRef = query(
        collection(db, "dream_entry"),
        where("userId", "==", ownerId)
      );

      const snap = await getDocs(qRef);

      const fetched: DreamRow[] = snap.docs.map((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        return {
          id: docSnap.id,
          title: (data.title as string) ?? undefined,
          // In Create screen this field is called "dream_text"
          text: (data.dream_text as string) ?? undefined,
          // In Create screen this field is called "created_at"
          createdAt: (data.created_at as any) ?? undefined,
          userId: (data.userId as string) ?? undefined,
        };
      });

      setDreams(fetched);
      setStats((prev) => ({ ...prev, entries: fetched.length }));
    } catch (error) {
      console.log("Error fetching dreams:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when user changes (or first mounts)
  useEffect(() => {
    fetchDreams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const renderItem: ListRenderItem<DreamRow> = ({ item }) => (
    <TouchableOpacity
      className="mb-4 p-4 bg-blue-100 rounded-lg shadow"
      onPress={() => router.push(`/dreamentry/${item.id}`)}
    >
      <Text className="text-lg font-bold">
        {item.title ?? "Untitled dream"}
      </Text>
      {item.text ? (
        <Text className="text-gray-600 mt-1" numberOfLines={2}>
          {item.text}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-blue-500">
          Please log in to view your profile.
        </Text>
      </View>
    );
  }

  // ---- Safe user fields (no password) ----
  const u: any = user;
  const rawPhotoURL: string | undefined = u.photoURL;

  // Only use http/https URLs as "real" photos on web.
  const safePhotoURL =
    typeof rawPhotoURL === "string" &&
    (rawPhotoURL.startsWith("http://") || rawPhotoURL.startsWith("https://"))
      ? rawPhotoURL
      : null;

  const firstName: string | undefined = u.firstName;
  const lastName: string | undefined = u.lastName;

  const usernameToShow: string =
    (typeof u.username === "string" && u.username.length > 0
      ? u.username
      : u.displayName) ||
    (u.email ? u.email.split("@")[0] : "User");

  const fullNameToShow: string =
    firstName || lastName
      ? `${firstName ?? ""} ${lastName ?? ""}`.trim()
      : u.email ?? "";

  const initials =
    `${(firstName?.[0] ?? "").toUpperCase()}${(lastName?.[0] ?? "").toUpperCase()}` ||
    usernameToShow[0]?.toUpperCase() ||
    "?";

  return (
    <View className="flex-1 px-4 py-6">
      {/* Header */}
      <View className="items-center mb-6">
        {/* Profile picture circle */}
        <View className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 items-center justify-center">
          {safePhotoURL ? (
            <Image
              source={{ uri: safePhotoURL }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-3xl font-bold text-slate-600">
              {initials}
            </Text>
          )}
        </View>

        {/* Username (immediately under the picture) */}
        <Text className="mt-3 text-xl font-semibold">{usernameToShow}</Text>

        {/* First + last name under username */}
        {fullNameToShow ? (
          <Text className="text-gray-600">{fullNameToShow}</Text>
        ) : null}
      </View>

      {/* Stats */}
      <View className="flex-row mb-4">
        <StatItem label="Entries" value={stats.entries} />
      </View>

      {/* Dream list (filtered to this user via userId) */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList<DreamRow>
          data={dreams}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          onRefresh={fetchDreams}
          refreshing={loading}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              No dreams yet.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default ProfileScreen;

