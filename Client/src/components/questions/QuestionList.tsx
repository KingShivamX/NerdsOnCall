'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { QuestionCard } from './QuestionCard';
import { api } from '@/lib/api';

type QuestionStatus = 'PENDING' | 'RESOLVED';

interface Question {
  id: number;
  studentId: number;
  studentName: string;
  tutorId?: number | null;
  tutorName?: string | null;
  questionTitle: string;
  questionDescription: string;
  subject: string;
  solutionDescription?: string | null;
  videoUrl?: string | null;
  likesCount: number;
  createdAt: string;
  resolvedAt?: string | null;
  status: QuestionStatus;
}

interface QuestionListProps {
  isTutor?: boolean;
  showSolutionButton?: boolean;
  initialQuestions?: Question[];
}

export function QuestionList({ 
  isTutor = false, 
  showSolutionButton = false,
  initialQuestions = []
}: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(initialQuestions.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const hasFetched = useRef(false); // ✅ guard to avoid multiple API calls

  useEffect(() => {
    const fetchQuestions = async () => {
      if (hasFetched.current || initialQuestions.length > 0) return;
      hasFetched.current = true;

      setLoading(true);
      try {
        const response = await api.get('api/questions');

        // Map the API response to match our Question interface
        const formattedQuestions = response.data.map((q: any) => ({
          id: q.id,
          studentId: q.studentId,
          studentName: q.studentName || 'Anonymous',
          tutorId: q.tutorId,
          tutorName: q.tutorName,
          questionTitle: q.questionTitle || 'No title',
          questionDescription: q.questionDescription || 'No description',
          subject: q.subject || 'General',
          solutionDescription: q.solutionDescription,
          videoUrl: q.videoUrl,
          likesCount: q.likesCount || 0,
          createdAt: q.createdAt || new Date().toISOString(),
          resolvedAt: q.resolvedAt,
          status: q.status || 'PENDING',
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        const message = (err as any).response?.data?.message || 'Failed to load questions';
        setError(message);
        toast.error(message);
        
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []); // ✅ Only run once on mount

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = searchTerm === '' ||
        question.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.questionDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || question.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [questions, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No questions match your filters.'
              : 'No questions found. Be the first to ask a question!'}
          </p>
          {statusFilter !== 'ALL' && (
            <button
              onClick={() => setStatusFilter('ALL')}
              className="mt-2 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isTutor={isTutor}
              showSolutionButton={showSolutionButton && question.status === 'PENDING'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
