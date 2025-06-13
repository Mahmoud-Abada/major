"use client";

import { useAppDispatch, useAppSelector } from ".";
import {
  setSelectedRole,
  initializeRole,
  updateRoleData,
} from "../slices/roleSlice";
import type { RoleData } from "../slices/roleSlice";

export const useRole = () => {
  const dispatch = useAppDispatch();
  const selectedRole = useAppSelector((state) => state.userRole.selectedRole);
  const roleData = useAppSelector((state) => state.userRole.roleData);
  const isInitialized = useAppSelector((state) => state.userRole.isInitialized);

  const setRole = (role: string) => {
    dispatch(setSelectedRole(role));
  };

  const initRole = (role: string) => {
    dispatch(initializeRole(role));
  };

  const updateData = (role: string, data: Partial<RoleData>) => {
    dispatch(updateRoleData({ role, data }));
  };

  const getCurrentRoleData = () => {
    return roleData[selectedRole];
  };

  return {
    selectedRole,
    roleData,
    setRole,
    initializeRole: initRole,
    updateRoleData: updateData,
    getCurrentRoleData,
    isInitialized,
  };
};
