"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/app/api/store/auth.store"; // Adjusted import path
import { useRouter } from "next/navigation";
import { UserOnboarding } from "@/types/user.type";
import { steps } from "@/constants"; // Assuming this file exists and defines steps
import { useOnboarding } from "@/hooks/onboarding";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import StepOnboarding, { StepOnboardingRef } from "@/components/stepOnboarding";
import { Toaster } from "sonner"; // Added Toaster for consistency

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
          ? {
              id: user.id,
              email: user.email,
              isVerify: user.isVerify,
              onboarding: user.onboarding,
            }
          : null,
      });
      if (!isAuthenticated || !user || !user.isVerify) {
        console.log(
          "Redirecting to login - not authenticated or email not verified",
        );
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-inter">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
        <div className="ml-4 text-lg">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !user.isVerify) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-inter">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
        <div className="ml-4 text-lg">Redirection...</div>
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
    if (stepId === currentStep) return "current"; // Use "current" for active step
    return "upcoming";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-inter">
      <Toaster position="top-center" theme="dark" />
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="w-full lg:w-80 lg:border-r lg:border-gray-700/50 bg-gray-800/30 backdrop-blur-xl min-h-screen p-6 lg:p-8 flex flex-col">
          <div className="mb-8">
            <h1 className="text-xl font-light text-white">
              Configuration du <span className="font-semibold">profil</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Étape {currentStep} sur {steps.length}
            </p>
          </div>
          <nav className="space-y-3 flex-grow">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer
                    ${
                      status === "current"
                        ? "bg-blue-600/30 text-blue-300 border border-blue-500/20 shadow-lg"
                        : status === "completed"
                          ? "bg-green-600/20 text-green-300 border border-green-500/20 shadow-md"
                          : "bg-gray-800/30 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50"
                    }
                  `}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full
                      flex items-center justify-center text-sm font-medium
                      ${
                        status === "completed"
                          ? "bg-green-600 text-white"
                          : status === "current"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300"
                      }`}
                  >
                    {status === "completed" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`flex items-center gap-2 ${
                        status === "current"
                          ? "text-white font-semibold"
                          : status === "completed"
                            ? "text-gray-200 font-medium"
                            : "text-gray-300 font-medium"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm truncate">{step.title}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-2xl">
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
                  className="px-8 h-11 text-gray-400 border-gray-700/60 bg-gray-800/40 hover:bg-gray-700/50 hover:text-gray-300 rounded-xl transition-all duration-300 shadow-md"
                >
                  Retour
                </Button>
              )}
              <Button
                onClick={
                  currentStep === steps.length ? handleSubmit : handleNext
                }
                className="submit-button px-8 h-11 ml-auto rounded-xl shadow-lg"
              >
                {currentStep === steps.length ? (
                  onboading.isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Terminaison...
                    </>
                  ) : (
                    "Terminer"
                  )
                ) : (
                  "Suivant"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
