import { AtSign, Camera, FileText, User, Users } from "lucide-react";

export const steps = [
  {
    id: 1,
    title: "Informations personnelles",
    description: "Commençons par vos informations de base",
    icon: User,
    status: "current" as const,
  },

  {
    id: 2,
    title: "Nom d'utilisateur",
    description: "Choissisez votre identifiant unique",
    icon: AtSign,
    status: "upcoming" as const,
  },
  {
    id: 3,
    title: "Photo & Localisation",
    description: "Ajoutez votre photo et votre ville",
    icon: Camera,
    status: "upcoming" as const,
  },
  {
    id: 4,
    title: "Type de compte",
    description: "Definissez votre rôle sur la plateforme",
    icon: Users,
    status: "upcoming" as const,
  },
  {
    id: 5,
    title: "Description",
    description: "Ajoutez une description de vous",
    icon: FileText,
    status: "upcoming" as const,
  },
];
