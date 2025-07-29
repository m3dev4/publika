"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../api/store/auth.store";
import { useRouter } from "next/navigation";
import { UserOnboarding } from "@/types/user.type";
import { steps } from "@/constants";
import { useOnboarding } from "@/hooks/onboarding";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepOnboarding, { StepOnboardingRef } from "@/components/stepOnboarding";



const Onboarding = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserOnboarding>>({
    isTalent: false,
    isAnnouncer: false,
  });
  const onboading = useOnboarding();
  const stepRef = useRef<StepOnboardingRef>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      console.log("Onboarding - Auth state:", {
        isAuthenticated,
        user: user
          ? { id: user.id, email: user.email, isVerify: user.isVerify, onboarding: user.onboarding }
          : null,
      });

      if (!isAuthenticated || !user || !user.isVerify) {
        console.log("Redirecting to login - not authenticated or email not verified");
        router.push("/auth/login");
        return;
      }

      if (user.onboarding) {
        console.log("Redirecting to home - onboarding already completed");
        router.push("/home");
        return;
      }
    }
  }, [mounted, isAuthenticated, user, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !user.isVerify) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Redirecting...</div>
      </div>
    );
  }



  const handleNext = async () => {
    if (stepRef.current) {
      const isValid = await stepRef.current.validateCurrentStep();
      if (isValid && currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    try {
      await onboading.mutateAsync({
        userId: user.id,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        username: formData.username || "",
        avatar: formData.avatar || "",
        city: formData.city || "",
        description: formData.description || "",
        isTalent: formData.isTalent || false,
        isAnnouncer: formData.isAnnouncer || false,
      });
    } catch (error) {
      console.error("Error onboarding:", error);
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };


  return (
    <div className="min-h-screen w-full">
      <div className="flex">
        {/* sidebar */}
        <div className="w-80 border-r border-gray-200 min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-gray-800">Configuration du profil</h1>
            <p className="text-sm text-gray-500 mt-1">
              Étape {currentStep} sur {steps.length}
            </p>
          </div>

          <nav className="space-y-2">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors 
                ${
                  status === "current"
                    ? "bg-amber-300 text-white"
                    : status === "completed"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }
                `}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full 
                    flex items-center justify-center text-sm font-medium 
                    ${
                      status === "completed"
                        ? "bg-green-500 text-white"
                        : status === "current"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {status === "completed" ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`flex items-center gap-2 ${
                        status === "current"
                          ? "text-neutral-800"
                          : status === "completed"
                            ? "text-slate-100"
                            : "text-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <p className="font-bold text-sm truncate">{step.title}</p>
                    </div>
                    <p className="text-xs text-neutral-700 mt-1 line-clamp-2">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-8 ml-80">
          <div className="max-w-2xl">
            <StepOnboarding 
             ref={stepRef}
             currentStep={currentStep}
             formData={formData}
             onDataChange={setFormData}
             onNext={handleNext}
             onPrevious={handlePrevious}
            />

            <div className="flex justify-between gap-5 mt-12">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="px-8 h-11"
                >
                  Retour
                </Button>
              )}
              <Button
                onClick={currentStep === steps.length ? handleSubmit : handleNext}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 h-11 ml-auto"
              >
                {currentStep === steps.length ? "Terminer" : "Suivant"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
