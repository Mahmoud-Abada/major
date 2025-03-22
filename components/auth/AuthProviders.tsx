import { Button } from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export function AuthProviders() {
  return (
    <div className="space-y-3">
      <Button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100">
        <FcGoogle size={20} /> Sign in with Google
      </Button>
      <Button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100">
        <FaFacebook size={20} className="text-blue-600" /> Sign in with Facebook
      </Button>
    </div>
  );
}
