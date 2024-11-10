// src/components/NumberFormatter.js
import { useContext } from "react";
import { LocalizationContext } from "../components/LocalizationContext";

export const useNumberFormatter = () => {
  const { decimalSeparator, thousandsSeparator } = useContext(LocalizationContext);

  const formatNumber = (number) => {
    const parts = number.toString().split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    const decimalPart = parts.length > 1 ? decimalSeparator + parts[1] : "";
    return integerPart + decimalPart;
  };

  return formatNumber;
};
