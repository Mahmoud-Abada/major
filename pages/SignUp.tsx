"use client";

import Info from "@/components/auth/Info";
import Signup from "../components/Signup";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row items-center justify-center lg:justify-evenly bg-gray-100">
      <Info />

      <Signup />
    </div>
  );
}
