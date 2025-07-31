import { useAuthStore } from "@/app/api/store/auth.store";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserLogin, UserRegister, UserUpdateProfile } from "@/types/user.type";
import { register } from "@/server/action/auth/register";
import { verifyEmail } from "@/server/action/auth/verifyEmail";
import { login } from "@/server/action/auth/login";

export const userRegister = () => {
  const router = useRouter();
  const { setPendingVerification, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UserRegister) => {
      return await register(data);
    },
    onSuccess: (user, variables) => {
      setPendingVerification(variables.email);
      router.push("/auth/verify-email");
    },
    onError: (error) => {
      console.error("Erreur inscription", error);
    },
  });
};

export const userVerifyEmail = () => {
  const router = useRouter();
  const { setEmailVerified, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (token: string) => {
      setLoading(true);
      try {
        const result = await verifyEmail(token);
        if (!result.success) {
          throw new Error(result.message);
        }
        return result;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    onSuccess: (result) => {
      setLoading(false);
      if (result.user) {
        setEmailVerified(result.user);
        // Rediriger vers une page intermédiaire qui gère la redirection finale
        router.push("/auth/verify-success");
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Erreur vérification email", error);
    },
  });
};

export const userLogin = () => {
  const router = useRouter();
  const { setLoading, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UserLogin) => {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }

      const result = await res.json();
      return result.user;
    },
    onSuccess: (user) => {
      console.log("Login success - User data:", user);
      setLoading(false);
      setUser(user);

      // Vérifier que le store est bien mis à jour
      setTimeout(() => {
        const storeState = useAuthStore.getState();
        console.log("Store state after login:", storeState);
      }, 100);

      // Redirection basée sur l'état de l'onboarding
      if (!user.onboarding) {
        router.push("/onboarding");
      } else {
        router.push("/pages/home");
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Login error:", error);
    },
  });
};

export const getUserProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/auth/me/${user?.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await res.json();
      return data.user;
    },
    enabled: !!user,
  });
};

export const updateProfile = () => {
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: Partial<UserUpdateProfile>) => {
      const res = await fetch(`/api/auth/userUpdate?id=${user?.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Update profile failed");
      }

      return result;
    },
    onSuccess: (result) => {
      console.log("Update profile success:", result);
      if (result.user) {
        setUser(result.user);
      }
    },
    onError: (error) => {
      console.error("Update profile error:", error);
    },
  });
};
