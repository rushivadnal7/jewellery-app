import { useAuth } from "@/modules/auth/context/AuthProvider";
import { Stack, Redirect, Href } from "expo-router";

export default function ProtectedLayout() {
  const { authState } = useAuth();

  if (!authState.authenticated) {
    return <Redirect href={"/auth" as Href}  />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
