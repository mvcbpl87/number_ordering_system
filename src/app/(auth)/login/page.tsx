import { Card } from "@/components/ui/card";
import { UserAuthForm } from "@/components/form/user-auth-form";
import Image from "next/image";

const _constant = {
  imageUrl:
    "https://images.unsplash.com/photo-1509399316151-9b86c70fdd40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "background-image",
  size: "flex flex-grow h-screen w-full",
};

export default function LoginPage() {
  return (
    <>
      <div className="container grid h-svh relative flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
        <Image
          fill
          src={_constant.imageUrl}
          alt={_constant.alt}
          className="absolute w-full h-full "
        />
        <div className="absolute w-full h-full bg-black/30 " />
        {/* </div> */}
        <div className="z-[100] mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <div className="mb-4 flex items-center justify-center text-background">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <h1 className="text-xl font-medium text-background">Agent Login</h1>
          </div>
          <Card className="p-6">
            <div className="flex flex-col space-y-2 text-left pb-4">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your agent Id and password below <br />
                to log into your account
              </p>
            </div>
            <UserAuthForm />
            <p className="mt-4 text-sm text-center text-muted-foreground w-full">
              Need help? Contact hq to help with your login.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
