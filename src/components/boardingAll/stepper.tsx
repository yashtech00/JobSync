"use client"
import React, { useState } from 'react';
import { PersonalInfo } from './PersonalInfo';
import { AccountInfo } from './AccountInfo';
import { Confirmation } from './Confirmation';
import { CheckCircle, Circle } from 'lucide-react';

export function Stepper() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { label: 'Personal Info', component: <PersonalInfo onNext={handleNext} /> },
    { label: 'Account Info', component: <AccountInfo onNext={handleNext} /> },
    { label: 'Confirmation', component: <Confirmation onBack={handleBack} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Complete the following steps to set up your account
          </p>
        </div>

        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-16">
            {steps.map((step, index) => (
              <li key={index} className="relative">
                <div className="flex items-center">
                  {index <= currentStep ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-indigo-600" />
                      <span className="ml-4 text-sm font-medium text-indigo-600">
                        {step.label}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Circle className="h-8 w-8 text-gray-300" />
                      <span className="ml-4 text-sm font-medium text-gray-500">
                        {step.label}
                      </span>
                    </span>
                  )}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-4 left-full h-0.5 w-32 bg-gray-200">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-500"
                        style={{
                          width: currentStep > index ? '100%' : '0%',
                        }}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8">
          {steps[currentStep].component}
        </div>
      </div>
    </div>
  );
}