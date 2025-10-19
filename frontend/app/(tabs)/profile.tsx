import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from "../../src/context/AuthContext"
import { useRouter } from 'expo-router';

const placeholderEntries = [
  { id: '1', title: 'Dream 1', content: 'This is a placeholder for the first journal entry.' },
  { id: '2', title: 'Dream 2', content: 'Another placeholder entry to show the layout.' },
  { id: '3', title: 'Dream 3', content: 'More placeholder content here.' },
  { id: '4', title: 'Dream 4', content: 'Even more placeholder content.' },
];

const mockProfileStats = {
  entries: placeholderEntries.length,
  followers: 10,
  following: 7,
}

const StatItem = ({lable, value}) => (
  <View className='items-center mr-4'>
    <Text className='text-lg font-bold'>{value}</Text>
    <Text className='text-gray-500 text-sm'>{lable}</Text>
    <Text></Text>
  </View>
)


const ProfileScreen = () => {

  const [stats, setStats] = useState(mockProfileStats);
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className='mb-4 p-4 bg-blue-100 rounded-lg shadow'
      onPress={() => router.push(`../dreamentry/${item.id}`)}
      >
      <Text className="text-gray-800 font-semibold">{item.title}</Text>
      <Text className="text-gray-500 mt-1">{item.content}</Text>
    </TouchableOpacity>
    
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: 'https://placekitten.com/100/100' }} // placeholder profile image
          className="w-16 h-16 rounded-full mr-4"
        />
        <Text className="text-xl font-bold font-sans mt-16">Username</Text>
      </View>

      {/* Bio / Description */}
      <Text className="text-gray-700 mb-6">
        This is a short bio about the user. It can span multiple lines and gives some context about the journal owner.
      </Text>
      {/*We'll have the number of entries, followers and following come from calculating a number in the data base*/}
      {/*The Justify between spaces out the followers, entries, and following */}
      <View className='flex-row justify-around mt-2'>           
          <StatItem lable="Entries" value={stats.entries}/>
          <StatItem lable="Followers" value={stats.followers}/>
          <StatItem lable="Following" value={stats.following}/>
        {/* <Text className='text-gray-700 text-center h-10 font-bold font-sans'>10 Entries 10 Followers 10 Following</Text> */}
      </View>
      {/* Journal Entries */}
      <FlatList
        data={placeholderEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProfileScreen;
