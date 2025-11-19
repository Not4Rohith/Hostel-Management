import { Stack } from "expo-router";

export default function RootLayout() {
  return (
   
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Api App' }} />
      <Stack.Screen name="contact" options={{ title: 'Contact App Access' }} />
      <Stack.Screen name="location" options={{ title: 'Location App Access' }} />
      <Stack.Screen name="battery" options={{ title: 'Battery App Access' }} />
    </Stack>
    
  );
}
//gft