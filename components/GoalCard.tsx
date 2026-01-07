import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import ProgressBar from "./ProgressBar";
import { PiCurrencyInrBold, PiPlus } from "react-icons/pi";
import { BiDollar } from "react-icons/bi";
// import UpdateGoal from "./UpdateGoal";
import { dollarToInr, inrToDollar } from "@/util/fetchRates";
type GoalCardProps = {
    index: string;
    title?: String;
    targetAmount: number;
    remainingAmount: number;
    currency?: String;
};

export default function GoalCard({
    index,
    title,
    targetAmount,
    remainingAmount,
    currency,
}: GoalCardProps) {
    const progress = Math.floor(
        ((targetAmount - remainingAmount) / targetAmount) * 100
    );
    const [convertedTarget, setConvertedTarget] =
        useState<number>(targetAmount);

    const symbol = currency === "USD" ? "$" : "₹";
    useEffect(() => {
        const convertAmount = async () => {
            try {
                let rate: number | null = null;

                if (currency === "USD") {
                    rate = await dollarToInr(); // USD -> INR
                } else {
                    rate = await inrToDollar(); // INR -> USD
                }

                if (!rate) return;

                setConvertedTarget(targetAmount * rate);
            } catch (error) {
                console.error("Exchange rate fetch failed", error);
            }
        };

        convertAmount();
    }, [currency, targetAmount]);
    return (
        <div className="p-5 shadow rounded-xl border border-gray-500">
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
                <span className="text-sm font-medium">1 contributions</span>
                <span className="text-sm font-medium">
                    {symbol}
                    {remainingAmount} remaining
                </span>
            </div>
            <button className="p-3 w-full rounded-lg bg-blue-600 text-large text-white font-semibold">
                Add Contribution
            </button>
        </div>
    );
}
