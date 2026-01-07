"use client";

import { JSX, useCallback, useState } from "react";
import { PiPlus } from "react-icons/pi";
import { useLiveQuery } from "dexie-react-hooks";

import { Modal } from "./ui/Modal";
import { db } from "@/db/db";
import { UpdateGoalProps } from "@/types/props/PropTypes";

type FormErrors = {
    contributionAmount?: string;
    contributionDate?: string;
};

const UpdateGoal = ({ goalId }: UpdateGoalProps): JSX.Element | null => {
    const goal = useLiveQuery(() => db.goals.get(goalId), [goalId]);

    const [contributionAmount, setContributionAmount] = useState("");
    const [contributionDate, setContributionDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [errors, setErrors] = useState<FormErrors>({});

    if (!goal) return null;

    const { targetAmount, remainingAmount, contributions, currency } = goal;

    const symbol = currency === "USD" ? "$" : "₹";

    // Validate contribution before updating state
    const validate = useCallback((): boolean => {
        const nextErrors: FormErrors = {};
        const amount = Number(contributionAmount);

        if (!contributionAmount) {
            nextErrors.contributionAmount = "Contribution amount is required";
        } else if (Number.isNaN(amount) || amount <= 0) {
            nextErrors.contributionAmount =
                "Contribution must be a positive number";
        } else if (amount > remainingAmount) {
            nextErrors.contributionAmount =
                "Contribution must be ≤ remaining amount";
        }

        if (!contributionDate) {
            nextErrors.contributionDate = "Date is required";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [contributionAmount, contributionDate, remainingAmount]);

    // Persist contribution and update goal atomically
    const updateGoal = useCallback(async () => {
        const amount = Number(contributionAmount);

        await db.transaction("rw", db.goals, db.contributions, async () => {
            await db.contributions.add({
                goalId,
                amount,
                date: new Date(contributionDate),
            });

            await db.goals.update(goalId, {
                remainingAmount: remainingAmount - amount,
                contributions: contributions + 1,
            });
        });

        setContributionAmount("");
    }, [
        goalId,
        contributionAmount,
        contributionDate,
        remainingAmount,
        contributions,
    ]);

    return (
        <Modal
            trigger={
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-400 bg-blue-600 p-2 text-base text-white shadow">
                    <PiPlus />
                    <span>Edit Goal</span>
                </button>
            }
        >
            {({ closeModal }) => (
                <>
                    <h1 className="mb-5 text-center text-2xl font-bold">
                        Add Contribution
                    </h1>

                    <div className="mb-5 grid grid-cols-2 gap-5">
                        <div>
                            <h4 className="mb-2 text-lg font-semibold">
                                Target Amount
                            </h4>
                            <h3 className="text-2xl font-semibold text-blue-600">
                                {symbol} {targetAmount}
                            </h3>
                        </div>

                        <div>
                            <h4 className="mb-2 text-lg font-semibold">
                                Remaining Amount
                            </h4>
                            <h3 className="text-2xl font-semibold text-blue-600">
                                {symbol} {remainingAmount}
                            </h3>
                        </div>
                    </div>

                    <form
                        className="space-y-5"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            if (!validate()) return;

                            await updateGoal();
                            closeModal();
                        }}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={contributionAmount}
                                    onChange={(e) =>
                                        setContributionAmount(e.target.value)
                                    }
                                    className={`w-full rounded-lg border-2 px-4 py-3 ${
                                        errors.contributionAmount
                                            ? "border-red-400"
                                            : "border-slate-200"
                                    }`}
                                />
                                {errors.contributionAmount && (
                                    <p className="text-sm text-red-500">
                                        {errors.contributionAmount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Contribution Date
                                </label>
                                <input
                                    type="date"
                                    value={contributionDate}
                                    onChange={(e) =>
                                        setContributionDate(e.target.value)
                                    }
                                    className={`w-full rounded-lg border-2 px-4 py-3 ${
                                        errors.contributionDate
                                            ? "border-red-400"
                                            : "border-slate-200"
                                    }`}
                                />
                                {errors.contributionDate && (
                                    <p className="text-sm text-red-500">
                                        {errors.contributionDate}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-3 text-white"
                        >
                            Update Goal
                        </button>
                    </form>
                </>
            )}
        </Modal>
    );
};

export default UpdateGoal;
