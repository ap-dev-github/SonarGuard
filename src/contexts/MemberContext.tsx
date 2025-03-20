import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface MembersContextType {
  members: any[]; // Replace 'any' with the actual type if known
  setMembers: React.Dispatch<React.SetStateAction<any[]>>;
}

// Create the context
const MembersContext = createContext<MembersContextType | undefined>(undefined);

// Create the provider component
export const MembersProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<any[]>([]);

  return (
    <MembersContext.Provider value={{ members, setMembers }}>
      {children}
    </MembersContext.Provider>
  );
};

// Custom hook for using the context
export const useMembers = () => {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error("useMembers must be used within a MembersProvider");
  }
  return context;
};
