import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { LLMProvider } from "@/context/LlmProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Sentry.init({
  dsn: "https://a1023ed48ab8ff26c012ba1d471987fe@o4509513809788928.ingest.de.sentry.io/4509513817194576",
  sendDefaultPii: true,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 5000,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
const queryClient = new QueryClient();
export default Sentry.wrap(function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LLMProvider>
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
      </LLMProvider>
      <ToastMessage />
    </QueryClientProvider>
  );
});
