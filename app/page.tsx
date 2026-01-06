"use client";
import AddGoal from "@/components/AddGoal";
import DashboardItem from "@/components/DashboardItem";
import GoalCard from "@/components/GoalCard";
import { Modal } from "@/components/Modal";
import NoGoals from "@/components/NoGoals";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";
import { FiTarget } from "react-icons/fi";
import { PiPlus } from "react-icons/pi";
import axios from "axios";

type Currency = "INR" | "USD";

export default function Home() {
    const [goals, setGoals] = useState<
        Array<{
            id?: string;
            name: string;
            targetAmount: number;
            remainingAmount: number;
            currency: Currency;
        }>
    >([]);
    console.log(goals);
    useEffect(() => {
        const loadGoals = async () => {
            const allGoals = await db.goals.toArray();
            setGoals(allGoals);
        };

        loadGoals();
    }, []);
    const [exchangeRate, setExchangeRate] = useState<number>(1);

    useEffect(() => {
        const convertAmount = async () => {
            try {
                let rate: number | null = null;
                rate = await dollarToInr();
                if (!rate) return;
                setExchangeRate(rate);
            } catch (error) {
                console.error("Exchange rate fetch failed", error);
            }
        };

        convertAmount();
    }, []);
    return (
        <div className="min-h-screen px-32 py-10 space-y-5">
            <h1 className="text-4xl font-semibold text-center">
                Syfe Savings Planner
            </h1>
            <div className="bg-blue-700 text-white min-h-20 p-5">
                <div className="flex justify-between mb-3">
                    <div className="flex space-x-2 items-center py-1 px-2">
                        <BsGraphUpArrow />
                        <span className="">Financial Overview</span>
                    </div>
                    <button className=" flex space-x-2 items-center bg-blue-600 py-1 px-2 rounded-lg">
                        <BiRefresh />
                        <span className="">Refresh Rates</span>
                    </button>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                    {/* target */}
                    <DashboardItem
                        icon={<FiTarget />}
                        iconText={"Total Targets"}
                        primaryText={"$ 12,23,324"}
                        secondaryText={"$ 23,324"}
                    />
                    <DashboardItem
                        icon={<FiTarget />}
                        iconText={"Total Targets"}
                        primaryText={"$ 12,23,324"}
                        secondaryText={"$ 23,324"}
                    />
                    <DashboardItem
                        icon={<FiTarget />}
                        iconText={"Total Targets"}
                        primaryText={"$ 12,23,324"}
                        secondaryText={"$ 23,324"}
                    />
                </div>

                <hr className="my-3" />
                <div className="flex justify-between ">
                    <span>Exchange Rate : 1 USD = {exchangeRate}</span>
                    <span>Last updated : 19-11-24</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Your Goals</h3>
                <AddGoal />
            </div>
            {goals.length > 0 ? (
                <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                    {goals.map((item, index) => (
                        <GoalCard
                            index={item.id}
                            key={item.id ?? index}
                            title={item.name}
                            targetAmount={item.targetAmount}
                            remainingAmount={item.remainingAmount}
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
