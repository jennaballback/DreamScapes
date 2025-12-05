// app/(tabs)/profile.tsx
import React, { useEffect, useMemo, useState } from "react";
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

// ----------- Constants ----------------
const MOOD_TAGS = [
  "Happy",
  "Anxious",
  "Confused",
  "Scared",
  "Excited",
  "Sad",
  "Hopeful",
  "Angry",
  "Peaceful",
];

const DREAM_TYPE_TAGS = [
  "Nightmare",
  "Recurring",
  "Lucid",
  "Vivid",
  "Stress Dream",
  "Surreal",
];

// ---------------- Types ----------------

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

type StatItemProps = {
  label: string;
  value: string | number;
};

type DateFilter = "all" | "7" | "30" | "365";

// Wrapper that allows web hover events without TypeScript errors
type HoverableViewProps = React.ComponentProps<typeof View> & {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const HoverableView: React.FC<HoverableViewProps> = (props) => {
  return <View {...props} />;
};

// Small stat pill
const StatItem = ({ label, value }: StatItemProps) => (
  <View className="items-center mr-4">
    <Text className="text-lg font-bold">{value}</Text>
    <Text className="text-gray-500 text-sm">{label}</Text>
  </View>
);

// Helper to turn a dream's date into a JS Date
function getDreamDateForFilter(d: DreamRow): Date | null {
  try {
    // Prefer dreamDate string if present
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

// ---------------- Screen ----------------

const ProfileScreen = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [dreams, setDreams] = useState<DreamRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ entries: number; friends: number }>({
    entries: 0,
    friends: 0,
  });

  // Filter UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedMoodFilters, setSelectedMoodFilters] = useState<string[]>([]);
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);

  const fetchDreams = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const u: any = user;
      const ownerId = u.id ?? u.uid ?? u.email;

      // Match collection name used when creating dream entries
      const q = query(
        collection(db, "dream_entry"),
        where("userId", "==", ownerId)
      );
      const snap = await getDocs(q);

      const fetched: DreamRow[] = snap.docs.map((doc) => {
        const data = doc.data() as any;

        return {
          id: doc.id,
          title: (data.title as string) ?? undefined,
          text: (data.dream_text as string) ?? undefined,
          dreamDate: (data.dream_date as string) ?? undefined,
          createdAt: data.created_at ?? undefined,
          userId: (data.userId as string) ?? data.user ?? undefined,
          moods: (data.moods as string[]) ?? [],
          dreamTypes: (data.dreamTypes as string[]) ?? [],
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

  // Toggle helpers for chip selections
  const toggleMoodFilter = (tag: string) => {
    setSelectedMoodFilters((prev) =>
      prev.includes(tag) ? prev.filter((m) => m !== tag) : [...prev, tag]
    );
  };

  const toggleTypeFilter = (tag: string) => {
    setSelectedTypeFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setDateFilter("all");
    setSelectedMoodFilters([]);
    setSelectedTypeFilters([]);
  };

  // Apply filtering + sort newest first
  const filteredDreams = useMemo(() => {
    const now = new Date();

    const maxAgeDays =
      dateFilter === "7" ? 7 : dateFilter === "30" ? 30 : dateFilter === "365" ? 365 : null;

    return dreams
      .filter((d) => {
        const dreamDate = getDreamDateForFilter(d);

        // Date filter
        if (maxAgeDays != null && dreamDate) {
          const diffMs = now.getTime() - dreamDate.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays > maxAgeDays) return false;
        }

        // Mood filter: require intersection if filters selected
        if (selectedMoodFilters.length > 0) {
          const moods = d.moods ?? [];
          const hasMatch = moods.some((m) => selectedMoodFilters.includes(m));
          if (!hasMatch) return false;
        }

        // Dream type filter
        if (selectedTypeFilters.length > 0) {
          const types = d.dreamTypes ?? [];
          const hasMatch = types.some((t) => selectedTypeFilters.includes(t));
          if (!hasMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const da = getDreamDateForFilter(a);
        const db = getDreamDateForFilter(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        // Newest first
        return db.getTime() - da.getTime();
      });
  }, [dreams, dateFilter, selectedMoodFilters, selectedTypeFilters]);

  const renderItem: ListRenderItem<DreamRow> = ({ item }) => {
    // Decide which date to show: dream_date first, then created_at fallback
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
      } catch (e) {
        displayDate = "";
      }
    }

    return (
      <TouchableOpacity
        className="mb-4 p-4 bg-blue-100 rounded-lg shadow"
        onPress={() => router.push(`/dreamentry/${item.id}`)}
      >
        {/* Top row: title on the left, date on the right */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold flex-1 mr-3">
            {item.title ?? "Untitled dream"}
          </Text>

          {displayDate ? (
            <Text className="text-gray-600 text-sm">{displayDate}</Text>
          ) : null}
        </View>

        {/* Dream preview text */}
        {item.text ? (
          <Text className="text-gray-600 mt-1" numberOfLines={2}>
            {item.text}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-blue-500">
          Please log in to view your profile.
        </Text>
      </View>
    );
  }

  // Safe user fields (no password)
  const u: any = user;
  const rawPhotoURL: string | undefined = u.photoURL;

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

  const filtersActive =
    dateFilter !== "all" ||
    selectedMoodFilters.length > 0 ||
    selectedTypeFilters.length > 0;

  return (
    <View className="flex-1 bg-white px-4 py-6">
      {/* Top action bar: Filter (left) and Sign Out (right) */}
      <View className="w-full flex-row justify-between items-center px-4 mt-4">
        {/* Filter Button with hover tooltip (web) */}
        <HoverableView
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <TouchableOpacity
            onPress={() => setFiltersOpen((prev) => !prev)}
            className="p-2"
          >
            <Image
              source={require("../../assets/icons/filter.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {showTooltip && (
            <View className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded-md">
              <Text className="text-white text-xs">Filter</Text>
            </View>
          )}
        </HoverableView>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={signOut}
          className="px-4 py-2 rounded-full bg-gray-100 border border-gray-300"
        >
          <Text className="text-gray-700 font-medium">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Filter panel */}
      {filtersOpen && (
        <View className="mt-3 mx-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold text-gray-800">
              Filter dreams
            </Text>
            {filtersActive && (
              <TouchableOpacity onPress={clearFilters}>
                <Text className="text-sm text-blue-600 font-medium">
                  Clear all
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Date filter */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Date
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "7", label: "Last 7 days" },
                { key: "30", label: "Last 30 days" },
                { key: "365", label: "Last year" },
              ].map((opt) => {
                const selected = dateFilter === (opt.key as DateFilter);
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setDateFilter(opt.key as DateFilter)}
                    className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                      selected ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        selected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Mood filters */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Mood tags
            </Text>
            <View className="flex-row flex-wrap">
              {MOOD_TAGS.map((tag) => {
                const selected = selectedMoodFilters.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleMoodFilter(tag)}
                    className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                      selected ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        selected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Dream type filters */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Dream type
            </Text>
            <View className="flex-row flex-wrap">
              {DREAM_TYPE_TAGS.map((tag) => {
                const selected = selectedTypeFilters.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleTypeFilter(tag)}
                    className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                      selected ? "bg-purple-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        selected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Centered profile header */}
      <View className="w-full items-center mt-6 mb-8">
        <View className="flex-row items-center justify-center w-full max-w-2xl">
          {/* Profile photo / initials */}
          <View className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 items-center justify-center mr-8">
            {safePhotoURL ? (
              <Image
                source={{ uri: safePhotoURL }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-4xl font-bold text-slate-600">
                {initials}
              </Text>
            )}
          </View>

          {/* Text area: username, name, stats */}
          <View className="items-start">
            <Text className="text-2xl font-semibold tracking-wide">
              {usernameToShow}
            </Text>

            {fullNameToShow ? (
              <Text className="text-gray-600 text-lg mt-1">
                {fullNameToShow}
              </Text>
            ) : null}

            <View className="flex-row mt-4">
              <StatItem label="Entries" value={stats.entries} />
              <StatItem label="Friends" value={stats.friends} />
            </View>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-200 mb-4" />

      {/* Dream list (filtered) */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList<DreamRow>
          data={filteredDreams}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          onRefresh={fetchDreams}
          refreshing={loading}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              No dreams match your filters.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

export default ProfileScreen;
