import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, animation: "slide_from_left" }}
            />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      <ToastMessage />
    </QueryClientProvider>
  );
}
