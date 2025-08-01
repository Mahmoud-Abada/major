"use client";

import { RoleType, setSelectedRole } from "@/store/slices/userRoleSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const roles: RoleType[] = ["student", "teacher", "school"];

export default function RoleSelector() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const dispatch = useDispatch();
  const selectedRole = useSelector(
    (state: RootState) => state.userRole.selectedRole,
  );

  if (!isClient) return null; // Prevents rendering on the server

  return (
    <div className="mt-4 max-w-80 w-full mx-auto">
      <label className="block text-gray-700 font-semibold mb-1">
        Select Role (Dev Only)
      </label>
      <select
        onChange={(e) => dispatch(setSelectedRole(e.target.value as RoleType))}
        className="w-full px-4 py-2 border rounded-lg"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
