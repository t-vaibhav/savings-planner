import Dexie, { Table } from "dexie";

export type Currency = "INR" | "USD";

export interface Goal {
    id?: string;
    name: string;
    targetAmount: number;
    remainingAmount: number;
    contributions: number;
    currency: Currency;
}

export interface Rates {
    id?: string;
    rate: number;
    date: Date;
    currency: Currency;
}

class GoalsDB extends Dexie {
    goals!: Table<Goal, string>;
    rates!: Table<Rates, string>;

    constructor() {
        super("GoalsDB");

        this.version(1).stores({
            goals: "++id",
            rates: "++id",
        });

        this.version(2).stores({
            goals: "++id",
            rates: "++id, currency, date",
        });
    }
}

export const db = new GoalsDB();
