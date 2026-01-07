"use client";

import AddGoal from "@/components/AddGoal";
import DashboardItem from "@/components/DashboardItem";
import GoalCard from "@/components/GoalCard";
import NoGoals from "@/components/NoGoals";

import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

import { useEffect, useState } from "react";
import { BiRefresh, BiWallet } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiTarget } from "react-icons/fi";

import { dollarToInr } from "@/util/fetchRates";
import { SlCalender } from "react-icons/sl";

type Currency = "INR" | "USD";

export default function Home() {
    const goals = useLiveQuery(
        async () => {
            const allGoals = await db.goals.toArray();

            return allGoals.sort((a, b) => {
                const aCompleted = a.remainingAmount === 0;
                const bCompleted = b.remainingAmount === 0;

                if (aCompleted !== bCompleted) {
                    return aCompleted ? 1 : -1;
                }

                return (b.id ?? 0) - (a.id ?? 0);
            });
        },
        [],
        []
    );

    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [exchangeRateDate, setExchangeRateDate] = useState<Date>();

    const [stats, setStats] = useState<{
        totalTarget: number;
        totalRemaining: number;
    }>({
        totalTarget: 0,
        totalRemaining: 0,
    });

    const fetchRate = async () => {
        try {
            const rate = await dollarToInr();
            if (!rate) return;

            const now = new Date(); // IST (browser local)

            await db.rates.add({
                rate,
                currency: "USD",
                date: now,
            });

            setExchangeRate(rate);
            setExchangeRateDate(now);
        } catch (err) {
            console.error("Exchange rate fetch failed", err);
        }
    };

    useEffect(() => {
        if (!goals) return;

        const totals = goals.reduce(
            (acc, goal) => {
                const target =
                    goal.currency === "USD"
                        ? goal.targetAmount * exchangeRate
                        : goal.targetAmount;

                const remaining =
                    goal.currency === "USD"
                        ? goal.remainingAmount * exchangeRate
                        : goal.remainingAmount;

                acc.totalTarget += target;
                acc.totalRemaining += remaining;

                return acc;
            },
            { totalTarget: 0, totalRemaining: 0 }
        );

        setStats(totals);
    }, [goals, exchangeRate]);

    useEffect(() => {
        fetchRate();
    }, []);

    return (
        <div className="min-h-screen bg-blue-100 px-32 py-10 space-y-5">
            <h1 className="text-4xl font-semibold text-center">
                Syfe Savings Planner
            </h1>

            <div className="bg-blue-700 text-white min-h-20 p-5">
                <div className="flex justify-between mb-3">
                    <div className="flex space-x-2 items-center py-1 px-2">
                        <BsGraphUpArrow />
                        <span>Financial Overview</span>
                    </div>

                    <button
                        onClick={fetchRate}
                        className="hover:scale-105 active:scale-95 cursor-pointer duration-300 flex space-x-2 items-center bg-blue-600 py-1 px-2 rounded-lg"
                    >
                        <BiRefresh />
                        <span>Refresh Rates</span>
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                    <DashboardItem
                        icon={<FiTarget />}
                        iconText="Total Target"
                        primaryText={`₹ ${stats.totalTarget}`}
                        secondaryText={`$ ${Math.floor(
                            stats.totalTarget / exchangeRate
                        )}`}
                    />

                    <DashboardItem
                        icon={<BiWallet />}
                        iconText="Total Saved"
                        primaryText={`₹ ${
                            stats.totalTarget - stats.totalRemaining
                        }`}
                        secondaryText={`$ ${Math.floor(
                            (stats.totalTarget - stats.totalRemaining) /
                                exchangeRate
                        )}`}
                    />

                    <DashboardItem
                        icon={<SlCalender />}
                        iconText="Overall Progress"
                        primaryText={`${
                            stats.totalTarget > 0
                                ? Math.floor(
                                      ((stats.totalTarget -
                                          stats.totalRemaining) /
                                          stats.totalTarget) *
                                          100 *
                                          100
                                  ) / 100
                                : "0.00"
                        } %`}
                        secondaryText={`Total Goal Completetion`}
                    />
                </div>

                <hr className="my-3" />

                <div className="flex justify-between">
                    <span>Exchange Rate : 1 USD = {exchangeRate}</span>
                    <span>
                        Last updated:{" "}
                        {exchangeRateDate
                            ? exchangeRateDate.toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                              })
                            : "—"}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Your Goals</h3>
                <AddGoal />
            </div>

            {goals && goals.length > 0 ? (
                <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                    {goals.map((item, index) => (
                        <GoalCard
                            key={item.id ?? index}
                            index={item.id}
                            title={item.name}
                            targetAmount={item.targetAmount}
                            remainingAmount={item.remainingAmount}
                            contributions={item.contributions ?? 0}
                            currency={item.currency}
                        />
                    ))}
                </div>
            ) : (
                <NoGoals />
            )}
        </div>
    );
}
