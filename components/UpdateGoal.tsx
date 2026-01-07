"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { PiPlus } from "react-icons/pi";
import { db, Currency } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

interface UpdateGoalProps {
    goalId: string;
}

export default function UpdateGoal({ goalId }: UpdateGoalProps) {
    const goal = useLiveQuery(() => db.goals.get(goalId), [goalId]);

    const [contributionAmount, setContributionAmount] = useState("0");
    const [errors, setErrors] = useState<{ contributionAmount?: string }>({});

    if (!goal) return null;

    const { targetAmount, remainingAmount, contributions, currency } = goal;

    const symbol = currency === "USD" ? "$" : "₹";

    const validate = (): boolean => {
        const newErrors: { contributionAmount?: string } = {};
        const amount = parseFloat(contributionAmount);

        if (!contributionAmount) {
            newErrors.contributionAmount = "Contribution amount is required";
        } else if (isNaN(amount) || amount <= 0) {
            newErrors.contributionAmount =
                "Contribution amount must be a positive number";
        } else if (amount > remainingAmount) {
            newErrors.contributionAmount =
                "Contribution must be ≤ remaining amount";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onUpdateGoal = async () => {
        const amount = parseFloat(contributionAmount);

        await db.goals.update(goalId, {
            remainingAmount: remainingAmount - amount,
            contributions: contributions + 1,
        });

        setContributionAmount("0");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        await onUpdateGoal();
        alert("Goal Updated Successfully!");
    };

    return (
        <Modal
            trigger={
                <button className="cursor-pointer p-2 border border-gray-400 rounded-lg shadow flex justify-center w-full bg-blue-600 text-white items-center space-x-2 text-base">
                    <PiPlus />
                    <span>Edit Goal</span>
                </button>
            }
        >
            <h1 className="text-2xl font-bold mb-5 text-center">
                Add Contributions
            </h1>

            <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                    <h4 className="text-lg font-semibold mb-2">
                        Target Amount:
                    </h4>
                    <h3 className="text-2xl text-blue-600 font-semibold">
                        {symbol} {targetAmount}
                    </h3>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-2">
                        Remaining Amount:
                    </h4>
                    <h3 className="text-2xl text-blue-600 font-semibold">
                        {symbol} {remainingAmount}
                    </h3>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={contributionAmount}
                            onChange={(e) =>
                                setContributionAmount(e.target.value)
                            }
                            className={`w-full px-4 py-3 rounded-lg border-2 ${
                                errors.contributionAmount
                                    ? "border-red-400"
                                    : "border-slate-200"
                            }`}
                        />
                        {errors.contributionAmount && (
                            <p className="text-red-500 text-sm">
                                {errors.contributionAmount}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Currency
                        </label>
                        <select
                            value={currency}
                            disabled
                            className="text-gray-600 w-full px-4 py-3 rounded-lg border-2 border-slate-200"
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg"
                >
                    Update Goal
                </button>
            </form>
        </Modal>
    );
}
