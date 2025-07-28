import { useAuthStore } from "@/app/api/store/auth.store";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { UserRegister } from "@/types/user.type";
import { register } from "@/server/action/auth/register";
import { verifyEmail } from "@/server/action/auth/verifyEmail";

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
        router.push("/onboarding");
      }
    },
    onError: (error) => {
      setLoading(false);
      console.error("Erreur vérification email", error);
    },
  });
};
