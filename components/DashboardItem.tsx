import React, { ReactNode } from "react";
import { IconType } from "react-icons";

type DashBoardItemsProps = {
    icon: ReactNode;
    iconText: String;
    primaryText: String;
    secondaryText: String;
    amount?: number;
};

export default function DashboardItem({
    icon,
    iconText,
    primaryText,
    secondaryText,
}: DashBoardItemsProps) {
    return (
        <div>
            <div className="flex items-center space-x-2">
                {icon}
                <span>{iconText}</span>
            </div>
            <p className="text-2xl font-bold ">{primaryText}</p>
            <p className="text-sm text-gray-300 font-medium">{secondaryText}</p>
        </div>
    );
}
