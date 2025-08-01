'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, User, Calendar, BookOpen, Play, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

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

type QuestionCardProps = {
  question: Question;
  isTutor?: boolean;
  showSolutionButton?: boolean;
};

export function QuestionCard({
  question,
  isTutor = false,
  showSolutionButton = false,
}: QuestionCardProps) {
  const { user } = useAuth();
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(question.likesCount);
  const {
    id,
    questionTitle,
    questionDescription,
    subject,
    status,
    likesCount,
    createdAt,
    studentName,
    solutionDescription,
    videoUrl,
  } = question;
  console.log(question);
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const handleLike = async () => {
    if (isLiking) return;

    if (!user) {
      toast.error('You must be logged in to like questions');
      return;
    }

    try {
      setIsLiking(true);
      await api.post(`/api/questions/${id}/like`);
      setCurrentLikes(prev => prev + 1);
      toast.success('Question liked!');
    } catch (error: any) {
      console.error('Failed to like question:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
      } else if (error.response?.status === 409) {
        toast.error('You have already liked this question');
      } else {
        toast.error('Failed to like question. Please try again.');
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            <Link
              href={`/questions/${id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {questionTitle}
            </Link>
          </h3>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            status === 'PENDING'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            {status}
          </span>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="font-medium">{studentName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">{subject}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 leading-relaxed line-clamp-3">
          {questionDescription}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isLiking
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white hover:shadow-sm text-gray-600 hover:text-blue-600'
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">{currentLikes}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageSquare className="h-4 w-4" />
              <span>{solutionDescription ? '1 answer' : 'No answers yet'}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {isTutor && status === 'PENDING' && (
              <Link
                href={`/questions/${id}/answer`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Play className="h-4 w-4" />
                Upload Solution
              </Link>
            )}

            {status === 'RESOLVED' && (
              <button
                onClick={() => setIsSolutionOpen(!isSolutionOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm transition-colors font-medium"
              >
                {isSolutionOpen ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide Solution
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show Solution
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Solution Accordion */}
      {status === 'RESOLVED' && isSolutionOpen && (
        <div className="border-t border-gray-100">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Solution
            </h4>
            {solutionDescription && (
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {solutionDescription}
                </p>
              </div>
            )}
            {videoUrl && (
              <div className="rounded-lg overflow-hidden bg-black shadow-lg">
                <video
                  className="w-full max-h-96 object-contain"
                  controls
                  src={videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
