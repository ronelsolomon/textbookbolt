import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { ProcessingStep } from '../../types';

const steps: Array<{ id: ProcessingStep; label: string }> = [
  { id: 'upload', label: 'Upload' },
  { id: 'extract', label: 'Extract' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'generate', label: 'Generate' },
  { id: 'preview', label: 'Preview' },
  { id: 'export', label: 'Export' },
];

const ProcessSteps: React.FC = () => {
  const { currentStep, setCurrentStep, currentProject } = useProject();
  
  // Get the index of the current step
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.id}
                className={`relative ${
                  stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                }`}
              >
                {stepIdx < currentStepIndex ? (
                  <>
                    <div className="absolute inset-0 flex items-center\" aria-hidden="true">
                      <div className="h-0.5 w-full bg-primary-600"></div>
                    </div>
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className="relative w-8 h-8 flex items-center justify-center bg-primary-600 rounded-full hover:bg-primary-700"
                    >
                      <Check className="w-5 h-5 text-white" aria-hidden="true" />
                      <span className="sr-only">{step.label}</span>
                    </button>
                  </>
                ) : stepIdx === currentStepIndex ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200"></div>
                    </div>
                    <div
                      className="relative w-8 h-8 flex items-center justify-center bg-primary-600 rounded-full"
                      aria-current="step"
                    >
                      <span
                        className="h-2.5 w-2.5 bg-white rounded-full"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">{step.label}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200"></div>
                    </div>
                    <div className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400">
                      <span
                        className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">{step.label}</span>
                    </div>
                  </>
                )}
                
                <div className="hidden sm:block absolute top-0 left-0 mt-10 -ml-3">
                  <span className={`text-sm font-medium ${
                    stepIdx <= currentStepIndex ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                
                {stepIdx !== steps.length - 1 && (
                  <div className="hidden sm:block absolute top-0 right-0 mt-5 mr-2">
                    <ArrowRight
                      className="w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default ProcessSteps;