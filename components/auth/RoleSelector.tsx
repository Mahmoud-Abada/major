"use client";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedRole } from "@/store/userRoleSlice";
import { RootState } from "@/store/store";

const roles = ["student", "teacher", "talent", "school"];

export default function RoleSelector() {
  const dispatch = useDispatch();
  const selectedRole = useSelector(
    (state: RootState) => state.userRole.selectedRole,
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedRole(event.target.value));
  };

  return (
    <div className="mt-4 max-w-80 w-full mx-auto">
      <label className="block text-gray-700 font-semibold mb-1">
        Select Role (Dev Only)
      </label>
      <select
        value={selectedRole || "student"}
        onChange={handleChange}
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
