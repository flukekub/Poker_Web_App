"use client";
import { useState } from "react";
import { LinearProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import Divider from "@/components/ui/Divider";
import { signIn } from "next-auth/react";


const SignInModal = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        name, // credentials key expected by authOptions
        password,
      });
      if (result?.error) {
        setErrorMsg("Invalid username or password");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMsg("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Avatar placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          Sign in
        </h1>

        {/* Email form */}
        <div className="mb-6">
          <p className="text-gray-600 text-center text-sm mb-4">
            Enter your username and password to sign in
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="Enter your password"
                required
              />
            </div>

            {errorMsg && (
              <div
                className="mb-4 text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {errorMsg}
              </div>
            )}

            <Divider txtMiddle="or" />

            <p className="text-gray-600 text-center mb-2">
              Don&apos;t have any account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                onClick={() => router.push("/auth/signup")}
              >
                Sign up
              </button>
            </p>

            {loading && (
              <div className="mb-6">
                <LinearProgress color="primary" />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] enabled:hover:bg-gray-600 text-white font-medium py-3 px-4  transition-all duration-200 disabled:opacity-50 rounded-md enabled:cursor-pointer"
              disabled={!name || !password || loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
