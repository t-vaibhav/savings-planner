import { Currency } from "./Currency";

export type Rates = {
    id?: number;
    rate: number;
    date: Date;
    currency: Currency;
};
