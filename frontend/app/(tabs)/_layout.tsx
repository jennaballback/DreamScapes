// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Image, ImageBackground, Text, View } from "react-native";

import { images } from "../../assets/constants/images";

// If you prefer to keep icons centralized in a constants file, you can
// move this object there, but this works fine for now.
export const icons = {
  home: require("../../assets/icons/home.png"),
  search: require("../../assets/icons/search.png"),
  plus: require("../../assets/icons/plus.png"),
  settings: require("../../assets/icons/settings.png"),
  person: require("../../assets/icons/person.png"),
};

type TabIconProps = {
  focused: boolean;
  icon: any;
  title: string;
};

// Re-styled tab icon with nicer active "pill"
const TabIcon = ({ focused, icon, title }: TabIconProps) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        // pill sits nicely in the bar and centers icon + text
        className="flex-row items-center justify-center px-5 py-2 rounded-full overflow-hidden shadow-md"
        imageStyle={{ borderRadius: 999 }}
      >
        <Image source={icon} style={{ width: 20, height: 20 }} tintColor="#151312" />
        <Text className="ml-2 text-secondary text-base font-semibold">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  // Inactive state: just the icon centered, no extra margin
  return (
    <View className="justify-center items-center">
      <Image source={icon} style={{ width: 20, height: 20 }} tintColor="#A8B5DB" />
    </View>
  );
};

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0f0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 60,              // a bit taller so the pill feels comfy
          position: "absolute",
          overflow: "hidden",
          borderColor: "#0f0d23",
          borderWidth: 1,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      {/* SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />

      {/* CREATE */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.plus} title="Create" />
          ),
        }}
      />

      {/* SETTINGS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.settings} title="Settings" />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
