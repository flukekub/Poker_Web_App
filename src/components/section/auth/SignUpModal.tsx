"use client";
import { useState } from "react";
import { LinearProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Divider from "@/components/ui/Divider";
import { userRegister } from "@/lib/api";
import { signIn } from "next-auth/react";

const SignUpModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      
      await userRegister(username, avatarFile, email, password);
    } catch (error) {
      setErrorMsg("Registration failed. Please try again.");
      console.error("Registration failed:", error);
    } finally {
      const result = await signIn("credentials", {
        redirect: false,
        name: username,
        password,
      });
      if (result?.error) {
        setErrorMsg("Invalid username or password");
        console.error("Sign in failed:", result.error);
      } else if (result?.ok) {
        router.push("/");
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close button */}

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-5">
          Sign up
        </h1>

        
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full ring-2 ring-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="avatar preview"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={clearAvatar}
                    className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-700"
                  >
                    x
                  </button>
                )}
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span>{avatarPreview ? "Change Image" : "Upload Image"}</span>
              </label>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  User name
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
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
              <div className="flex-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                  placeholder="Confirm your password"
                  required
                />
              </div>
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
              did you already have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                onClick={() => router.push("/auth/signin")}
              >
                Sign in
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
              disabled={!email || !password}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
