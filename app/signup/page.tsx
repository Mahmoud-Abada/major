"use client";

import Info from "@/components/auth/Info";

import SignupForm from "../../components/auth/SignupForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-row items-center justify-center lg:justify-evenly">
      <Info />
      <SignupForm />
    </div>
  );
}
