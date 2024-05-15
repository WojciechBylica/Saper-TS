import { useContext } from "react";

import { SaperContext } from "./saperContext";

export const useSaperContext = () => {
  const context = useContext(SaperContext);
  if (context) {
    return context;
  }
  throw new Error(
    "Oh no! Component should be placed inside SaperContextProvider",
  );
};
