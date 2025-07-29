import React, { forwardRef, useImperativeHandle } from "react";
import { UserOnboarding } from "@/types/user.type";
import {
  onboardingStepOneSchema,
  onboardingStepTwoSchema,
  onboardingStepThreeSchema,
  onboardingStepFourSchema,
  onboardingStepFiveSchema,
} from "@/validations/onboarding.validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FileUploadPic } from "./upload";
import { Checkbox } from "./ui/checkbox";
import { Megaphone, Users } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface StepOnboardingProps {
  currentStep: number;
  formData: Partial<UserOnboarding>;
  onDataChange: (data: Partial<UserOnboarding>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onValidateAndNext?: () => Promise<void>;
}

export interface StepOnboardingRef {
  validateCurrentStep: () => Promise<boolean>;
}

const StepOnboarding = forwardRef<StepOnboardingRef, StepOnboardingProps>((
  {
    currentStep,
    formData,
    onDataChange,
    onNext,
    onPrevious,
  },
  ref
) => {
  const stepOneForm = useForm({
    resolver: zodResolver(onboardingStepOneSchema),
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
    },
  });

  const stepTwoForm = useForm({
    resolver: zodResolver(onboardingStepTwoSchema),
    defaultValues: {
      username: formData.username || "",
    },
  });

  const stepFourForm = useForm({
    resolver: zodResolver(onboardingStepFourSchema),
    defaultValues: {
      isTalent: formData.isTalent || false,
      isAnnouncer: formData.isAnnouncer || false,
    },
  });

  const stepThreeForm = useForm({
    resolver: zodResolver(onboardingStepThreeSchema),
    defaultValues: {
      avatar: formData.avatar || "",
      city: formData.city || "",
    },
  });

  const stepFiveForm = useForm({
    resolver: zodResolver(onboardingStepFiveSchema),
    defaultValues: {
      description: formData.description || "",
    },
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    let isValid = false;
    let data = {};

    switch (currentStep) {
      case 1:
        isValid = await stepOneForm.trigger();
        if (isValid) data = stepOneForm.getValues();
        break;
      case 2:
        isValid = await stepTwoForm.trigger();
        if (isValid) data = stepTwoForm.getValues();
        break;
      case 3:
        isValid = await stepThreeForm.trigger();
        if (isValid) data = stepThreeForm.getValues();
        break;
      case 4:
        isValid = await stepFourForm.trigger();
        if (isValid) data = stepFourForm.getValues();
        break;
      case 5:
        isValid = await stepFiveForm.trigger();
        if (isValid) data = stepFiveForm.getValues();
        break;
    }

    if (isValid) {
      onDataChange({ ...formData, ...data });
    }
    
    return isValid;
  };

  useImperativeHandle(ref, () => ({
    validateCurrentStep,
  }));

  const renderStepcontent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl ">Informations personelles</h2>
              <p className="text-gray-600 mb-8">
                Commençons par configurer votre avec vos Informations de base. Ces informations nous
                aideront à personnaliser votre expériences.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Votre prénom</Label>
                <Input
                  id="firstName"
                  placeholder="ex: John"
                  {...stepOneForm.register("firstName")}
                  className="h-11"
                />
                {stepOneForm.formState.errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {stepOneForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Votre nom</Label>
                <Input
                  id="lastName"
                  placeholder="ex: Doe"
                  {...stepOneForm.register("lastName")}
                  className="h-11"
                />
                {stepOneForm.formState.errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {stepOneForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Nom d&rsquo;utilisateur</h2>
              <p className="text-gray-800">
                Votre nom d&#39;utilisateur sera visible sur votre profil et sera utilisé pour
                identifier votre compte.
              </p>
              <div className="space-y-2">
                <Label className="mt-2">Nom d&rsquo;utilisateur</Label>
                <Input
                  id="username"
                  {...stepTwoForm.register("username")}
                  className="h-11"
                  placeholder="ex: username"
                />
                {stepTwoForm.formState.errors.username && (
                  <p className="text-red-500 text-xs">
                    {stepTwoForm.formState.errors.username.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Photo & Localisation</h2>
              <p className="text-gray-600 mb-8">
                Ajoutez une photo de profil et indiquez votre localisation pour que les autres
                utilisateurs puissent vous trouver.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Photo de profil (optionnel)</Label>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                  Upload de photo temporairement désactivé
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" {...stepThreeForm.register("city")} className="h-11" />
                {stepThreeForm.formState.errors.city && (
                  <p className="text-red-500 text-xs">
                    {stepThreeForm.formState.errors.city.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Type de compte</h2>
              <p className="text-gray-600 mb-8">
                Definnissez votre rôle sur la plateforme. Vous pouvez sélectionner les deux si vous
                souhaitez à la fois proposer et rechercher des services
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-900">Selectionner votre rôle</Label>
              {stepFourForm.formState.errors.isTalent && (
                <p className="text-red-500 text-xs">
                  {stepFourForm.formState.errors.isTalent.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50">
                <Checkbox
                  id="isTalent"
                  checked={formData.isTalent}
                  onCheckedChange={(checked) => {
                    stepFourForm.setValue("isTalent", checked as boolean);
                    onDataChange({ ...formData, isTalent: checked as boolean });
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <Label htmlFor="isTalent" className="font-medium">Je suis talent</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Proposez des services et compétences</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50">
                <Checkbox
                  id="isAnnouncer"
                  checked={formData.isAnnouncer}
                  onCheckedChange={(checked) => {
                    stepFourForm.setValue("isAnnouncer", checked as boolean);
                    onDataChange({ ...formData, isAnnouncer: checked as boolean });
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-blue-600" />
                    <Label htmlFor="isAnnouncer" className="font-medium">Je suis annonceur</Label>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Recherchez des services et compétences</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">À propos de vous</h2>
              <p className="text-gray-600 mb-8">
                Parlez-nous de vous, de vos compétences et de vos objectifs sur la plateforme.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                {...stepFiveForm.register("description")}
                placeholder="Décrivez-vous en quelques mots, vos compétences, vos objectifs..."
                className="min-h-32"
              />
              {stepFiveForm.formState.errors.description && (
                <p className="text-red-500 text-xs">
                  {stepFiveForm.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {renderStepcontent()}
    </div>
  );
});

StepOnboarding.displayName = "StepOnboarding";

export default StepOnboarding;