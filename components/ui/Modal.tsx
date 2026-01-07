"use client";

import { ModalProps } from "@/types/props/PropTypes";
import { JSX, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Animation timing shared between opacity and transform transitions
const ANIMATION_DURATION_MS = 400;

export function Modal({ trigger, children }: ModalProps): JSX.Element {
    // Controls portal mounting
    const [isOpen, setIsOpen] = useState(false);

    // Controls enter/exit animation state
    const [isVisible, setIsVisible] = useState(false);

    // Open modal and trigger enter animation on next frame
    const openModal = useCallback(() => {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    // Start exit animation, then unmount after transition completes
    const closeModal = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), ANIMATION_DURATION_MS);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        // Close modal on Escape key
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, closeModal]);

    // Close modal only when clicking on the overlay, not the content
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    // Render trigger only when modal is closed
    if (!isOpen) {
        return <div onClick={openModal}>{trigger}</div>;
    }

    const modalContent = (
        <div
            onClick={handleOverlayClick}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30
                transition-opacity duration-[${ANIMATION_DURATION_MS}ms] ease-out
                ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
            <div
                className={`mx-5 rounded-lg bg-white p-5
                    transform transition-all duration-[${ANIMATION_DURATION_MS}ms] ease-out
                    ${
                        isVisible
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-2 scale-95 opacity-0"
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
