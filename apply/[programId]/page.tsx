"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.programId as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [program, setProgram] = useState<any>(null);
  const [university, setUniversity] = useState<any>(null);
  const [personalStatement, setPersonalStatement] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Load program + university
      const { data: prog, error: progError } = await supabase
        .from("programs")
        .select(`
          *,
          universities (*)
        `)
        .eq("id", programId)
        .single();

      if (progError || !prog) {
        setError("Program not found");
        setLoading(false);
        return;
      }

      setProgram(prog);
      setUniversity(prog.universities);
      setLoading(false);
    };

    loadData();
  }, [programId, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in");
      setSubmitting(false);
      return;
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("student_id", user.id)
      .eq("program_id", programId)
      .maybeSingle();

    if (existing) {
      setError("You have already applied to this program.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("applications").insert({
      student_id: user.id,
      university_id: university.id,
      program_id: programId,
      status: "submitted",
      personal_statement: personalStatement,
      additional_info: additionalInfo,
      submitted_at: new Date().toISOString(),
    });

    if (insertError) {
      setError("Failed to submit application. Please try again.");
      console.error(insertError);
    } else {
      setMessage("Application submitted successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (error && !program) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/universities" className="text-blue-600 hover:underline">
            Back to Universities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/universities"
            className="text-sm text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Universities
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Apply to Program</h1>
          <p className="text-gray-600 mt-1">
            {program?.name} · {university?.name}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Program Details</h2>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Degree:</span> {program?.degree_type}
          </p>
          {program?.duration_years && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Duration:</span> {program.duration_years} years
            </p>
          )}
          {program?.application_deadline && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Deadline:</span>{" "}
              {new Date(program.application_deadline).toLocaleDateString()}
            </p>
          )}
          {program?.description && (
            <p className="text-sm text-gray-600 mt-3">{program.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-5">
          {message && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal Statement *
            </label>
            <textarea
              required
              rows={6}
              value={personalStatement}
              onChange={(e) => setPersonalStatement(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us why you want to study this program..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (optional)
            </label>
            <textarea
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any extra information you want to include..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </main>
    </div>
  );
}
