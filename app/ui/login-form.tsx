"use client";

import { CircleAlert, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { authenticate } from "../lib/auth/action";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [state, formAction, isPending] = useActionState(authenticate, undefined);

  useEffect(() => {
    // Check if login was successful (state.success is true)
    if (state && typeof state === "object" && state.success === true) {
      Swal.fire({
        icon: "success",
        title: "Welcome Back! 🎉",
        html: `<p style="color: #6b7280; font-size: 13px; margin-top: 8px;">You've successfully logged in to <strong style="color: #1f2937;">StepUp</strong></p>`,
        background: "#ffffff",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Sign in",
        confirmButtonAriaLabel: "Continue to dashboard",
        width: "320px",
        padding: "24px",
        iconColor: "#10b981",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-semibold text-gray-900",
          htmlContainer: "text-center",
          confirmButton: "rounded-lg font-medium text-sm py-2 px-6",
        },
        allowEscapeKey: false,
        allowOutsideClick: false,
        timer: 2000,
        timerProgressBar: true,
        progressSteps: [],
        didOpen: () => {
          console.log("✅ Login successful! Showing popup...");
        },
      }).then((result) => {
        console.log("🔄 Redirecting to dashboard...");
        // Redirect to dashboard after popup closes
        window.location.href = callbackUrl;
      });
    }
  }, [state, callbackUrl]);

  const errorMessage = state && typeof state === "object" && state.error ? state.error : undefined;

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-16 bg-white py-8 md:py-0">
        <div className="max-w-md w-full mx-auto">
          <Image className="h-12 mx-auto mb-6" src="/logo.png" alt="logo" width={240} height={48} />
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
          </div>

          <form action={formAction} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-2.5 md:py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-2.5 md:py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 md:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
              {errorMessage && (
                <>
                  <CircleAlert className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Dont have an account?
              <Link className="font-medium text-blue-600 hover:text-blue-500 ml-1" href="/signup"> Sign up</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="w-full  md:w-1/2 h-48 md:h-auto bg-blue-50">
        <div className="h-full relative">
          <Image src="/login.jpg" alt="Luxury Shoes" fill className="object-cover object-center" priority />
        </div>
      </div>
    </div>
  );
}
