import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Text } from "react-native";
import { AuthProvider } from "../modules/auth/context/AuthProvider";
// Redux
import { Provider } from "react-redux";
import { store } from "@/modules/store/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Loader } from "@/modules/components/Loader";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DefaultFont: require("../assets/fonts/Jost-VariableFont_wght.ttf"),
    TitleFont: require("../assets/fonts/Yellowtail-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      const oldRender = (Text as any).render;
      (Text as any).render = function (...args: any[]) {
        const origin = oldRender.call(this, ...args);
        return React.cloneElement(origin, {
          style: [{ fontFamily: "DefaultFont" }, origin.props.style],
        });
      };
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return <Loader />;

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
