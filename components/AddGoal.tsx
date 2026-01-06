"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { PiPlus } from "react-icons/pi";
import { db, Goal, Currency } from "@/lib/db";

export default function AddGoal() {
    return (
        <div>
            <Modal
                trigger={
                    <button className="cursor-pointer p-2 border border-gray-400 rounded-lg shadow flex justify-center bg-blue-600 text-white items-center space-x-2 text-base">
                        <PiPlus />
                        <span>Add Goal</span>
                    </button>
                }
            >
                <div className="space-y-4">
                    <h1>Form Heading</h1>
                    <h2 className="max-w-[50vw]">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Id cum eaque quaerat temporibus magnam doloremque,
                        alias ullam, eum quam saepe illum nostrum, corrupti
                        consequuntur. Nisi id iste assumenda, qui perspiciatis
                        doloribus, ducimus consequuntur, ratione vel cupiditate
                        a placeat illum quas.
                    </h2>
                </div>
            </Modal>
        </div>
    );
}
