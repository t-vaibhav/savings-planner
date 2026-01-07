import { DashBoardItemsProps } from "@/types/props/PropTypes";
import { JSX } from "react";

const DashboardItem = ({
    icon,
    iconText,
    primaryText,
    secondaryText,
}: DashBoardItemsProps): JSX.Element => {
    return (
        <div className="rounded-lg bg-blue-600 p-3">
            <div className="flex items-center gap-2">
                {icon}
                <span>{iconText}</span>
            </div>

            <p className="text-2xl font-bold">{primaryText}</p>

            <p className="text-sm font-medium text-gray-300">{secondaryText}</p>
        </div>
    );
};

export default DashboardItem;
