"use client";

import { RootState } from "@/store/store";
import { setSelectedRole } from "@/store/userRoleSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import PersonSignupForm from "./auth/PersonSignupForm";
import SchoolSignupForm from "./auth/SchoolSignupForm";

const SignupForm = () => {
  const dispatch = useDispatch();
  const selectedRole = useSelector(
    (state: RootState) => state.userRole.selectedRole,
  );

  const roles = ["student", "teacher", "school"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="w-[90%] sm:w-full max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-md"
    >
      {/* Sign Up Title */}
      <div className="flex mb-6 items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900">Sign up</h2>
        <Image
          src={"/major-logo.svg"}
          alt={"major app"}
          width={48}
          height={46}
          className="block lg:hidden"
        />
      </div>

      {/* Role Selection */}
      <div className="flex mb-6 rounded-lg border border-gray-300 overflow-hidden">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              dispatch(setSelectedRole(role));
              //reset();
            }}
            className={`flex-1 py-2 text-sm font-medium ${
              selectedRole === role
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}

      {selectedRole === "school" ? <SchoolSignupForm /> : <PersonSignupForm />}

      {/* Login Link */}
      <p className="mt-4 text-center text-sm font-normal text-gray-900">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-gray-900 hover:cursor-pointer underline"
        >
          Sign in
        </Link>
      </p>
      <div className="hidden">
        {/* Divider */}
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm font-normal text-gray-900">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign In */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="mb-2 flex w-full h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-sm font-semibold text-gray-900 hover:cursor-pointer transition-all hover:bg-gray-200 active:shadow-inner focus:outline-none"
        >
          <FaGoogle className="mr-2 text-red-500" />
          Sign in with Google
        </motion.button>

        {/* Facebook Sign In */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="flex w-full h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-sm font-semibold text-gray-900 hover:cursor-pointer transition-all hover:bg-gray-200 active:shadow-inner focus:outline-none"
        >
          <FaFacebook className="mr-2 text-blue-600" />
          Sign in with Facebook
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SignupForm;
