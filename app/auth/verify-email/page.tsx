"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, ArrowLeft, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import { userVerifyEmail } from "@/hooks/user";

const VerifyEmailContent = () => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const verifyEmailMutation = userVerifyEmail();

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...verificationCode];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/\d/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    setVerificationCode(newCode);
    // Focus on next empty input or last input
    const nextEmptyIndex = newCode.findIndex((code) => !code);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");

    if (code.length !== 6) {
      toast.error("Veuillez entrer le code de vérification complet");
      return;
    }
    try {
      await verifyEmailMutation.mutateAsync(code);
      toast.success("Email vérifié avec succès!");
      // La navigation est déjà gérée dans le hook
    } catch (error: any) {
      toast.error(error.message || "Code de vérification invalide ou expiré");
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Adresse email manquante");
      return;
    }
    setIsResending(true);
    try {
      // TODO: Call resend verification email API
      // await resendVerificationEmail({ email });
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Code de vérification renvoyé!");
      setVerificationCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error("Erreur lors du renvoi du code");
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = verificationCode.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-inter">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .font-inter {
          font-family: "Inter", sans-serif;
        }

        .animate-input:focus {
          transform: translateY(-2px);
        }

        .social-button {
          transition: all 0.3s ease;
        }

        .social-button:hover {
          transform: translateY(-2px);
        }

        .glass-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .glass-card:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .submit-button {
          transition: all 0.3s ease;
          background-size: 200% auto;
          background-image: linear-gradient(
            to right,
            #3b82f6 0%,
            #2563eb 50%,
            #1d4ed8 100%
          );
        }

        .submit-button:hover {
          background-position: right center;
          transform: translateY(-2px);
        }
      `}</style>
      <Toaster position="top-center" theme="dark" />
      <div className="w-full max-w-md">
        <Card className="glass-card shadow-2xl border border-gray-700/40 bg-gray-800/30 backdrop-blur-xl rounded-2xl">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-light tracking-tight text-white mb-2">
                Vérifiez votre <span className="font-semibold">email</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2 text-sm">
                Nous avons envoyé un code de vérification à{" "}
                <span className="font-medium text-blue-300">
                  {email || "votre adresse email"}
                </span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-300">
                Code de vérification
              </Label>
              <div className="flex gap-3 justify-center">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="animate-input w-12 h-12 text-center text-lg font-semibold border-gray-700/60 bg-gray-900/50 text-white focus:border-blue-500 focus:ring-blue-800/30 rounded-xl transition-all duration-300 hover:border-gray-600"
                    disabled={verifyEmailMutation.isPending || isResending}
                  />
                ))}
              </div>
            </div>
            <Button
              onClick={handleVerify}
              disabled={!isCodeComplete || verifyEmailMutation.isPending}
              className="submit-button w-full h-11 text-white font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyEmailMutation.isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Vérifier le code
                </>
              )}
            </Button>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">
                Vous n'avez pas reçu le code ?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/70 font-medium transition-colors duration-200 rounded-lg"
              >
                {isResending ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Renvoi en cours...
                  </>
                ) : (
                  "Renvoyer le code"
                )}
              </Button>
            </div>
            <div className="pt-4 border-t border-gray-700/50">
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
                className="w-full text-gray-400 hover:text-gray-300 hover:bg-gray-800/70 transition-colors duration-200 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Le code expire dans 24 heures. Vérifiez aussi vos spams.
          </p>
        </div>
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;
