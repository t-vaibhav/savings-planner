import { JSX, useEffect, useMemo, useState } from "react";
import { TiTick } from "react-icons/ti";
import { useLiveQuery } from "dexie-react-hooks";

import ProgressBar from "./ui/ProgressBar";
import UpdateGoal from "./UpdateGoal";
import { db } from "@/db/db";
import { GoalCardProps } from "@/types/props/PropTypes";

const GoalCard = ({
    index,
    title,
    targetAmount,
    remainingAmount,
    contributions,
    currency,
}: GoalCardProps): JSX.Element => {
    // Percentage progress derived from amounts
    const progress = useMemo(() => {
        return Math.floor(
            ((targetAmount - remainingAmount) / targetAmount) * 100
        );
    }, [targetAmount, remainingAmount]);

    const [convertedTarget, setConvertedTarget] =
        useState<number>(targetAmount);

    const symbol = currency === "USD" ? "$" : "₹";

    // Fetch latest USD rate from local DB
    const usdRate = useLiveQuery(
        async () => {
            const latest = await db.rates
                .where("currency")
                .equals("USD")
                .last();

            return latest?.rate ?? 1;
        },
        [],
        1
    );

    // Convert target amount based on selected currency
    useEffect(() => {
        if (!usdRate) return;

        const rate = currency === "USD" ? usdRate : 1 / usdRate;

        const value = targetAmount * rate;

        setConvertedTarget(Math.floor(value * 100) / 100);
    }, [currency, targetAmount, usdRate]);

    return (
        <div className="rounded-xl border border-gray-500 bg-white p-5 shadow">
            <div className="flex justify-between">
                <span className="text-lg font-semibold">{title}</span>
                <span className="rounded-xl bg-gray-300 px-2 py-1 text-sm">
                    {progress}%
                </span>
            </div>

            <div className="mb-5">
                <p className="flex items-center space-x-1 text-2xl font-bold text-blue-700">
                    <span>{symbol}</span>
                    <span>{targetAmount}</span>
                </p>
                <p className="flex items-center space-x-1 text-sm font-medium text-gray-600">
                    <span>{currency === "INR" ? "$" : "₹"}</span>
                    <span>{convertedTarget}</span>
                </p>
            </div>

            <div className="flex justify-between">
                <span className="text-base font-medium">Progress</span>
                <span className="text-base font-medium">
                    {symbol}
                    {targetAmount - remainingAmount} saved
                </span>
            </div>

            <ProgressBar progress={progress} />

            <div className="my-3 flex justify-between text-gray-700">
                <span className="text-sm font-medium">
                    {contributions === 0
                        ? "No Contribution"
                        : contributions === 1
                        ? "1 Contribution"
                        : `${contributions} contributions`}
                </span>
                <span className="text-sm font-medium">
                    {symbol}
                    {remainingAmount} remaining
                </span>
            </div>

            {progress === 100 ? (
                <button className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-400 bg-green-600 p-2 text-base text-white shadow">
                    <TiTick />
                    <span>Completed</span>
                </button>
            ) : (
                <UpdateGoal goalId={index} />
            )}
        </div>
    );
};

export default GoalCard;
