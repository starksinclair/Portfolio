import { useContext } from "react";
import { PortfolioContext } from "./PortfolioContext";

export const usePortfolio = () => useContext(PortfolioContext);
