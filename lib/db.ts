import Dexie, { Table } from "dexie";

export type Currency = "INR" | "USD";

export interface Goal {
    id?: string;
    name: string;
    targetAmount: number;
    remainingAmount: number;
    contributions?: number;
    currency: Currency;
}

class GoalsDB extends Dexie {
    goals!: Table<Goal, string>;

    constructor() {
        super("GoalsDB");
        this.version(1).stores({
            goals: "++id", // primary key
        });
    }
}

export const db = new GoalsDB();
