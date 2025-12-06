// app/(tabs)/search.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/firebase";

// ---------- Types & helpers (same as profile/home) ----------

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

const SearchScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [allDreams, setAllDreams] = useState<DreamRow[]>([]);
  const [query, setQuery] = useState("");

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

      setAllDreams(fetched);
    } catch (err) {
      console.error("Error fetching dreams for search:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDreams();
  }, []);

  const filteredDreams = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allDreams;

    return allDreams.filter((d) => {
      const title = d.title?.toLowerCase() ?? "";
      const text = d.text?.toLowerCase() ?? "";
      return title.includes(q) || text.includes(q);
    });
  }, [allDreams, query]);

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
        className="mb-3 p-4 bg-blue-100 rounded-lg"
        onPress={() => router.push(`/dreamentry/${item.id}`)}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold flex-1 mr-3">
            {item.title ?? "Untitled dream"}
          </Text>
          {displayDate ? (
            <Text className="text-gray-600 text-xs">{displayDate}</Text>
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

  return (
    <View className="flex-1 bg-[#f6f7fb] px-4 pt-8 pb-4">
      <Text className="text-center text-xs tracking-[3px] text-gray-400 mb-1">
        SEARCH
      </Text>
      <Text className="text-2xl font-bold text-center mb-6">
        Find dream entries
      </Text>

      {/* Search bar */}
      <View className="flex-row items-center bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder="Search by title or dream text…"
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text className="text-xs text-gray-500 ml-2">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filteredDreams}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-8">
              No dreams match your search yet.
            </Text>
          }
          onRefresh={fetchAllDreams}
          refreshing={loading}
        />
      )}
    </View>
  );
};

export default SearchScreen;
