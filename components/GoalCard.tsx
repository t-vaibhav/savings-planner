import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import ProgressBar from "./ProgressBar";
import { PiCurrencyInrBold, PiPlus } from "react-icons/pi";
import { BiDollar } from "react-icons/bi";
import UpdateGoal from "./UpdateGoal";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import { TiTick } from "react-icons/ti";

type GoalCardProps = {
    index: string;
    title?: string;
    targetAmount: number;
    contributions: number;
    remainingAmount: number;
    currency?: string;
};

export default function GoalCard({
    index,
    title,
    targetAmount,
    remainingAmount,
    contributions,
    currency,
}: GoalCardProps) {
    const progress = Math.floor(
        ((targetAmount - remainingAmount) / targetAmount) * 100
    );
    const [convertedTarget, setConvertedTarget] =
        useState<number>(targetAmount);

    const symbol = currency === "USD" ? "$" : "₹";
    const usdRate = useLiveQuery(
        async () => {
            const latest = await db.rates
                .where("currency")
                .equals("USD")
                .last(); // latest entry

            return latest?.rate ?? 1;
        },
        [],
        1
    );
    useEffect(() => {
        if (!usdRate) return;

        let rate = 1;

        if (currency === "USD") {
            rate = usdRate;
        } else {
            rate = 1 / usdRate;
        }

        const value = targetAmount * rate;

        const flooredValue = Math.floor(value * 100) / 100;

        setConvertedTarget(flooredValue);
    }, [currency, targetAmount, usdRate]);

    return (
        <div className="p-5 bg-white shadow rounded-xl border border-gray-500">
            <div className="flex justify-between">
                <span className="text-lg font-semibold">{title}</span>
                <span className="text-sm bg-gray-300 p-1 rounded-xl px-2">
                    {progress}%
                </span>
            </div>
            <div className="mb-5">
                <p className="text-2xl flex space-x-1 font-bold text-blue-700">
                    <span className=" ">{symbol}</span>
                    <span>{`${targetAmount}`}</span>
                </p>
                <p className="text-sm flex space-x-1 text-gray-600 font-medium">
                    <span className=" ">{currency === "INR" ? "$" : "₹"}</span>

                    <span>{`${convertedTarget}`}</span>
                </p>
            </div>
            <div className="flex justify-between">
                <span className="text-base font-medium">Progress</span>
                <span className="text-base font-medium">
                    {symbol}
                    {targetAmount - remainingAmount} saved
                </span>
            </div>
            <div>
                <ProgressBar progress={progress} />
            </div>
            <div className="flex justify-between text-gray-700 my-3">
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
                <button className="cursor-pointer p-2 border border-gray-400 rounded-lg shadow flex justify-center w-full bg-green-600 text-white items-center space-x-2 text-base">
                    <TiTick />
                    <span>Completed</span>
                </button>
            ) : (
                <UpdateGoal goalId={parseInt(index)} />
            )}
        </div>
    );
}
