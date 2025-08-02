"use client";
import { createCategory } from '@/hooks/category';
import { authClient } from '@/lib/auth-client';
import { useState, useEffect } from 'react';

const AdminPage = () => {
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const mutation = createCategory();
  
  useEffect(() => {
    const getUser = async () => {
      const session = await authClient.getSession();
      console.log('Client session:', session);
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    mutation.mutate({ name });
    setName('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Créer Catégorie</h1>
      <p className="mb-4">Utilisateur connecté: {user ? user.email : 'Non connecté'}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nom de la catégorie
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: Développement Web"
          />
        </div>
        
        <button
          type="submit"
          disabled={mutation.isPending || !name.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {mutation.isPending ? 'Création...' : 'Créer Catégorie'}
        </button>
      </form>
      
      {mutation.isError && (
        <p className="text-red-500 mt-2">Erreur: {mutation.error?.message}</p>
      )}
      
      {mutation.isSuccess && (
        <p className="text-green-500 mt-2">Catégorie créée avec succès!</p>
      )}
    </div>
  )
}

export default AdminPage