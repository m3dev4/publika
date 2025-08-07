"use client";

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
import { Checkbox } from "./ui/checkbox";
import { Megaphone, Users, UploadCloud, AlertCircle } from 'lucide-react'; // Added UploadCloud, AlertCircle
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

const StepOnboarding = forwardRef<StepOnboardingRef, StepOnboardingProps>(
  ({ currentStep, formData, onDataChange, onNext, onPrevious }, ref) => {
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
    const stepThreeForm = useForm({
      resolver: zodResolver(onboardingStepThreeSchema),
      defaultValues: {
        avatar: formData.avatar || "",
        city: formData.city || "",
      },
    });
    const stepFourForm = useForm({
      resolver: zodResolver(onboardingStepFourSchema),
      defaultValues: {
        isTalent: formData.isTalent || false,
        isAnnouncer: formData.isAnnouncer || false,
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
            <div className="space-y-6 glass-card p-8 rounded-2xl shadow-2xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">
                  Informations <span className="font-semibold">personnelles</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Commençons par configurer votre profil avec vos informations de base. Ces informations nous aideront à personnaliser votre expérience.
                </p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Votre prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="ex: John"
                    {...stepOneForm.register("firstName")}
                    className="animate-input h-11 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                  />
                  {stepOneForm.formState.errors.firstName && (
                    <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                      <AlertCircle className="h-3 w-3" />
                      {stepOneForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Votre nom</Label>
                  <Input
                    id="lastName"
                    placeholder="ex: Doe"
                    {...stepOneForm.register("lastName")}
                    className="animate-input h-11 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                  />
                  {stepOneForm.formState.errors.lastName && (
                    <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                      <AlertCircle className="h-3 w-3" />
                      {stepOneForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6 glass-card p-8 rounded-2xl shadow-2xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">
                  Nom d&rsquo;utilisateur
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Votre nom d&#39;utilisateur sera visible sur votre profil et sera utilisé pour identifier votre compte.
                </p>
                <div className="space-y-2 mt-6">
                  <Label className="text-gray-300">Nom d&rsquo;utilisateur</Label>
                  <Input
                    id="username"
                    {...stepTwoForm.register("username")}
                    className="animate-input h-11 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                    placeholder="ex: username"
                  />
                  {stepTwoForm.formState.errors.username && (
                    <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                      <AlertCircle className="h-3 w-3" />
                      {stepTwoForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-6 glass-card p-8 rounded-2xl shadow-2xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">
                  Photo & <span className="font-semibold">Localisation</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Ajoutez une photo de profil et indiquez votre localisation pour que les autres utilisateurs puissent vous trouver.
                </p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Photo de profil (optionnel)</Label>
                  <div className="p-6 border-2 border-dashed border-gray-700/50 rounded-xl text-center text-gray-400 bg-gray-900/30 backdrop-blur-sm transition-colors duration-300 hover:border-blue-500 hover:bg-gray-800/40 cursor-pointer flex flex-col items-center justify-center">
                    <UploadCloud className="h-8 w-8 mb-2 text-gray-500" />
                    <p className="text-sm">Glissez-déposez ou cliquez pour télécharger</p>
                    <p className="text-xs mt-1 text-gray-500">Upload de photo temporairement désactivé</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-300">Ville</Label>
                  <Input
                    id="city"
                    {...stepThreeForm.register("city")}
                    className="animate-input h-11 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                  />
                  {stepThreeForm.formState.errors.city && (
                    <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                      <AlertCircle className="h-3 w-3" />
                      {stepThreeForm.formState.errors.city.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-6 glass-card p-8 rounded-2xl shadow-2xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">
                  Type de <span className="font-semibold">compte</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Définissez votre rôle sur la plateforme. Vous pouvez sélectionner les deux si vous souhaitez à la fois proposer et rechercher des services.
                </p>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-300">
                  Sélectionnez votre rôle
                </Label>
                {stepFourForm.formState.errors.isTalent && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                    <AlertCircle className="h-3 w-3" />
                    {stepFourForm.formState.errors.isTalent.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <div
                  className="flex items-center space-x-3 p-5 rounded-xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-gray-800/40 hover:border-blue-500"
                  onClick={() => {
                    const newChecked = !formData.isTalent;
                    stepFourForm.setValue("isTalent", newChecked);
                    onDataChange({ ...formData, isTalent: newChecked });
                  }}
                >
                  <Checkbox
                    id="isTalent"
                    checked={formData.isTalent}
                    onCheckedChange={(checked) => {
                      stepFourForm.setValue("isTalent", checked as boolean);
                      onDataChange({ ...formData, isTalent: checked as boolean });
                    }}
                    className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-blue-400" />
                      <Label htmlFor="isTalent" className="font-semibold text-white cursor-pointer">
                        Je suis talent
                      </Label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Proposez des services et compétences
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div
                  className="flex items-center space-x-3 p-5 rounded-xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-gray-800/40 hover:border-blue-500"
                  onClick={() => {
                    const newChecked = !formData.isAnnouncer;
                    stepFourForm.setValue("isAnnouncer", newChecked);
                    onDataChange({ ...formData, isAnnouncer: newChecked });
                  }}
                >
                  <Checkbox
                    id="isAnnouncer"
                    checked={formData.isAnnouncer}
                    onCheckedChange={(checked) => {
                      stepFourForm.setValue("isAnnouncer", checked as boolean);
                      onDataChange({ ...formData, isAnnouncer: checked as boolean });
                    }}
                    className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Megaphone className="h-6 w-6 text-blue-400" />
                      <Label htmlFor="isAnnouncer" className="font-semibold text-white cursor-pointer">
                        Je suis annonceur
                      </Label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Recherchez des services et compétences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        case 5:
          return (
            <div className="space-y-6 glass-card p-8 rounded-2xl shadow-2xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">
                  À propos de <span className="font-semibold">vous</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Parlez-nous de vous, de vos compétences et de vos objectifs sur la plateforme.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  {...stepFiveForm.register("description")}
                  placeholder="Décrivez-vous en quelques mots, vos compétences, vos objectifs..."
                  className="animate-input min-h-32 border-gray-700/60 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                />
                {stepFiveForm.formState.errors.description && (
                  <p className="text-sm text-red-400 flex items-center gap-1 animate-in fade-in duration-300">
                    <AlertCircle className="h-3 w-3" />
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
    return <div className="w-full">{renderStepcontent()}</div>;
  },
);

StepOnboarding.displayName = "StepOnboarding";

export default StepOnboarding;
