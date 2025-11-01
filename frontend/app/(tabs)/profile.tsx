import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/src/firebase";

const StatItem = ({ label, value }) => (
  <View className="items-center mr-4">
    <Text className="text-lg font-bold">{value}</Text>
    <Text className="text-gray-500 text-sm">{label}</Text>
  </View>
);

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth(); 

  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ entries: 0, friends: 11 });

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const q = query(
          collection(db, "dream_entry"),
          where("user", "==", "user/user001"), // adjust when we get the user data
          orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDreams(fetched);
        setStats((prev) => ({ ...prev, entries: fetched.length }));
      } catch (error) {
        console.log("Error fetching dreams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDreams();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="mb-4 p-4 bg-blue-100 rounded-lg shadow"
      onPress={() => router.push(`/dreamentry/${item.id}`)}
    >
      <Text className="text-gray-800 font-semibold" numberOfLines={1}>
        {item.title || "Untitled Dream"}
      </Text>
      <Text className="text-gray-500 mt-1" numberOfLines={2}>
        {item.dream_text || "No description..."}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading your dreams...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4 pt-12">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: 'https://placekitten.com/100/100' }}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          <Text className="text-xl font-bold font-sans">Username</Text>
        </View>
      </View>

      {/* Bio / Description */}
      <Text className="text-gray-700 mb-6">
        This is a short bio about the user. It can span multiple lines and gives some context about the journal owner.
      </Text>

      {/* Stats */}
      <View className="flex-row justify-around mt-2 mb-4">
        <StatItem label="Entries" value={stats.entries} />
        <StatItem label="Friends" value={stats.friends} />
      </View>

      {/* Dream Entries */}
      <FlatList
        data={dreams}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">
            You haven’t logged any dreams yet.
          </Text>
        }
      />
    </View>
  );
};

export default ProfileScreen;
