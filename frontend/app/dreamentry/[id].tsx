// app/dreamentry/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebase";


type NormalizedDream = {
  id: string;
  title: string;
  fullText: string;
  interpretation: string;
  dateStr: string;
  moods: string[];
  dreamTypes: string[];
  userId?: string | null;
};

const Chip = ({ label }: { label: string }) => (
  <View className="px-3 py-1 mr-2 mb-2 rounded-full bg-gray-100 border border-gray-200">
    <Text className="text-xs text-gray-700">{label}</Text>
  </View>
);

const DreamEntryScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [dream, setDream] = useState<NormalizedDream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState<string>("");

  // --- Helper: normalize different Firestore shapes into one format ---
  const normalizeDreamData = (data: any, id: string): NormalizedDream => {
    // Title
    const title: string =
      data.title ??
      data.dreamTitle ??
      "Untitled dream";

    // Full text
    const fullText: string =
      data.dream_text ??
      data.dreamText ??
      data.dream_text_full ??
      "";

    // Interpretation
    const interpretation: string = data.interpretation ?? "";

    // Date string
    let dateStr = "";
    if (data.dream_date) {
      dateStr = data.dream_date; // new field from create page
    } else if (data.date) {
      dateStr = data.date; // legacy string like "11/03/2024"
    } else if (data.created_at) {
      try {
        const d =
          data.created_at instanceof Date
            ? data.created_at
            : data.created_at.toDate
            ? data.created_at.toDate()
            : new Date(data.created_at);
        dateStr = d.toLocaleDateString();
      } catch {
        dateStr = "";
      }
    }

    // Moods / emotions
    const moods: string[] =
      data.moods ??
      data.emotionsInDream ??
      [];

    // Dream type tags
    const dreamTypes: string[] =
      data.dreamTypes ??
      data.dream_type ??
      [];

    const userId: string | null =
      data.userId ?? data.userID ?? data.user ?? null;

    return {
      id,
      title,
      fullText,
      interpretation,
      dateStr,
      moods,
      dreamTypes,
      userId: userId ?? undefined,
    };
  };

  // --- Load dream entry ---
  useEffect(() => {
    const fetchDream = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const ref = doc(db, "dream_entry", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Dream entry not found.");
          setDream(null);
          return;
        }

        const raw = snap.data();
        const normalized = normalizeDreamData(raw, snap.id);
        setDream(normalized);

        // Fetch author username if we have a userId
        if (normalized.userId) {
          try {
            const userRef = doc(db, "user", normalized.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const udata = userSnap.data() as any;
              const composedName =
                udata.username ||
                `${udata.firstName ?? ""} ${udata.lastName ?? ""}`.trim() ||
                "";
              setAuthorName(composedName);
            }
          } catch (err) {
            console.log("Error fetching author:", err);
          }
        }
      } catch (err: any) {
        console.error("Error loading dream:", err);
        setError("There was a problem loading this dream.");
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f6f7fb]">
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !dream) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f6f7fb] px-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Oops…
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-4">
          {error ?? "We couldn’t find that dream entry."}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="px-4 py-2 rounded-full bg-gray-900"
        >
          <Text className="text-white text-sm font-medium">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#f6f7fb]"
      contentContainerStyle={{ paddingBottom: 40 }}
    >

      <View className="px-6 pb-6">
        {/* Title */}
        <Text className="text-3xl font-extrabold text-gray-900 mb-1">
          {dream.title}
        </Text>

        {/* Date + Username */}
        <View className="flex-row items-center gap-3 mb-6">
          {dream.dateStr ? (
            <Text className="text-gray-600 text-sm">{dream.dateStr}</Text>
          ) : null}
          {authorName ? (
            <>
              {dream.dateStr ? (
                <Text className="text-gray-400 text-sm">•</Text>
              ) : null}
              <Text className="text-gray-800 text-sm font-medium">
                @{authorName}
              </Text>
            </>
          ) : null}
        </View>

        {/* Mood tags */}
        {dream.moods && dream.moods.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-800 mb-1">
              Mood tags
            </Text>
            <View className="flex-row flex-wrap">
              {dream.moods.map((m) => (
                <Chip key={m} label={m} />
              ))}
            </View>
          </View>
        )}

        {/* Dream type tags */}
        {dream.dreamTypes && dream.dreamTypes.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-800 mb-1">
              Dream type
            </Text>
            <View className="flex-row flex-wrap">
              {dream.dreamTypes.map((t) => (
                <Chip key={t} label={t} />
              ))}
            </View>
          </View>
        )}

        {/* Full dream text */}
        {dream.fullText ? (
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Full dream
            </Text>
            <Text className="text-sm leading-relaxed text-gray-800">
              {dream.fullText}
            </Text>
          </View>
        ) : null}

        {/* Interpretation */}
        {dream.interpretation ? (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Interpretation
            </Text>
            <Text className="text-sm leading-relaxed text-gray-800">
              {dream.interpretation}
            </Text>
          </View>
        ) : (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Interpretation
            </Text>
            <Text className="text-sm text-gray-600">
              No interpretation has been saved for this dream yet.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DreamEntryScreen;
