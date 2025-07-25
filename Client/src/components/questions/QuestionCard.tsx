'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
    
    try {
      setIsLiking(true);
      await api.post(`/api/questions/${id}/like`);
      setCurrentLikes(prev => prev + 1);
    } catch (error) {
      console.error('Failed to like question:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white mb-4">
      {/* Title and status */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">
          <Link href={`/questions/${id}`} className="hover:underline">
            {questionTitle}
          </Link>
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {status}
        </span>
      </div>

      {/* Meta */}
      <div className="text-sm text-gray-500 mb-3">
        <span className="font-medium">{studentName}</span> • {formattedDate} • {subject}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {questionDescription}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1 ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-500'}`}
          >
            👍 {currentLikes}
          </button>
          <span>💬 {solutionDescription ? 1 : 0} {solutionDescription ? 'answer' : 'answers'}</span>
        </div>

        <div className="flex gap-2">
          {isTutor && status === 'PENDING' && (
            <Link
              href={`/questions/${id}/answer`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              📤 Upload Solution
            </Link>
          )}
          
          {status === 'RESOLVED' && (
            <button
              onClick={() => setIsSolutionOpen(!isSolutionOpen)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 transition-colors"
            >
              {isSolutionOpen ? 'Hide Solution' : 'Show Solution'}
            </button>
          )}
        </div>
      </div>

      {/* Solution Accordion */}
      {status === 'RESOLVED' && isSolutionOpen && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Solution:</h4>
          {solutionDescription && (
            <p className="text-sm text-gray-700 mb-4">{solutionDescription}</p>
          )}
          {videoUrl && (
            <div className="mt-2 rounded-lg overflow-hidden">
              <video 
                className="h-[300px]" 
                controls 
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
