"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInFlow } from "../../types/auth-types";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

interface SignupProp {
  setFormType: (state: SignInFlow) => void;
}

export default function EmpSignIncard({ setFormType: setState }: SignupProp) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const signinWithProvider = async (provider: "github" | "credentials") => {
    try {
      toast.loading("Loading...")
      if (provider === "credentials") {
        const res = signIn(provider, {
          data: {
            email,
            password,
            redirect: false,
            callbackUrl: "/empboarding",
          },
        });
        res.then((res) => {
          if (res?.error) {
            setError(res.error);
            toast.error("Invalid credentials");
          }
          else {
            toast.success("Successfully signed up!");
            router.push("/");
          }
          setPending(false);
        });
      }
      if (provider === "github") {
        const res = signIn(provider, {
          data: {
            redirect: false,
            callbackUrl: "/empboarding",
          },
        });
        res.then((res) => {
          if (res?.error) {
            setError(res.error);
            toast.error("Failed to sign up with GitHub");
          } else {
            toast.success("Successfully signed up with GitHub!");
          }
          setPending(false);
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
      setPending(false);
    }
  };

  const handleCredentials = (e) => {
    e.preventDefault();
    setError("");
    setPending(true);
    signinWithProvider("credentials");
  };
  const handleGithub = (provider: "github") => {
    setError("");
    setPending(true);
    signinWithProvider(provider);
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md  ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight ">
            Welcome Back!
          </CardTitle>
          <CardTitle className="text-2xl font-bold tracking-tight ">
            Login to your account
          </CardTitle>
          <CardDescription className="text-zinc-400 text-4xl">
          We lead the industry in technical interviews for sourcing top developer talent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full  bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
              disabled={pending}
              onClick={() => {
                handleGithub("github");
              }}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">
                Or continue with
              </span>
            </div>
          </div>
          <form onSubmit={handleCredentials} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="">
                Email
              </Label>
              <Input
                value={email}
                type="email"
                placeholder="m@example.com"
                disabled={pending}
                required
                className=" placeholder:text-zinc-500"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                disabled={pending}
                placeholder="*******"
                required
                className="placeholder:text-zinc-500"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
              disabled={pending}
            >
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <span
              className="cursor-pointer text-teal-500 hover:underline"
              onClick={() => setState("signUp")}
            >
              Sign up
            </span>
          </p>
        </CardFooter>
      </Card>
      <Toaster richColors/>
    </div>
  );
}
