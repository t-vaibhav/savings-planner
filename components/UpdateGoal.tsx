"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { PiPlus } from "react-icons/pi";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

interface UpdateGoalProps {
    goalId: number;
}

export default function UpdateGoal({ goalId }: UpdateGoalProps) {
    const goal = useLiveQuery(() => db.goals.get(goalId), [goalId]);

    const [contributionAmount, setContributionAmount] = useState("");
    const [contributionDate, setContributionDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [errors, setErrors] = useState<{
        contributionAmount?: string;
        contributionDate?: string;
    }>({});

    if (!goal) return null;

    const { targetAmount, remainingAmount, contributions, currency } = goal;
    const symbol = currency === "USD" ? "$" : "₹";

    /* ---------------- Validation ---------------- */

    const validate = (): boolean => {
        const newErrors: typeof errors = {};
        const amount = Number(contributionAmount);

        if (!contributionAmount) {
            newErrors.contributionAmount = "Contribution amount is required";
        } else if (isNaN(amount) || amount <= 0) {
            newErrors.contributionAmount =
                "Contribution must be a positive number";
        } else if (amount > remainingAmount) {
            newErrors.contributionAmount =
                "Contribution must be ≤ remaining amount";
        }

        if (!contributionDate) {
            newErrors.contributionDate = "Date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- Update Logic ---------------- */

    const onUpdateGoal = async () => {
        const amount = Number(contributionAmount);

        await db.transaction("rw", db.goals, db.contributions, async () => {
            // 1️⃣ Add contribution
            await db.contributions.add({
                goalId,
                amount,
                date: new Date(contributionDate),
            });

            // 2️⃣ Update goal summary
            await db.goals.update(goalId, {
                remainingAmount: remainingAmount - amount,
                contributions: contributions + 1,
            });
        });

        setContributionAmount("");
    };

    /* ---------------- UI ---------------- */

    return (
        <Modal
            trigger={
                <button className="cursor-pointer p-2 border border-gray-400 rounded-lg shadow flex justify-center w-full bg-blue-600 text-white items-center space-x-2 text-base">
                    <PiPlus />
                    <span>Edit Goal</span>
                </button>
            }
        >
            {({ closeModal }) => (
                <>
                    <h1 className="text-2xl font-bold mb-5 text-center">
                        Add Contribution
                    </h1>

                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">
                                Target Amount
                            </h4>
                            <h3 className="text-2xl text-blue-600 font-semibold">
                                {symbol} {targetAmount}
                            </h3>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-2">
                                Remaining Amount
                            </h4>
                            <h3 className="text-2xl text-blue-600 font-semibold">
                                {symbol} {remainingAmount}
                            </h3>
                        </div>
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!validate()) return;

                            await onUpdateGoal();
                            closeModal();
                        }}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    min="0"
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

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Contribution Date
                                </label>
                                <input
                                    type="date"
                                    value={contributionDate}
                                    onChange={(e) =>
                                        setContributionDate(e.target.value)
                                    }
                                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                                        errors.contributionDate
                                            ? "border-red-400"
                                            : "border-slate-200"
                                    }`}
                                />
                                {errors.contributionDate && (
                                    <p className="text-red-500 text-sm">
                                        {errors.contributionDate}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg"
                        >
                            Update Goal
                        </button>
                    </form>
                </>
            )}
        </Modal>
    );
}
