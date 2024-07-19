import { CatalogueContext } from "@/context/CatalogueContext";
import { useContext } from "react";

export const useCatalogue = () => {
  const context = useContext(CatalogueContext);
  if (context === undefined) {
    throw new Error("useCatalogue must be used within a CatalogueProvider");
  }
  return context;
}