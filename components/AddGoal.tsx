"use client";
import React, { useState } from "react";
import { Modal } from "./Modal";
import { PiPlus } from "react-icons/pi";
import { db, Goal, Currency } from "@/lib/db";

export default function AddGoal() {
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("0");
    const [currency, setCurrency] = useState<Currency>("INR");

    const [errors, setErrors] = useState<{
        name?: string;
        targetAmount?: string;
    }>({});

    const validate = (): boolean => {
        const newErrors: { name?: string; targetAmount?: string } = {};

        if (!name.trim()) {
            newErrors.name = "Goal name is required";
        } else if (name.trim().length < 3) {
            newErrors.name = "Goal name must be at least 3 characters";
        }

        const amount = parseFloat(targetAmount);
        if (!targetAmount) {
            newErrors.targetAmount = "Target amount is required";
        } else if (isNaN(amount) || amount <= 0) {
            newErrors.targetAmount = "Target amount must be a positive number";
        } else if (amount > 100000000) {
            newErrors.targetAmount = "Target amount is too large";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onAddGoal = async (
        name: string,
        targetAmount: number,
        currency: Currency
    ) => {
        await db.goals.add({
            name,
            targetAmount,
            remainingAmount: targetAmount,
            contributions: 0,
            currency,
        } as Omit<Goal, "id">);
    };

    const resetForm = () => {
        setName("");
        setTargetAmount("0");
        setCurrency("INR");
        setErrors({});
    };

    return (
        <Modal
            trigger={
                <button className="cursor-pointer p-2 border border-gray-400 rounded-lg shadow flex justify-center bg-blue-600 text-white items-center space-x-2 text-base">
                    <PiPlus />
                    <span>Add Goal</span>
                </button>
            }
        >
            {({ closeModal }) => (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!validate()) return;

                        await onAddGoal(
                            name.trim(),
                            parseFloat(targetAmount),
                            currency
                        );

                        resetForm();
                        closeModal(); // ✅ CLOSE MODAL AFTER SUCCESS
                    }}
                    className="space-y-5"
                >
                    {/* Goal Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Goal Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Buy a Playstation, Trip to Switzerland"
                            className={`w-full px-4 py-3 rounded-lg border-2 ${
                                errors.name
                                    ? "border-red-400"
                                    : "border-slate-200"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Target + Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Target Amount
                            </label>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={(e) =>
                                    setTargetAmount(e.target.value)
                                }
                                min={0}
                                className={`w-full px-4 py-3 rounded-lg border-2 ${
                                    errors.targetAmount
                                        ? "border-red-400"
                                        : "border-slate-200"
                                }`}
                            />
                            {errors.targetAmount && (
                                <p className="text-red-500 text-sm">
                                    {errors.targetAmount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Currency
                            </label>
                            <select
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(e.target.value as Currency)
                                }
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg cursor-pointer"
                    >
                        Add Goal
                    </button>
                </form>
            )}
        </Modal>
    );
}
