"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RoleType, setSelectedRole } from "../../store/slices/userRoleSlice";
import { RootState } from "../../store/store";
import PersonSignupForm from "./PersonSignupForm";
import SchoolSignupForm from "./SchoolSignupForm";

const SignupForm = () => {
  const { theme } = useTheme();
  const t = useTranslations("auth");
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
      className={`w-[90%] sm:w-full max-w-md rounded-lg border p-6 shadow-md ${
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700"
          : "bg-neutral-100 border-neutral-300"
      }`}
    >
      {/* Sign Up Title */}
      <div className="flex mb-6 items-center justify-between">
        <h2
          className={`text-3xl font-semibold ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}
        >
          {t("signUp")}
        </h2>
        <Image
          src={"/major-logo.svg"}
          alt={"major app"}
          width={48}
          height={46}
          className="block lg:hidden"
        />
      </div>

      {/* Role Selection */}
      <div
        className={`flex mb-6 rounded-lg border overflow-hidden ${
          theme === "dark" ? "border-neutral-700" : "border-neutral-300"
        }`}
      >
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => dispatch(setSelectedRole(role as RoleType))}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              selectedRole === role
                ? theme === "dark"
                  ? "bg-neutral-600 text-neutral-50"
                  : "bg-neutral-900 text-neutral-50"
                : theme === "dark"
                  ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {t(`roles.${role}`)}
          </button>
        ))}
      </div>

      {/* Form */}
      {selectedRole === "school" ? <SchoolSignupForm /> : <PersonSignupForm />}

      {/* Login Link */}
      <p
        className={`mt-4 text-center text-sm ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-950"
        }`}
      >
        {t("alreadyAccount")}{" "}
        <Link
          href="/signin"
          className={`font-semibold underline ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}
        >
          {t("signIn")}
        </Link>
      </p>

      <div className="hidden">
        {/* Divider */}
        <div className="my-4 flex items-center">
          <hr
            className={`flex-grow ${
              theme === "dark" ? "border-neutral-700" : "border-neutral-300"
            }`}
          />
          <span
            className={`mx-2 text-sm ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-900"
            }`}
          >
            {t("or")}
          </span>
          <hr
            className={`flex-grow ${
              theme === "dark" ? "border-neutral-700" : "border-neutral-300"
            }`}
          />
        </div>

        {/* Google Sign In */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className={`mb-2 flex w-full h-[2.5rem] items-center justify-center rounded-lg border text-sm font-semibold transition-all hover:opacity-90 ${
            theme === "dark"
              ? "border-neutral-700 bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
              : "border-neutral-300 bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          }`}
        >
          <FaGoogle className="mr-2 text-red-500" />
          {t("signInWithGoogle")}
        </motion.button>

        {/* Facebook Sign In */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className={`flex w-full h-[2.5rem] items-center justify-center rounded-lg border text-sm font-semibold transition-all hover:opacity-90 ${
            theme === "dark"
              ? "border-neutral-700 bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
              : "border-neutral-300 bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          }`}
        >
          <FaFacebook className="mr-2 text-blue-600" />
          {t("signInWithFacebook")}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SignupForm;
