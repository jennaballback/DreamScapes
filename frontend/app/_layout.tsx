import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";

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
  
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

