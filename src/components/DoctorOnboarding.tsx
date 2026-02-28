import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function DoctorOnboarding({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const onboarded = localStorage.getItem('neurai_doctor_onboarded');
        if (!onboarded && user?.role === 'DOCTOR') {
            const timer = setTimeout(() => setIsOpen(true), 1000); // Small delay for premium feel
            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleComplete = () => {
        localStorage.setItem('neurai_doctor_onboarded', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    const steps = [
        {
            title: "Welcome Dr. " + (user?.name?.split(' ').pop() || ''),
            desc: "Welcome to your new Clinical Diagnostics Terminal. Your patients and their neural data have been migrated successfully.",
            icon: (
                <div className="mb-6 flex flex-col items-center">
                    <div className="flex items-baseline">
                        <span className="text-4xl font-bold tracking-tight text-foreground">NeurAI</span>
                        <span className="w-2 h-2 rounded-full bg-[#2E90FA] ml-1" />
                    </div>
                    <div className="w-[30%] h-[1px] bg-[#2E90FA] mt-1 opacity-80" />
                </div>
            )
        },
        {
            title: "High-Resolution SNR",
            desc: "The Neural Analysis module now supports ultra-high resolution Signal-to-Noise Ratio (SNR) processing for real-time waveform inspection.",
            icon: <Microscope size={48} className="text-electric-blue mb-6" />
        },
        {
            title: "AI Decision Support",
            desc: "Access the new Decision Support module for context-sensitive AI recommendations overlaid on neural anomalies.",
            icon: <CheckCircle2 size={48} className="text-emerald-500 mb-6" />
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg rounded-3xl border border-input/50 bg-card p-10 shadow-2xl overflow-hidden"
            >
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

                <button onClick={handleComplete} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-20">
                    <X size={20} />
                </button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center text-center relative z-10"
                    >
                        {steps[step].icon}
                        <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">{steps[step].title}</h2>
                        <p className="mb-8 text-sm text-muted-foreground leading-relaxed">{steps[step].desc}</p>

                        <div className="flex w-full items-center justify-between mt-4">
                            <div className="flex gap-2">
                                {steps.map((_, idx) => (
                                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === step ? 'w-6 bg-primary' : 'w-2 bg-secondary'}`} />
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleComplete()}
                                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/95"
                            >
                                {step < steps.length - 1 ? 'Next' : 'Enter Terminal'}
                                {step < steps.length - 1 && <ChevronRight size={16} />}
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
