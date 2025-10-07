import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  //this is where we fixed so that index is not just looming above on the page
  

  //The headerShow is firstly how we get rid of that for tabs
  //This one hides the file name of (tabs) folder
  return <Stack> 
    <Stack.Screen
      name="(tabs)"
      options={{headerShown: false}}
      />
    <Stack.Screen
      name="movie/[id]"
      options={{ headerShown: false}}
    />

  </Stack>
}

