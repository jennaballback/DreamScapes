// app/(tabs)/profile.tsx
import React, { useEffect, useState } from "react";
import {View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, ListRenderItem,} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../src/firebase";
import { useDbAuth as useAuth } from "../../src/context/AuthContext";

// ---- Types ----
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

// ---- Screen ----
const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [dreams, setDreams] = useState<DreamRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ entries: number }>({ entries: 0 });

  // Fetch current user's dreams
  const fetchDreams = async () => {
    if (!user) return; // not logged in (or dev context not set yet)
    setLoading(true);
    try {
      // Adjust field name if your docs use a different one than "userId"
      const q = query(collection(db, "dreams"), where("userId", "==", user.id ?? user.uid ?? user.email));
      const snap = await getDocs(q);

      const fetched: DreamRow[] = snap.docs.map((doc) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          title: (data.title as string) ?? undefined,
          text: (data.text as string) ?? undefined,
          createdAt: (data.createdAt as any) ?? undefined,
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

  useEffect(() => {
    fetchDreams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Typed renderItem for FlatList
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
        <Text className="text-blue-500">Please log in to view your profile.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 py-6">
      {/* Header */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: user.photoURL ?? "https://i.pravatar.cc/120" }}
          style={{ width: 96, height: 96, borderRadius: 9999 }}
        />
        <Text className="mt-3 text-xl font-semibold">
          {user.displayName ?? user.email ?? "User"}
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row mb-4">
        <StatItem label="Entries" value={stats.entries} />
        {/* Add more StatItem components as you like */}
      </View>

      {/* List */}
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
