import { Metadata } from "next";
import HomePage from "./homePage";

export  const metadata: Metadata = {
    title: "Publika - Accueil",
    description: "Page d'accueil de l'application",
}


const HomePageClient = () => {
  return <HomePage />;
};

export default HomePageClient;
