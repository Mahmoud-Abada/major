"use client";

import { useAppDispatch, useAppSelector } from ".";
import {
  setSelectedRole,
  initializeRole,
  updateRoleData,
  type RoleData,
  type RoleType,
} from "../slices/userRoleSlice";

export const useRole = () => {
  const dispatch = useAppDispatch();

  const selectedRole = useAppSelector((state) => state.userRole.selectedRole);
  const roleData = useAppSelector((state) => state.userRole.roleData);
  const isInitialized = useAppSelector((state) => state.userRole.isInitialized);

  const setRole = (role: RoleType) => dispatch(setSelectedRole(role));
  const initRole = (role: RoleType) => dispatch(initializeRole(role));
  const updateData = (role: RoleType, data: Partial<RoleData>) =>
    dispatch(updateRoleData({ role, data }));

  const getCurrentRoleData = () => roleData[selectedRole];

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
