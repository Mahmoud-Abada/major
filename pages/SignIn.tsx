"use client";
import RoleSelector from "@/components/auth/RoleSelector";
import Info from "@/components/auth/Info";
import SigninForm from "@/components/auth/SigninForm";

export default function SignInPage() {
  return (
    <>
      <RoleSelector />
      <div className="flex min-h-screen flex-col lg:flex-row items-center justify-center lg:justify-evenly bg-gray-100">
        <Info />
        <SigninForm />
      </div>
    </>
  );
}
