import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get applications
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      universities (name, short_name, country),
      programs (name, degree_type)
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    submitted: "bg-blue-100 text-blue-700",
    under_review: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    waitlisted: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your university applications from here.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link
            href="/universities"
            className="bg-white border rounded-xl p-5 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900">Browse Universities</h3>
            <p className="text-sm text-gray-500 mt-1">Find and apply to programs</p>
          </Link>

          <Link
            href="/profile"
            className="bg-white border rounded-xl p-5 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
          </Link>

          <div className="bg-white border rounded-xl p-5">
            <h3 className="font-semibold text-gray-900">Applications</h3>
            <p className="text-sm text-gray-500 mt-1">
              {applications?.length || 0} total
            </p>
          </div>
        </div>

        {/* Applications list */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-lg">Your Applications</h2>
          </div>

          {!applications || applications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-4">You haven’t applied to any universities yet.</p>
              <Link
                href="/universities"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Browse Universities
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {applications.map((app: any) => (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {app.universities?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.programs?.name} · {app.programs?.degree_type}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      statusColors[app.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}