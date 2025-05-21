//src/app/onboarding/StepNavigation.tsx
import React from "react";
import { useRouter } from "next/navigation";
import formData from "./formData"; // Import formData to get total steps dynamically

const StepNavigation = ({
    step,
    setStep,
    handleSubmit,
}: {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    handleSubmit: () => void;
}) => {
    const router = useRouter();
    const totalSteps = formData.length; // Dynamically get the number of questions

    return (
        <div className="flex justify-between mt-4">
            {/* Previous Button */}
            {step > 0 && (
                <button
                    onClick={() => setStep((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                    Previous
                </button>
            )}

            {/* Next Button (if not on the last step) */}
            {step < totalSteps - 1 ? (
                <button
                    onClick={() => setStep((prev) => prev + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Next
                </button>
            ) : (
                // Submit Button (on the last step)
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Submit
                </button>
            )}
        </div>
    );
};

export default StepNavigation;