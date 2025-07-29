import { useAuthStore } from "@/app/api/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { onboarding } from "@/server/action/onboarding/onboarding";
import { UserOnboarding } from "@/types/user.type";

export const useOnboarding = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UserOnboarding) => {
      const result = await onboarding(data);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (result) => {
      if (result.user) {
        // Mettre à jour l'utilisateur dans le store
        setUser(result.user);
        // Rediriger vers la page d'accueil
        router.push("/home");
      }
    },
    onError: (error) => {
      console.error("Erreur onboarding:", error);
    },
  });
};
