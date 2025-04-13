// src/context/PortfolioContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

type Work = {
  id: string;
  title: string;
  description: string;
  status: string;
  externalLink?: string;
  technologies: string[];
  challenges: string[];
  solutions: string[];
  thumbnail: string;
  category: string;
  link?: string;
};

interface PortfolioContextProps {
  works: Work[];
  loading: boolean;
  error: string | null;
}

const PortfolioContext = createContext<PortfolioContextProps>({
  works: [],
  loading: true,
  error: null,
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Work[];
        setWorks(data);
      } catch (err) {
        setError("Failed to load portfolio data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  return (
    <PortfolioContext.Provider value={{ works, loading, error }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export { PortfolioContext };
