"use client";

import { JSX, useCallback, useState } from "react";
import { PiPlus } from "react-icons/pi";

import { Modal } from "./ui/Modal";
import { db } from "@/db/db";
import { Currency } from "@/types/Currency";
import { Goal } from "@/types/GoalType";

type FormErrors = {
    name?: string;
    targetAmount?: string;
};

const AddGoal = (): JSX.Element => {
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("0");
    const [currency, setCurrency] = useState<Currency>("INR");
    const [errors, setErrors] = useState<FormErrors>({});

    // Client-side validation before persisting data
    const validate = useCallback((): boolean => {
        const nextErrors: FormErrors = {};

        if (!name.trim()) {
            nextErrors.name = "Goal name is required";
        } else if (name.trim().length < 3) {
            nextErrors.name = "Goal name must be at least 3 characters";
        }

        const amount = Number(targetAmount);
        if (!targetAmount) {
            nextErrors.targetAmount = "Target amount is required";
        } else if (Number.isNaN(amount) || amount <= 0) {
            nextErrors.targetAmount = "Target amount must be a positive number";
        } else if (amount > 100_000_000) {
            nextErrors.targetAmount = "Target amount is too large";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [name, targetAmount]);

    // Persist goal to local database
    const addGoal = useCallback(async (goal: Omit<Goal, "id">) => {
        await db.goals.add(goal);
    }, []);

    const resetForm = () => {
        setName("");
        setTargetAmount("0");
        setCurrency("INR");
        setErrors({});
    };

    return (
        <Modal
            trigger={
                <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-400 cursor-pointer bg-blue-600 p-2 text-base text-white shadow">
                    <PiPlus />
                    <span>Add Goal</span>
                </button>
            }
        >
            {({ closeModal }) => (
                <form
                    className="space-y-5"
                    onSubmit={async (event) => {
                        event.preventDefault();
                        if (!validate()) return;

                        await addGoal({
                            name: name.trim(),
                            targetAmount: Number(targetAmount),
                            remainingAmount: Number(targetAmount),
                            contributions: 0,
                            currency,
                        });

                        resetForm();
                        closeModal();
                    }}
                >
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                            Goal Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Buy a Playstation, Trip to Switzerland"
                            className={`w-full rounded-lg border-2 px-4 py-3 ${
                                errors.name
                                    ? "border-red-400"
                                    : "border-slate-200"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Target Amount
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={targetAmount}
                                onChange={(e) =>
                                    setTargetAmount(e.target.value)
                                }
                                className={`w-full rounded-lg border-2 px-4 py-3 ${
                                    errors.targetAmount
                                        ? "border-red-400"
                                        : "border-slate-200"
                                }`}
                            />
                            {errors.targetAmount && (
                                <p className="text-sm text-red-500">
                                    {errors.targetAmount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Currency
                            </label>
                            <select
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(e.target.value as Currency)
                                }
                                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 text-white"
                    >
                        Add Goal
                    </button>
                </form>
            )}
        </Modal>
    );
};

export default AddGoal;
