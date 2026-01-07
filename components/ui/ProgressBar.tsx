import { ProgressBarProps } from "@/types/props/PropTypes";
import { JSX } from "react";

export default function ProgressBar({
    progress,
}: ProgressBarProps): JSX.Element {
    return (
        <div className="relative w-full h-2 rounded-3xl bg-gray-400 overflow-hidden">
            <div
                className="absolute inset-y-0 left-0 bg-black rounded-3xl transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
