import React from "react";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType } from "react-native";

import { COLORS, SIZES } from "@/constants/Colors";

type TabBarIconProps = {
  source: ImageSourcePropType;
  focused: boolean;
};

function TabBarIcon({ source, focused }: TabBarIconProps) {
  return (
    <Image
      source={source}
      style={{
        width: 28,
        height: 28,
        marginBottom: -3,
        opacity: focused ? 1 : 0.5,
      }}
    />
  );
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          height: 70,
          backgroundColor: COLORS.dark1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/home.png")}
              focused={focused}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/user.png")}
              focused={focused}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Tab Three",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/tab.png")}
              focused={focused}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: "Tab Four",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={require("../../assets/images/settings.png")}
              focused={focused}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}