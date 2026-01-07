import { ReactNode } from "react";

export type UpdateGoalProps = {
    goalId: number;
};

export type GoalCardProps = {
    index: number;
    title?: string;
    targetAmount: number;
    contributions: number;
    remainingAmount: number;
    currency?: string;
};

export type DashBoardItemsProps = {
    icon: ReactNode;
    iconText: String;
    primaryText: String;
    secondaryText: String;
    amount?: number;
};

export type ModalProps = {
    trigger: React.ReactNode;
    children: (props: { closeModal: () => void }) => React.ReactNode;
    title?: string;
};

export type ProgressBarProps = {
    progress: number;
};
