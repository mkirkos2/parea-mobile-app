import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';

export default function Index() {
  const { status, isAuthenticated } = useAuth();
  const { isHydrated } = useAppContext();

  // If either context is still loading/hydrating, show nothing (prevents flash)
  if (status === 'loading' || !isHydrated) {
    return null;
  }

  // If authenticated, go straight to home tab (no onboarding redirect for authenticated users)
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  // If not authenticated, go to login/signup (this is the default entry point now)
  return <Redirect href="/(auth)/login" />;
}