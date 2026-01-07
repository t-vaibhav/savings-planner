import { Contribution } from "@/types/COntributions";
import { Goal } from "@/types/GoalType";
import { Rates } from "@/types/Rates";
import Dexie, { Table } from "dexie";

class GoalsDB extends Dexie {
    goals!: Table<Goal, number>;
    rates!: Table<Rates, number>;
    contributions!: Table<Contribution, number>;

    constructor() {
        super("GoalsDB");

        this.version(1).stores({
            goals: "++id, remainingAmount",
            rates: "++id, currency, date",
            contributions: "++id, goalId, date",
        });
    }
}

export const db = new GoalsDB();
