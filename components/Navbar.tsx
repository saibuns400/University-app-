"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UA</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">University App</span>
            </Link>

            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/universities"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Universities
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}