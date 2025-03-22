import Info from "@/components/auth/Info";
import SignUpForm from "@/components/auth/SignUpForm";




export default function Home() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row items-center justify-evenly bg-gray-100">
      <Info category={"students"}/>
      <SignUpForm/>
    </div>
  );
}
