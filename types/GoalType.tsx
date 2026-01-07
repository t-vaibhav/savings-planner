import { Currency } from "./Currency";

export type Goal = {
    id?: number;
    name: string;
    targetAmount: number;
    remainingAmount: number;
    contributions: number;
    currency: Currency;
};
