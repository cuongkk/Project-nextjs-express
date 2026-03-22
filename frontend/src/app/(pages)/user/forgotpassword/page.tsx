"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { OtpForm } from "./OtpForm";
import { NewPasswordForm } from "./NewPasswordForm";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="max-w-[480px] mx-auto py-[40px]">
      <h1 className="text-[24px] font-[700] mb-[20px] text-center">Quên mật khẩu (Người dùng)</h1>
      <div className="space-y-[24px]">
        {step === 1 && <ForgotPasswordForm onSuccess={() => setStep(2)} />}
        {step === 2 && <OtpForm onNext={() => setStep(3)} />}
        {step === 3 && <NewPasswordForm />}
      </div>
    </div>
  );
}
