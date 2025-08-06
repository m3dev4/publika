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
      console.log("Payload envoyé à l'API onboarding:", data);
      const response = await fetch("/api/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Erreur onboarding");
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
      alert(error.message);
      console.error("Erreur onboarding:", error);
    },
  });
};
