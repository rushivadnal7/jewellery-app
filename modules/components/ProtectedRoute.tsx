// app/components/ProtectedRoute.tsx
import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/modules/auth/context/AuthProvider";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authState } = useAuth();

  if (!authState.authenticated) {
    return <Stack.Screen name="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
