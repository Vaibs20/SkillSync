//src/app/onboarding/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import FormSteps from "./FormSteps";
import StepNavigation from "./StepNavigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

const OnboardingForm = () => {
    const [step, setStep] = useState(0);
    const [formResponses, setFormResponses] = useState<{ [key: number]: any }>({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        axios
            .get("/api/auth/verify")
            .then((res) => {
                if (res.data.success) {
                    setIsAuthenticated(true);
                } else {
                    router.push("/login");
                }
            })
            .catch(() => router.push("/login"));
    }, [router]);

    const handleSubmit = async () => {
        try {
            if (!formResponses[2]?.selectedOptions?.length && !formResponses[2]?.otherText) {
                toast.error("Please select at least one skill");
                return;
            }
            if (!formResponses[0]?.selectedOption) {
                toast.error("Please select your department");
                return;
            }
            if (!formResponses[1]?.selectedOption) {
                toast.error("Please select your graduation year");
                return;
            }

            const res = await axios.post("/api/users/onboarding", {
                onboardingDetails: formResponses,
            });

            if (res.data.success) {
                toast.success("Onboarding details submitted successfully!");
                router.push("/dashboard");
            } else {
                toast.error("Failed to submit onboarding details.");
            }
        } catch (err: any) {
            console.error("Error submitting data:", err);
            toast.error(err.response?.data?.error || "Error submitting onboarding details");
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="flex-1 flex items-center justify-center px-10">
            <div className="bg-white p-12 rounded-2xl shadow-lg w-[700px] h-[500px] max-w-full flex flex-col">
                <div className="flex flex-col justify-top">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Skill Sync!</h2>
                    <p className="text-gray-600">Let's get started by filling out a few details.</p>
                </div>
                <div className="flex-1">
                    <FormSteps step={step} formResponses={formResponses} setFormResponses={setFormResponses} />
                    <StepNavigation step={step} setStep={setStep} handleSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default OnboardingForm;