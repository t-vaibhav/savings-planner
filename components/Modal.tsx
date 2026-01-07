"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    trigger: React.ReactNode;
    children: (props: { closeModal: () => void }) => React.ReactNode;
    title?: string;
}

export function Modal({ trigger, children, title }: ModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const openModal = () => {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
    };

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 400);
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeModal();
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
            closeModal();
        }
    };

    if (!isOpen) {
        return <div onClick={openModal}>{trigger}</div>;
    }

    const modalContent = (
        <div
            onClick={handleOverlayClick}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30
            transition-opacity duration-400 ease-out
            ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-lg p-5
                transform transition-all duration-400 ease-out
                ${
                    isVisible
                        ? "scale-100 translate-y-0 opacity-100"
                        : "scale-95 translate-y-2 opacity-0"
                }`}
            >
                {children({ closeModal })}
            </div>
        </div>
    );

    return (
        <>
            <div onClick={openModal}>{trigger}</div>
            {createPortal(modalContent, document.body)}
        </>
    );
}
