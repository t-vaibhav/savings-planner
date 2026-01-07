import Dexie, { Table } from "dexie";

export type Currency = "INR" | "USD";

export interface Goal {
    id?: number;
    name: string;
    targetAmount: number;
    remainingAmount: number;
    contributions: number;
    currency: Currency;
}

export interface Rates {
    id?: number;
    rate: number;
    date: Date;
    currency: Currency;
}

export interface Contribution {
    id?: number;
    goalId: number;
    amount: number;
    date: Date;
}

class GoalsDB extends Dexie {
    goals!: Table<Goal, number>;
    rates!: Table<Rates, number>;
    contributions!: Table<Contribution, number>;

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

        this.version(3).stores({
            goals: "++id",
            rates: "++id, currency, date",
            contributions: "++id, goalId, date",
        });

        this.version(4).stores({
            goals: "++id, remainingAmount",
            rates: "++id, currency, date",
            contributions: "++id, goalId, date",
        });
    }
}

export const db = new GoalsDB();
