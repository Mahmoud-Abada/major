"use client";

import Info from "@/components/auth/Info";
import SigninForm from "../../components/auth/SigninForm";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-row items-center justify-center lg:justify-evenly">
      <Info />
      <SigninForm />
    </div>
  );
}
