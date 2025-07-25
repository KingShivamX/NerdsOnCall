"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuestionList } from "@/components/questions/QuestionList";
import { useAuth } from "@/context/AuthContext";

export default function QuestionsPage() {
  const { user } = useAuth();
  // Determine if user is a tutor based on their role
  const isTutor = user?.role === 'TUTOR';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Community Questions</h1>
              <p className="text-gray-500">
                {isTutor ? 'Help students by answering their questions' : 'Get help with your questions from expert tutors'}
              </p>
            </div>

            <Link
              href="/questions/ask"
              className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Ask a Question
            </Link>
          </div>

          <QuestionList isTutor={isTutor} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
