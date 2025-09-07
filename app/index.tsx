import { useRouter } from 'expo-router';
import SplashScreen from './Splash';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(protected)/(tabs)');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}
