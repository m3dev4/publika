"use client";

import { UseCreatePost } from "@/hooks/post";
import { useAuthStore } from "@/app/api/store/auth.store";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function TestPostPage() {
  const createPostMutation = UseCreatePost();
  const { user, isAuthenticated } = useAuthStore();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au chargement
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        setSessionInfo(session);
        console.log("Session client:", session);
      } catch (error) {
        console.error("Erreur session:", error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const testLogin = async () => {
    try {
      // Essayer de se connecter avec un utilisateur de test
      const result = await authClient.signIn.email({
        email: "test@example.com",
        password: "password123",
      });
      console.log("Résultat connexion:", result);

      // Recharger la session
      const session = await authClient.getSession();
      setSessionInfo(session);
    } catch (error) {
      console.error("Erreur connexion:", error);
    }
  };

  const testCreatePost = async () => {
    try {
      await createPostMutation.mutateAsync({
        title: "Test Post avec Hook",
        content:
          "Ceci est un test de création de post en utilisant le hook React Query",
        type: "GENERAL",
        status: "DRAFT",
        // categoryId est optionnel
        // photos est optionnel
      });
    } catch (error) {
      console.error("Erreur lors du test:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Test Création de Post
        </h1>

        {/* Informations d'authentification */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">
            🔐 Statut d'authentification
          </h2>

          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="font-bold">Store Auth:</span>{" "}
              {isAuthenticated ? "✅ Connecté" : "❌ Non connecté"}
            </p>

            {user && (
              <p className="text-gray-300">
                <span className="font-bold">Utilisateur:</span> {user.email}{" "}
                (ID: {user.id})
              </p>
            )}

            <p className="text-gray-300">
              <span className="font-bold">Session Client:</span>{" "}
              {loading
                ? "Chargement..."
                : sessionInfo
                  ? "✅ Trouvée"
                  : "❌ Aucune"}
            </p>

            {sessionInfo && (
              <pre className="text-xs text-green-300 bg-gray-900 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Bouton de connexion si pas connecté */}
          {!isAuthenticated && (
            <button
              onClick={testLogin}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              🔑 Se connecter (test@example.com)
            </button>
          )}

          <button
            onClick={testCreatePost}
            disabled={createPostMutation.isPending || !isAuthenticated}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {createPostMutation.isPending
              ? "Création en cours..."
              : "Tester Création Post avec Hook"}
          </button>

          {!isAuthenticated && (
            <p className="text-yellow-400 text-sm">
              ⚠️ Vous devez être connecté pour créer un post
            </p>
          )}

          {createPostMutation.error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <h3 className="text-red-400 font-bold mb-2">Erreur:</h3>
              <p className="text-red-300">{createPostMutation.error.message}</p>
            </div>
          )}

          {createPostMutation.data && (
            <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg">
              <h3 className="text-green-400 font-bold mb-2">Succès:</h3>
              <pre className="text-green-300 text-sm overflow-auto">
                {JSON.stringify(createPostMutation.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
