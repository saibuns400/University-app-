import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function UniversitiesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: universities } = await supabase
    .from("universities")
    .select(`
      *,
      programs (id, name, degree_type, application_deadline)
    `)
    .order("name");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
          <p className="text-gray-600 mt-1">
            Browse universities and their programs. You can apply to multiple ones.
          </p>
        </div>

        {!universities || universities.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-2">No universities have been added yet.</p>
            <p className="text-sm text-gray-400">
              (We will add sample universities next)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universities.map((uni: any) => (
              <div key={uni.id} className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900">{uni.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {uni.city ? `${uni.city}, ` : ""}
                  {uni.country}
                </p>

                {uni.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {uni.description}
                  </p>
                )}

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Programs
                  </p>
                  {uni.programs && uni.programs.length > 0 ? (
                    <ul className="space-y-2">
                      {uni.programs.map((prog: any) => (
                        <li
                          key={prog.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>
                            {prog.name}{" "}
                            <span className="text-gray-400">({prog.degree_type})</span>
                          </span>
                          <Link
                            href={`/apply/${prog.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Apply
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">No programs listed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}