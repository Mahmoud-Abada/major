"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/users/user-form";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
// User type - will be replaced with actual API types
interface User {
  id: string;
  email: string;
  role: string;
}

// Empty users array - will be populated from API
const mockUsers: User[] = [];

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const user = useMemo(() => {
    return mockUsers.find((u) => u.id === params.id);
  }, [params.id]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user you're trying to edit doesn't exist.
          </p>
          <Link href="/users">
            <Button>Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (userData: Partial<User>) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would be an API call
      console.log("Updating user:", { id: user.id, ...userData });

      // Redirect to user profile
      router.push(`/users/${user.id}`);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/users/${user.id}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <Link href={`/users/${user.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">
              Update {user.firstName} {user.lastName}'s information
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              initialData={user}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
              submitLabel="Update User"
              isEditing={true}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
