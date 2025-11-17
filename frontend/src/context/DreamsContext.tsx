import { createContext, useContext, useState, ReactNode } from "react";

type DreamsContextType = {
  dreams: any[];
  setDreams: React.Dispatch<React.SetStateAction<any[]>>;
};

const DreamsContext = createContext<DreamsContextType | undefined>(undefined);

export const DreamsProvider = ({ children }: { children: ReactNode }) => {
  const [dreams, setDreams] = useState<any[]>([]);
  return (
    <DreamsContext.Provider value={{ dreams, setDreams }}>
      {children}
    </DreamsContext.Provider>
  );
};

export const useDreams = () => {
  const context = useContext(DreamsContext);
  if (!context) throw new Error("useDreams must be used within DreamsProvider");
  return context;
};

export default DreamsContext;
