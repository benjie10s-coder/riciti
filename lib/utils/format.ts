import { Currency } from "@/lib/store/invoiceStore";

export const formatCurrency = (amount: number, currency: Currency) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatCurrencyKES = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
