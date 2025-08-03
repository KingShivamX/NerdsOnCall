"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuestionList } from "@/components/questions/QuestionList";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, BookOpen, Users, TrendingUp } from "lucide-react";

export default function QuestionsPage() {
  const { user } = useAuth();
  // Determine if user is a tutor based on their role
  const isTutor = user?.role === "TUTOR";

  // Check if user is authenticated for certain actions
  const handleAskQuestion = () => {
    if (!user) {
      // You can add a toast here if needed
      window.location.href = "/auth/login";
      return;
    }
    window.location.href = "/questions/ask";
  };

  return (
    <div className="min-h-screen flex flex-col bg-orange-100">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-black border-b-4 border-black text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-wide text-white">
                Community Questions
              </div>
              <p className="text-xl text-white font-bold mb-8 max-w-2xl mx-auto uppercase tracking-wide">
                {isTutor
                  ? "Share your expertise and help students succeed by answering their questions"
                  : "Get instant help from our community of expert tutors and fellow students"}
              </p>

              <button
                onClick={handleAskQuestion}
                className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-300 hover:bg-yellow-400 text-black border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] font-black uppercase tracking-wide transition-all"
              >
                <PlusCircle className="h-6 w-6" />
                Ask a Question
              </button>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="container mx-auto px-4 py-8">
          <QuestionList isTutor={isTutor} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
