"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BlockLoader } from "../ui/Loader";
import { Check, Crown, Star, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plan, Subscription } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/currency";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const planIcons: Record<string, any> = {
  Essential: Star,
  Professional: Crown,
  Enterprise: Shield,
};

export function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingPlanId, setPayingPlanId] = useState<number | null>(null);
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await api.get<Plan[]>("/plans");
        setPlans(response.data);
      } catch (err: any) {
        setError("Failed to load plans.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Fetch user's current subscription if logged in
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user && user.role === "STUDENT") {
        try {
          const res = await api.get<Subscription | string>(
            "/subscriptions/my-subscription"
          );
          if (
            typeof res.data === "object" &&
            res.data !== null &&
            "id" in res.data
          ) {
            setSubscription(res.data as Subscription);
          } else {
            setSubscription(null);
          }
        } catch {
          setSubscription(null);
        }
      }
    };
    fetchSubscription();
  }, [user]);

  // Optionally, you can define features for each plan name if not provided by backend
  const featuresMap: Record<string, string[]> = {
    Essential: [
      "Up to 10 hours of tutoring per month",
      "Access to certified tutors",
      "HD video sessions",
      "Basic whiteboard tools",
      "Email support",
      "Session recordings (1 week)",
    ],
    Professional: [
      "Unlimited tutoring hours",
      "Premium tutor selection",
      "HD video + screen sharing",
      "Advanced whiteboard tools",
      "Priority support",
      "Session recordings (30 days)",
      "Progress tracking",
      "Mobile app access",
    ],
    Enterprise: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "Admin dashboard",
      "Bulk user management",
      "Custom branding",
      "SLA guarantee",
      "24/7 phone support",
    ],
  };

  // Optionally, mark the most popular plan
  const isPopular = (plan: Plan) => plan.name === "Professional";

  // Razorpay handler
  const handleSubscribe = async (plan: Plan) => {
    if (!user || !user.email) {
      toast.error("You must be logged in to subscribe.");
      return;
    }
    setPayingPlanId(plan.id);
    try {
      const response = await api.post("/subscriptions/checkout", null, {
        params: { planId: plan.id },
      });
      const order = response.data;
      // Load Razorpay script if not present
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: order.name,
        description: order.description,
        order_id: order.orderId,
        handler: async function (rzpResponse: any) {
          try {
            await api.post("/payment/verify", null, {
              params: {
                orderId: rzpResponse.razorpay_order_id,
                paymentId: rzpResponse.razorpay_payment_id,
                signature: rzpResponse.razorpay_signature,
                planId: plan.id,
                userEmail: user.email,
              },
            });
            toast.success("Payment verified! Subscription activated.");
            // Refresh subscription status
            const subRes = await api.get<Subscription | string>(
              "/subscriptions/my-subscription"
            );
            if (
              typeof subRes.data === "object" &&
              subRes.data !== null &&
              "id" in subRes.data
            ) {
              setSubscription(subRes.data as Subscription);
            }
          } catch (err: any) {
            toast.error("Payment verification failed. Please contact support.");
            // Redirect to dashboard on payment failure
            window.location.href = "/dashboard";
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#1e293b",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(
        err?.response?.data || err?.message || "Failed to start payment."
      );
    } finally {
      setPayingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <BlockLoader size="lg" className="mx-auto mb-4" />
        <p className="text-lg text-black font-bold uppercase tracking-wide">
          Loading plans...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-20 text-center text-black font-bold bg-red-300 border-3 border-black shadow-[4px_4px_0px_0px_black] p-4 mx-4 uppercase tracking-wide">
        {error}
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-yellow-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-3 sm:mb-4 lg:mb-6 leading-tight tracking-wide uppercase">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-black max-w-3xl mx-auto leading-relaxed font-bold">
            Choose the perfect plan for your learning journey. All plans include
            our core features with no hidden fees.
          </p>
        </div>

        {user && user.role === "STUDENT" && subscription && (
          <div className="mb-8 text-center">
            <div className="inline-block bg-green-300 text-black px-6 py-3 border-3 border-black shadow-[4px_4px_0px_0px_black] font-black uppercase tracking-wide">
              You are subscribed to: <b>{subscription.planType}</b> (Status:{" "}
              {subscription.status})
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          {plans.map((plan) => {
            const Icon = planIcons[plan.name] || Star;
            const features = featuresMap[plan.name] || [];
            return (
              <Card
                key={plan.id}
                className={`relative bg-white border-3 border-black shadow-[6px_6px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_black] transition-all duration-300 ${
                  isPopular(plan) ? "scale-105 lg:scale-110" : ""
                }`}
              >
                {isPopular(plan) && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-black text-white px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_black] font-black uppercase tracking-wide">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-black border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_black]`}
                    >
                      <Icon
                        className={`h-6 w-6 sm:h-8 sm:w-8 ${
                          isPopular(plan) ? "text-cyan-300" : "text-white"
                        }`}
                      />
                    </div>
                  </div>

                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-black text-black mb-2 sm:mb-3 uppercase tracking-wide">
                    {plan.name}
                  </CardTitle>
                  <p className="text-xs sm:text-sm lg:text-base text-black mb-4 sm:mb-6 font-bold">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline justify-center mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-black">
                      {formatINR(plan.price)}
                    </span>
                    <span className="text-black ml-2 text-base sm:text-lg font-bold">
                      /month
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-4 sm:px-6 pb-6 sm:pb-8">
                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 sm:gap-3"
                      >
                        <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-green-300 border border-black flex items-center justify-center mt-0.5">
                          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-black" />
                        </div>
                        <span className="text-xs sm:text-sm lg:text-base text-black leading-relaxed font-bold">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {user && user.role === "STUDENT" ? (
                    <Button
                      className={`w-full h-10 sm:h-12 font-black transition-all duration-200 text-sm sm:text-base border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] uppercase tracking-wide ${
                        isPopular(plan)
                          ? "bg-cyan-300 hover:bg-cyan-400 text-black"
                          : "bg-pink-300 hover:bg-pink-400 text-black"
                      }`}
                      onClick={() => handleSubscribe(plan)}
                      disabled={payingPlanId === plan.id}
                    >
                      {payingPlanId === plan.id
                        ? "Processing..."
                        : "Subscribe Now"}
                    </Button>
                  ) : (
                    <Link
                      href={`/auth/register?role=student&plan=${plan.name.toLowerCase()}`}
                    >
                      <Button
                        className={`w-full h-10 sm:h-12 font-black transition-all duration-200 text-sm sm:text-base border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] uppercase tracking-wide ${
                          isPopular(plan)
                            ? "bg-cyan-300 hover:bg-cyan-400 text-black"
                            : "bg-pink-300 hover:bg-pink-400 text-black"
                        }`}
                      >
                        Get Started
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tutor CTA */}
        <div className="text-center">
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_black] p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-black mb-3 sm:mb-4 uppercase tracking-wide">
              Ready to Start Teaching?
            </h3>
            <p className="text-black mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto font-bold">
              Join our community of expert tutors and start earning premium
              rates for your expertise.
            </p>
            <Link href="/auth/register?role=tutor">
              <Button className="bg-yellow-300 hover:bg-yellow-400 text-black border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] font-black px-6 sm:px-8 h-10 sm:h-12 lg:h-14 transition-all duration-200 uppercase tracking-wide">
                <Crown className="mr-2 h-4 w-4 text-black" />
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
