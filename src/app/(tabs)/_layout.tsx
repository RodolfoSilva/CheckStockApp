import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, ...rest }) => (
            <Feather name="home" {...rest} />
          ),
        }}
      />
      <Tabs.Screen
        name="conferences"
        options={{
          title: "Conferencias",
          tabBarIcon: ({ focused, ...rest }) => (
            <Feather name="calendar" {...rest} />
          ),
        }}
      />
      <Tabs.Screen
        name="places"
        options={{
          title: "Locais",
          tabBarIcon: ({ focused, ...rest }) => (
            <Feather name="map-pin" {...rest} />
          ),
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: "Itens",
          tabBarIcon: ({ focused, ...rest }) => (
            <Feather name="box" {...rest} />
          ),
        }}
      />
    </Tabs>
  );
}
