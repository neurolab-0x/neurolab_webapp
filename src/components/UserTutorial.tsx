import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';

interface TourStep {
    id: string;
    title: string;
    desc: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
    {
        id: 'tour-session',
        title: 'Live Neural Sessions',
        desc: 'Connect your Neurolab headset here to stream and record high-fidelity neural data in real-time.',
        placement: 'right'
    },
    {
        id: 'tour-booking',
        title: 'Book Appointments',
        desc: 'Search our network of verified neurologists and clinics to schedule automated clinical visits.',
        placement: 'right'
    },
    {
        id: 'tour-insights',
        title: 'Wellness Insights',
        desc: 'Receive customized, AI-driven wellness recommendations generated from your historical brainwave patterns.',
        placement: 'right'
    },
    {
        id: 'tour-profile',
        title: 'Your Account',
        desc: 'Access your profile settings, view active status, and manage platform preferences.',
        placement: 'bottom'
    }
];

export default function UserTutorial({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initial load logic
    useEffect(() => {
        const completed = localStorage.getItem('neurai_user_tutorial_completed');
        if (!completed && user?.role === 'USER') {
            const timer = setTimeout(() => setIsOpen(true), 1500); // Wait for animations to finish
            return () => clearTimeout(timer);
        }
    }, [user]);

    // Track active element bounds
    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const currentStep = TOUR_STEPS[step];
            const element = document.getElementById(currentStep.id);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        // Polling fallback for dynamic rendering
        const poll = setInterval(updatePosition, 500);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
            clearInterval(poll);
        };
    }, [isOpen, step]);

    const handleComplete = () => {
        localStorage.setItem('neurai_user_tutorial_completed', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    const currentStepData = TOUR_STEPS[step];

    // Calculate Popover Position relative to the spotlight window
    const getPopoverStyle = () => {
        if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

        const SPACING = 24; // Distance from spotlight

        switch (currentStepData.placement) {
            case 'right':
                return {
                    top: targetRect.top + (targetRect.height / 2),
                    left: targetRect.right + SPACING,
                    transform: 'translateY(-50%)'
                };
            case 'bottom': {
                // If the target is on the right half of the screen, anchor the popover to the right edge
                const isFarRight = targetRect.left > (window.innerWidth / 2);

                if (isFarRight) {
                    return {
                        top: targetRect.bottom + 16,
                        right: 24,
                        left: 'auto',
                        transform: 'none'
                    };
                }

                return {
                    top: targetRect.bottom + SPACING,
                    left: targetRect.left + (targetRect.width / 2),
                    transform: 'translateX(-50%)'
                };
            }
            case 'left':
                return {
                    top: targetRect.top + (targetRect.height / 2),
                    left: targetRect.left - SPACING,
                    transform: 'translate(-100%, -50%)'
                };
            case 'top':
            default:
                return {
                    top: targetRect.top - SPACING,
                    left: targetRect.left + (targetRect.width / 2),
                    transform: 'translate(-50%, -100%)'
                };
        }
    };

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* The Dimmed Background & Spotlight Overlay */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-auto transition-all duration-500 ease-in-out">
                <defs>
                    <mask id="spotlight-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <motion.rect
                                initial={false}
                                animate={{
                                    x: targetRect.left - 8,
                                    y: targetRect.top - 8,
                                    width: targetRect.width + 16,
                                    height: targetRect.height + 16,
                                    rx: 12,
                                    ry: 12
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    className="fill-background/80 backdrop-blur-[2px]"
                    mask="url(#spotlight-mask)"
                />

                {/* Spotlight border glow rings */}
                {targetRect && (
                    <>
                        <motion.rect
                            initial={false}
                            animate={{
                                x: targetRect.left - 8,
                                y: targetRect.top - 8,
                                width: targetRect.width + 16,
                                height: targetRect.height + 16,
                                rx: 12,
                                ry: 12
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="stroke-primary/50 fill-none"
                            strokeWidth={2}
                        />
                        <motion.rect
                            initial={false}
                            animate={{
                                x: targetRect.left - 16,
                                y: targetRect.top - 16,
                                width: targetRect.width + 32,
                                height: targetRect.height + 32,
                                rx: 16,
                                ry: 16
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="stroke-primary/20 fill-none"
                            strokeWidth={1}
                        />
                    </>
                )}
            </svg>

            {/* The Floating Info Popover */}
            <AnimatePresence>
                {targetRect && (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        style={getPopoverStyle()}
                        className="absolute w-80 rounded-2xl border border-primary/20 bg-card p-6 shadow-2xl shadow-primary/10 pointer-events-auto"
                    >
                        <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground">{currentStepData.title}</h3>
                        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">{currentStepData.desc}</p>

                        <div className="flex w-full items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">
                                {step + 1} <span className="text-muted-foreground/50">/ {TOUR_STEPS.length}</span>
                            </span>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleComplete}
                                    className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/50"
                                >
                                    Skip
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => step < TOUR_STEPS.length - 1 ? setStep(step + 1) : handleComplete()}
                                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/95"
                                >
                                    {step < TOUR_STEPS.length - 1 ? 'Next' : 'Finish'}
                                    {step < TOUR_STEPS.length - 1 ? <ChevronRight size={14} /> : <Check size={14} />}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
