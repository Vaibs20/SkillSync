//src/app/onboarding/FormSteps.tsx
import React, { useEffect, useState } from "react";
import formData from "./formData";

const FormSteps = ({ step, formResponses, setFormResponses }: { step: number; formResponses: any; setFormResponses: any }) => {
    const currentStep = formData[step];

    // Initialize state based on formResponses for current step
    const [selectedOptions, setSelectedOptions] = useState<string[]>(formResponses[step]?.selectedOptions || []);
    const [otherText, setOtherText] = useState<string>(formResponses[step]?.otherText || "");
    const [textAnswer, setTextAnswer] = useState<string>(formResponses[step]?.text || "");
    const [selectedOption, setSelectedOption] = useState<string>(formResponses[step]?.selectedOption || "");

    // Load responses when step changes
    useEffect(() => {
        if (formResponses[step]) {
            setSelectedOptions(formResponses[step].selectedOptions || []);
            setOtherText(formResponses[step].otherText || "");
            setTextAnswer(formResponses[step].text || "");
            setSelectedOption(formResponses[step].selectedOption || "");
        } else {
            // Ensure new questions start with an empty state
            setSelectedOptions([]);
            setOtherText("");
            setTextAnswer("");
            setSelectedOption("");
        }
    }, [step]);

    // Save responses when state changes
    useEffect(() => {
        setFormResponses((prev: any) => ({
            ...prev,
            [step]: { selectedOptions, otherText, text: textAnswer, selectedOption },
        }));
    }, [selectedOptions, otherText, textAnswer, selectedOption]);

    const handleCheckboxChange = (option: string) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const options = currentStep.options || [];
    const allOptions = options.includes("Other") ? options : [...options, "Other"];

    return (
        <div>
            <label className="block text-gray-700 font-medium mb-2">{currentStep.question}</label>

            {/* Text Input */}
            {currentStep.type === "text" ? (
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Enter your answer..."
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                />
            ) : currentStep.type === "select" ? (
                /* Single Select Dropdown */
                <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    <option value="">Select an option</option>
                    {allOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : currentStep.type === "multiSelect" ? (
                /* Multi-Select Checkbox */
                <div className="grid gap-2 max-h-60 overflow-y-auto border border-gray-300 p-2 rounded-lg">
                    {allOptions.map((option, index) => (
                        <label key={index} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-900">{option}</span>
                        </label>
                    ))}
                    {/* Show input if "Other" is selected */}
                    {selectedOptions.includes("Other") && (
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 mt-2"
                            placeholder="Please specify..."
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                        />
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default FormSteps;
