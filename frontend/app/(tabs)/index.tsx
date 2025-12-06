// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/firebase";
import { useDbAuth as useAuth } from "../../src/context/AuthContext";

// ---------- Types & helpers (mirroring profile.tsx) ----------

type DreamRow = {
  id: string;
  title?: string;
  text?: string;
  createdAt?: any;
  dreamDate?: string;
  userId?: string;
  moods?: string[];
  dreamTypes?: string[];
};

function getDreamDateForFilter(d: DreamRow): Date | null {
  try {
    if (d.dreamDate) {
      return new Date(d.dreamDate);
    }
    if (d.createdAt) {
      if (d.createdAt instanceof Date) return d.createdAt;
      if (d.createdAt.toDate) return d.createdAt.toDate();
      return new Date(d.createdAt);
    }
  } catch {
    return null;
  }
  return null;
}

function mapDreamDoc(docSnap: any): DreamRow {
  const data = docSnap.data() as any;

  return {
    id: docSnap.id,
    title: (data.title as string) ?? undefined,
    text:
      (data.dream_text as string) ??
      (data.dreamText as string) ??
      undefined,
    dreamDate: (data.dream_date as string) ?? (data.date as string),
    createdAt: data.created_at ?? data.createdAt ?? undefined,
    userId: (data.userId as string) ?? data.user ?? undefined,
    moods:
      (data.moods as string[]) ??
      (data.emotionsInDream as string[]) ??
      [],
    dreamTypes:
      (data.dreamTypes as string[]) ??
      (data.dream_types as string[]) ??
      [],
  };
}

// ------------------------------------------------------------

const HomeScreen = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [dreams, setDreams] = useState<DreamRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllDreams = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "dream_entry"));

      const fetched: DreamRow[] = snap.docs.map(mapDreamDoc);

      fetched.sort((a, b) => {
        const da = getDreamDateForFilter(a);
        const db = getDreamDateForFilter(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db.getTime() - da.getTime();
      });

      setDreams(fetched);
    } catch (err) {
      console.error("Error fetching dreams on Home:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDreams();
  }, []);

  // ----------- If user is not logged in -----------
  if (!user) {
    return (
      <View className="flex-1 bg-[#f6f7fb] items-center justify-center px-4">
        <Text className="text-gray-700 mb-2">
          You’re not logged in.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="px-4 py-2 rounded-full bg-blue-600"
        >
          <Text className="text-white font-semibold">
            Go to log in
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const u: any = user;

  const fullName =
    (u.firstName || u.lastName
      ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
      : u.displayName) || u.email;

  const renderItem = ({ item }: { item: DreamRow }) => {
    let displayDate = "";
    if (item.dreamDate) {
      displayDate = item.dreamDate;
    } else if (item.createdAt) {
      try {
        const d =
          item.createdAt instanceof Date
            ? item.createdAt
            : item.createdAt.toDate
            ? item.createdAt.toDate()
            : new Date(item.createdAt);
        displayDate = d.toLocaleDateString();
      } catch {
        displayDate = "";
      }
    }

    return (
      <TouchableOpacity
        className="mb-4 p-4 bg-blue-100 rounded-lg shadow"
        onPress={() => router.push(`/dreamentry/${item.id}`)}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold flex-1 mr-3">
            {item.title ?? "Untitled dream"}
          </Text>
          {displayDate ? (
            <Text className="text-gray-600 text-sm">{displayDate}</Text>
          ) : null}
        </View>

        {item.text ? (
          <Text className="text-gray-600 mt-1" numberOfLines={2}>
            {item.text}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  // Everything (title, card, etc.) is in the ListHeaderComponent so it scrolls away
  const listHeader = (
    <View>
      {/* Top page heading */}
      <Text className="text-center text-xs tracking-[3px] text-gray-400 mb-1">
        HOME
      </Text>
      <Text className="text-2xl font-bold text-center mb-6">
        Welcome back
      </Text>

      {/* Logged in card */}
      <View className="bg-white rounded-2xl shadow-sm px-5 py-4 mb-6">
        <Text className="text-xs text-gray-500 mb-1">Logged in as</Text>
        <Text className="text-lg font-semibold">{fullName}</Text>
        {u.email && (
          <Text className="text-sm text-gray-600 mb-4">
            {u.email}
          </Text>
        )}

        <TouchableOpacity
          onPress={signOut}
          className="mt-2 px-4 py-2 rounded-full bg-gray-900"
        >
          <Text className="text-white text-sm font-medium">
            Sign out
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xs text-gray-500 mb-2">
        Use the tabs below to record a new dream, browse entries, or
        update your profile.
      </Text>

      <Text className="text-sm font-semibold text-gray-800 mt-4 mb-3">
        Recent dreams from everyone
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#f6f7fb] px-4 pt-8 pb-4">
      {loading && dreams.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={dreams}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-8">
              No dreams yet.
            </Text>
          }
          onRefresh={fetchAllDreams}
          refreshing={loading}
        />
      )}
    </View>
  );
};

export default HomeScreen;
