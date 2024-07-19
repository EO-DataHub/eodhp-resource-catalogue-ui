import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
}