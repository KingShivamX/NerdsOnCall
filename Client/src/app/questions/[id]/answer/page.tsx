'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Upload, Video as VideoIcon } from 'lucide-react';
import { api } from '@/lib/api';

type Question = {
  id: string;
  title: string;
  description: string;
  subject: string;
  studentName: string;
};

export default function SubmitSolutionPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [solution, setSolution] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/api/questions/${id}`);
        const questionData = response.data;
        
        setQuestion({
          id: questionData.id,
          title: questionData.questionTitle,
          description: questionData.questionDescription,
          subject: questionData.subject,
          studentName: questionData.studentName,
        });
      } catch (error) {
        console.error('Error fetching question:', error);
        alert('Failed to load question details');
        router.push('/questions');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file');
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Maximum file size is 100MB');
      return;
    }

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!solution.trim()) {
      alert('Please provide a solution description');
      return;
    }

    if (!videoFile) {
      alert('Please upload a video solution');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('solutionDescription', solution);
      formData.append('videoFile', videoFile);

      await api.post(`/api/questions/${id}/solution`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Your solution has been submitted successfully!');
      router.push('/explore');
    } catch (error: any) {
      console.error('Error submitting solution:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit your solution. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading question...</span>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <p>Question not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Submit a Solution</h1>
          <p className="text-gray-500 mt-2">
            Help other students by providing a detailed solution
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
          <p className="text-gray-700">{question.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span>Asked by {question.studentName}</span>
            <span>•</span>
            <span>{question.subject}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="solution" className="block font-medium">
              Your Solution *
            </label>
            <textarea
              id="solution"
              placeholder="Explain the solution in detail..."
              className="w-full border rounded p-3 min-h-[150px] text-sm"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              Provide a clear and detailed explanation of the solution.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Video Solution *</label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setPreviewUrl(null);
                    }}
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                    disabled={isSubmitting}
                  >
                    Change Video
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Upload a video solution</p>
                    <p className="text-sm text-gray-500">
                      MP4, WebM or MOV (max 100MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="border px-4 py-2 rounded hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              disabled={isSubmitting || !solution.trim() || !videoFile}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Submit Solution
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
