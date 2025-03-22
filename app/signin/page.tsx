import Info from "@/components/auth/Info";
import SignInForm from "@/components/auth/SignInForm";




export default function Home() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row items-center justify-evenly bg-gray-100">
      <Info category={"students"}/>
      <SignInForm/>
    </div>
  );
}
