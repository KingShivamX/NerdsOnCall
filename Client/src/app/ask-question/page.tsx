"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    MessageCircle,
    Upload,
    X,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
    Paperclip,
} from "lucide-react"
import toast from "react-hot-toast"

const SUBJECTS = [
    { value: "MATHEMATICS", label: "Mathematics" },
    { value: "PHYSICS", label: "Physics" },
    { value: "CHEMISTRY", label: "Chemistry" },
    { value: "BIOLOGY", label: "Biology" },
    { value: "COMPUTER_SCIENCE", label: "Computer Science" },
    { value: "ENGLISH", label: "English" },
    { value: "HISTORY", label: "History" },
    { value: "GEOGRAPHY", label: "Geography" },
    { value: "ECONOMICS", label: "Economics" },
    { value: "ACCOUNTING", label: "Accounting" },
    { value: "STATISTICS", label: "Statistics" },
    { value: "CALCULUS", label: "Calculus" },
    { value: "ALGEBRA", label: "Algebra" },
    { value: "GEOMETRY", label: "Geometry" },
    { value: "TRIGONOMETRY", label: "Trigonometry" },
]

const PRIORITIES = [
    { value: "LOW", label: "Low", color: "bg-green-100 text-green-800" },
    {
        value: "MEDIUM",
        label: "Medium",
        color: "bg-yellow-100 text-yellow-800",
    },
    { value: "HIGH", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-800" },
]

export default function AskQuestionPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "",
        priority: "MEDIUM",
    })
    const [attachments, setAttachments] = useState<File[]>([])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length + attachments.length > 5) {
            toast.error("Maximum 5 files allowed")
            return
        }
        setAttachments((prev) => [...prev, ...files])
    }

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.subject
        ) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            // First upload attachments if any
            let attachmentUrls: string[] = []

            if (attachments.length > 0) {
                try {
                    const uploadPromises = attachments.map(async (file) => {
                        const formData = new FormData()
                        formData.append("file", file)

                        const uploadResponse = await api.post(
                            "/api/upload",
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        )

                        return uploadResponse.data.url || uploadResponse.data
                    })

                    attachmentUrls = await Promise.all(uploadPromises)
                } catch (uploadError) {
                    console.warn(
                        "File upload failed, proceeding without attachments:",
                        uploadError
                    )
                    // Continue without attachments if upload fails
                    attachmentUrls = []
                }
            }

            // Create doubt with JSON payload
            const doubtData = {
                title: formData.title,
                description: formData.description,
                subject: formData.subject,
                priority: formData.priority,
                attachments: attachmentUrls,
                preferredTutorId: null,
            }

            const response = await api.post("/api/doubts", doubtData)

            toast.success("Question submitted successfully!")

            // Redirect to my questions page
            router.push("/my-questions")
        } catch (error: any) {
            console.error("Error submitting question:", error)
            toast.error(
                error.response?.data ||
                    error.response?.data?.message ||
                    "Failed to submit question"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user || user.role !== "STUDENT") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-slate-600 mb-4">
                            This page is only available to students.
                        </p>
                        <Button onClick={() => router.push("/dashboard")}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-20 pb-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-4 text-slate-600 hover:text-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">
                                    Ask a Question
                                </h1>
                                <p className="text-slate-600">
                                    Get help from our expert tutors
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                                    Question Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Question Title *
                                    </label>
                                    <Input
                                        placeholder="Enter a clear, concise title for your question"
                                        value={formData.title}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full transition-colors ${
                                            formData.title.length > 180
                                                ? "border-yellow-300 focus:border-yellow-500"
                                                : formData.title.length > 0
                                                ? "border-green-300 focus:border-green-500"
                                                : ""
                                        }`}
                                        maxLength={200}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <p
                                            className={`text-xs ${
                                                formData.title.length > 180
                                                    ? "text-yellow-600"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {formData.title.length}/200
                                            characters
                                        </p>
                                        {formData.title.length > 0 && (
                                            <span className="text-xs text-green-600">
                                                ✓ Good
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Subject and Priority */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Subject *
                                        </label>
                                        <Select
                                            value={formData.subject}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "subject",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SUBJECTS.map((subject) => (
                                                    <SelectItem
                                                        key={subject.value}
                                                        value={subject.value}
                                                    >
                                                        {subject.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Priority
                                        </label>
                                        <Select
                                            value={formData.priority}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "priority",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRIORITIES.map((priority) => (
                                                    <SelectItem
                                                        key={priority.value}
                                                        value={priority.value}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Badge
                                                                className={`text-xs ${priority.color}`}
                                                            >
                                                                {priority.label}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Question Description *
                                    </label>
                                    <Textarea
                                        placeholder="Describe your question in detail. Include any specific concepts you're struggling with, what you've tried, and what kind of help you need."
                                        value={formData.description}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full min-h-[120px] transition-colors ${
                                            formData.description.length > 1800
                                                ? "border-yellow-300 focus:border-yellow-500"
                                                : formData.description.length >
                                                  50
                                                ? "border-green-300 focus:border-green-500"
                                                : ""
                                        }`}
                                        maxLength={2000}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <p
                                            className={`text-xs ${
                                                formData.description.length >
                                                1800
                                                    ? "text-yellow-600"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {formData.description.length}/2000
                                            characters
                                        </p>
                                        {formData.description.length > 50 && (
                                            <span className="text-xs text-green-600">
                                                ✓ Detailed
                                            </span>
                                        )}
                                        {formData.description.length < 20 &&
                                            formData.description.length > 0 && (
                                                <span className="text-xs text-orange-600">
                                                    ⚠ Add more details
                                                </span>
                                            )}
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Attachments (Optional)
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                                            attachments.length > 0
                                                ? "border-green-300 bg-green-50"
                                                : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,.pdf,.doc,.docx,.txt"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                                    attachments.length > 0
                                                        ? "bg-green-100"
                                                        : "bg-slate-100"
                                                }`}
                                            >
                                                <Upload
                                                    className={`h-6 w-6 ${
                                                        attachments.length > 0
                                                            ? "text-green-600"
                                                            : "text-slate-400"
                                                    }`}
                                                />
                                            </div>
                                            <p className="text-sm text-slate-600 mb-1 font-medium">
                                                {attachments.length > 0
                                                    ? `${
                                                          attachments.length
                                                      } file${
                                                          attachments.length > 1
                                                              ? "s"
                                                              : ""
                                                      } selected`
                                                    : "Click to upload files"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Images, PDFs, Word docs (Max 5
                                                files, 10MB each)
                                            </p>
                                        </label>
                                    </div>

                                    {/* Attachment List */}
                                    {attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <Paperclip className="h-4 w-4 text-slate-500" />
                                                        <span className="text-sm text-slate-700">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            (
                                                            {(
                                                                file.size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB)
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeAttachment(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    !formData.title.trim() ||
                                    !formData.description.trim() ||
                                    !formData.subject
                                }
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Submit Question
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
