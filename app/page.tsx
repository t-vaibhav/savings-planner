"use client";

import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { BiRefresh, BiWallet } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiTarget } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";

import AddGoal from "@/components/AddGoal";
import GoalCard from "@/components/GoalCard";
import DashboardItem from "@/components/ui/DashboardItem";
import NoGoals from "@/components/ui/NoGoals";
import Loader from "@/components/ui/Loader";

import { db } from "@/db/db";
import { dollarToInr } from "@/lib/fetchRates";

type Stats = {
    totalTarget: number;
    totalRemaining: number;
};

const Home = (): JSX.Element => {
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

    const [exchangeRate, setExchangeRate] = useState(1);
    const [exchangeRateDate, setExchangeRateDate] = useState<Date>();
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState<Stats>({
        totalTarget: 0,
        totalRemaining: 0,
    });

    // Fetch and persist latest exchange rate
    const fetchRate = useCallback(async () => {
        try {
            setIsLoading(true);

            const rate = await dollarToInr();
            if (!rate) return;

            const now = new Date();

            await db.rates.add({
                rate,
                currency: "USD",
                date: now,
            });

            setExchangeRate(rate);
            setExchangeRateDate(now);
        } catch (error) {
            console.error("Exchange rate fetch failed", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Aggregate goal statistics in INR
    useEffect(() => {
        if (!goals) return;

        const totals = goals.reduce(
            (acc, goal) => {
                const rate = goal.currency === "USD" ? exchangeRate : 1;

                acc.totalTarget += goal.targetAmount * rate;
                acc.totalRemaining += goal.remainingAmount * rate;

                return acc;
            },
            { totalTarget: 0, totalRemaining: 0 }
        );

        setStats(totals);
    }, [goals, exchangeRate]);

    useEffect(() => {
        fetchRate();
    }, [fetchRate]);

    useEffect(() => {
        if (goals) {
            setIsLoading(false);
        }
    }, [goals]);

    const totalSaved = useMemo(
        () => stats.totalTarget - stats.totalRemaining,
        [stats]
    );

    if (isLoading || !goals) {
        return (
            <div className="min-h-screen bg-blue-100 px-5 py-10">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-5 bg-blue-100 px-5 py-10 md:px-10 lg:px-20 xl:px-32">
            <h1 className="text-center text-4xl font-semibold">
                Syfe Savings Planner
            </h1>

            <div className="min-h-20 bg-blue-700 p-5 text-white">
                <div className="mb-3 flex justify-between">
                    <div className="flex items-center gap-2 px-2 py-1">
                        <BsGraphUpArrow />
                        <span>Financial Overview</span>
                    </div>

                    <button
                        onClick={fetchRate}
                        disabled={isLoading}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-2 py-1 duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <BiRefresh />
                        <span className="hidden md:block">Refresh Rates</span>
                        <span className="block md:hidden">Refresh</span>
                    </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
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
                        primaryText={`₹ ${totalSaved}`}
                        secondaryText={`$ ${Math.floor(
                            totalSaved / exchangeRate
                        )}`}
                    />

                    <DashboardItem
                        icon={<SlCalender />}
                        iconText="Overall Progress"
                        primaryText={`${
                            stats.totalTarget > 0
                                ? Math.floor(
                                      (totalSaved / stats.totalTarget) * 10000
                                  ) / 100
                                : "0.00"
                        } %`}
                        secondaryText="Total Goal Completion"
                    />
                </div>

                <hr className="my-3" />

                <div className="flex flex-col items-start justify-between text-sm md:flex-row md:text-base">
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

            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Your Goals</h3>
                <AddGoal />
            </div>

            {goals.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal, index) => (
                        <GoalCard
                            key={goal.id ?? index}
                            index={goal.id ?? index}
                            title={goal.name}
                            targetAmount={goal.targetAmount}
                            remainingAmount={goal.remainingAmount}
                            contributions={goal.contributions ?? 0}
                            currency={goal.currency}
                        />
                    ))}
                </div>
            ) : (
                <NoGoals />
            )}
        </div>
    );
};

export default Home;
