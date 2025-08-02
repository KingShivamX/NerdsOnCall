import Link from "next/link";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/card";
import {
  Video,
  Clock,
  Users,
  BookOpen,
  Shield,
  ArrowRight,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "HD Video Sessions",
    description:
      "Crystal-clear video calls with professional-grade audio quality for seamless learning experiences.",
  },
  {
    icon: FileText,
    title: "Interactive Whiteboard",
    description:
      "Advanced collaborative canvas with drawing tools, equation support, and real-time synchronization.",
  },
  {
    icon: Users,
    title: "Expert Tutors",
    description:
      "Handpicked tutors from top universities with proven expertise in their respective subjects.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Round-the-clock access to tutoring sessions and support whenever you need assistance.",
  },
  {
    icon: BookOpen,
    title: "All Subjects",
    description:
      "Comprehensive coverage from elementary math to advanced university-level courses.",
  },
];

export function Features() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-6 leading-tight tracking-tight">
            Premium Learning Experience
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Access world-class tutoring with cutting-edge technology designed
            for optimal learning outcomes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white group"
            >
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 mb-2 sm:mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-6 leading-tight">
              Ready to Experience Premium Learning?
            </h3>
            <p className="text-slate-600 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
              Join thousands of students who have transformed their academic
              journey with our expert tutoring platform
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
              <Link href="/auth/register?role=student">
                <Button
                  size="lg"
                  className="bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-950 text-white font-semibold px-6 sm:px-8 h-10 sm:h-12 lg:h-14 group transition-all duration-200 w-full sm:w-auto hover:shadow-lg focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/register?role=tutor">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 hover:border-slate-400 focus:border-slate-500 text-slate-700 hover:text-slate-800 focus:text-slate-900 hover:bg-slate-50 focus:bg-slate-100 active:bg-slate-200 font-semibold px-6 sm:px-8 h-10 sm:h-12 lg:h-14 w-full sm:w-auto transition-all duration-200 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
