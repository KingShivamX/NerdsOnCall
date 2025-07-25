'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const subjects = [
  { value: 'MATH', label: 'Mathematics' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'BIOLOGY', label: 'Biology' },
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'HISTORY', label: 'History' },
  { value: 'OTHER', label: 'Other' },
];

export default function AskQuestionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      subject: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.subject) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/questions', {
        title: formData.title,
        description: formData.description,
        subject: formData.subject
      });

      alert('Your question has been posted.');
      router.push('/questions');
    } catch (error: any) {
      console.error('Error submitting question:', error);
      const errorMessage = error.response?.data?.message || 'Failed to post your question. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ask a Question</h1>
          <p className="text-gray-500 mt-2">
            Get help from our community of tutors and students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block font-medium">
              Question Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="What's your question? Be specific."
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              Keep it clear and concise, like you're asking a friend.
            </p>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="block font-medium">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleSubjectChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium">
              Details *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Include all the information someone would need to answer your question..."
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              The more details you provide, the better answers you'll receive.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                'Post Question'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
