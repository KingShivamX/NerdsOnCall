'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, HelpCircle, BookOpen, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

// These should match the backend Subject enum exactly
const subjects = [
  { value: 'MATHEMATICS', label: 'Mathematics', icon: '📐' },
  { value: 'PHYSICS', label: 'Physics', icon: '⚛️' },
  { value: 'CHEMISTRY', label: 'Chemistry', icon: '🧪' },
  { value: 'BIOLOGY', label: 'Biology', icon: '🧬' },
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science', icon: '💻' },
  { value: 'ENGLISH', label: 'English', icon: '📚' },
  { value: 'HISTORY', label: 'History', icon: '🏛️' },
  { value: 'GEOGRAPHY', label: 'Geography', icon: '🌍' },
  { value: 'ECONOMICS', label: 'Economics', icon: '💰' },
  { value: 'ACCOUNTING', label: 'Accounting', icon: '📊' },
  { value: 'STATISTICS', label: 'Statistics', icon: '📈' },
  { value: 'CALCULUS', label: 'Calculus', icon: '∫' },
  { value: 'ALGEBRA', label: 'Algebra', icon: '𝑥' },
  { value: 'GEOMETRY', label: 'Geometry', icon: '△' },
  { value: 'TRIGONOMETRY', label: 'Trigonometry', icon: '∠' },
];

export default function AskQuestionPage() {
  const router = useRouter();
  const { user } = useAuth();
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

    console.log('Form submission started');
    console.log('Current user:', user);
    console.log('Form data:', formData);

    if (!formData.title.trim() || !formData.description.trim() || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      toast.error('You must be logged in to ask a question');
      router.push('/login');
      return;
    }

    console.log('User authenticated, proceeding with submission');
    setIsSubmitting(true);
    const loadingToast = toast.loading('Posting your question...');

    try {
      // Prepare the request payload to match backend DTO
      const requestPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject // This should be the enum value like 'MATH', 'PHYSICS', etc.
      };

      console.log('Sending question request:', requestPayload);
      const response = await api.post('/api/questions', requestPayload);

      console.log('Question posted successfully:', response.data);
      toast.success('Your question has been posted successfully!', { id: loadingToast });

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
      });

      // Navigate to questions page
      router.push('/questions');
    } catch (error: any) {
      console.error('Error submitting question:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      if (error.response?.status === 401) {
        console.log('401 error - session expired');
        toast.error('Your session has expired. Please log in again.', { id: loadingToast });
        // Don't redirect immediately, let user see the error
        setTimeout(() => router.push('/login'), 2000);
      } else if (error.response?.status === 403) {
        console.log('403 error - permission denied');
        toast.error('You do not have permission to post questions.', { id: loadingToast });
      } else if (error.response?.status === 400) {
        console.log('400 error - bad request');
        const errorMessage = error.response?.data?.message || 'Invalid request. Please check your input.';
        toast.error(errorMessage, { id: loadingToast });
      } else {
        console.log('Other error:', error.response?.status);
        const errorMessage = error.response?.data?.message || 'Failed to post your question. Please try again.';
        toast.error(errorMessage, { id: loadingToast });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Ask a Question
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Get instant help from our community of expert tutors and fellow students
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="space-y-3">
                  <label htmlFor="title" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Question Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="What's your question? Be specific and clear."
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">💡</span>
                    Keep it clear and concise, like you're asking a friend.
                  </p>
                </div>

                {/* Subject */}
                <div className="space-y-3">
                  <label htmlFor="subject" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleSubjectChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.icon} {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label htmlFor="description" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Details *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Include all the information someone would need to answer your question. Be as detailed as possible..."
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">📝</span>
                    The more details you provide, the better answers you'll receive.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center font-medium transition-colors shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Posting Question...
                      </>
                    ) : (
                      <>
                        <HelpCircle className="h-5 w-5 mr-2" />
                        Post Question
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
