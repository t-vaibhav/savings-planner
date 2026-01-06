"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    title?: string;
}

export function Modal({ trigger, children, title }: ModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return <div onClick={() => setIsOpen(true)}>{trigger}</div>;
    }

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50 p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-5">{children}</div>
        </div>
    );

    return (
        <>
            <div onClick={() => setIsOpen(true)}>{trigger}</div>
            {createPortal(modalContent, document.body)}
        </>
    );
}
