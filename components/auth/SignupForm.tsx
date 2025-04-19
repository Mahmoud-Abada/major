"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SchoolSignupForm from "./SchoolSignupForm";
import PersonSignupForm from "./PersonSignupForm";

const SignupForm = () => {
  const selectedRole = useSelector(
    (state: RootState) => state.userRole.selectedRole,
  );

  return selectedRole === "school" ? (
    <SchoolSignupForm />
  ) : (
    <PersonSignupForm />
  );
};

export default SignupForm;
