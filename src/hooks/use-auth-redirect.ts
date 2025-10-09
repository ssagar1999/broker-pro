import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/lib/store/userStore';

export function useAuthRedirect(options: { 
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuth?: boolean;
  redirectAuthTo?: string;
} = {}) {
  const { 
    requireAuth = false, 
    redirectTo = '/register', 
    redirectIfAuth = false,
    redirectAuthTo = '/show-properties'
  } = options;
  
  const router = useRouter();
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const checkAuth = useUserStore(state => state.checkAuth);
  
  useEffect(() => {
    // If authentication is required but user is not authenticated
    if (requireAuth && !checkAuth()) {
      router.replace(redirectTo);
      return;
    }
    
    // If we should redirect when authenticated and user is authenticated
    if (redirectIfAuth && checkAuth()) {
      router.replace(redirectAuthTo);
      return;
    }
  }, [requireAuth, redirectTo, redirectIfAuth, redirectAuthTo, router, checkAuth]);
  
  return { isAuthenticated, checkAuth };
}