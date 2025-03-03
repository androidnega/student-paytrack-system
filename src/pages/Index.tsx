
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Lock, Check, Users, Receipt, BarChart, Shield } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login");
  };

  const features = [
    {
      title: "Student Payment Tracking",
      description:
        "Record and track payments via MoMo or cash with unique transaction codes for verification.",
      icon: Receipt,
    },
    {
      title: "Record Management",
      description:
        "Sort and filter students by specialization, payment status, and more.",
      icon: Users,
    },
    {
      title: "Automated Reminders",
      description:
        "Students receive periodic reminders about payments and deadlines.",
      icon: Check,
    },
    {
      title: "Secure Access Control",
      description:
        "Role-based authentication for Super Admin, Main Course Rep, and Assistant Rep.",
      icon: Shield,
    },
    {
      title: "Dashboard Insights",
      description:
        "Overview of payments, student statistics, and detailed transaction logs.",
      icon: BarChart,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <header className="w-full py-6 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md w-10 h-10 flex items-center justify-center text-primary-foreground font-bold text-lg">
            TTU
          </div>
          <h1 className="text-xl font-bold">PayTrack</h1>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate("/login")}
        >
          <Lock className="h-4 w-4" />
          Login
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="py-12 md:py-24 space-y-12 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Takoradi Technical University
              <span className="text-primary block mt-2">
                Student Payment System
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A modern solution for managing student payments, tracking records, and providing insights for the Computer Science department.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={handleGetStarted} className="gap-2 group">
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Stylized mockup */}
          <div className="flex justify-center mt-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-primary/5 to-primary/30 rounded-xl overflow-hidden shadow-xl border border-primary/20 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-90">
                <div className="w-4/5 h-4/5 bg-white/80 dark:bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-muted flex flex-col">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        TTU
                      </div>
                      <span className="font-medium">Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-4 pt-4">
                    <div className="col-span-3 bg-background/70 rounded p-2 flex flex-col gap-4">
                      <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                      <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                      <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                      <div className="h-4 bg-muted-foreground/20 rounded w-3/5"></div>
                    </div>
                    <div className="col-span-9 grid grid-cols-2 gap-4">
                      <div className="bg-background/70 rounded p-3 flex flex-col gap-2">
                        <div className="h-4 bg-primary/20 rounded w-1/3"></div>
                        <div className="h-6 bg-primary/30 rounded w-2/3 mt-2"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mt-auto"></div>
                      </div>
                      <div className="bg-background/70 rounded p-3 flex flex-col gap-2">
                        <div className="h-4 bg-primary/20 rounded w-1/3"></div>
                        <div className="h-6 bg-primary/30 rounded w-2/3 mt-2"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mt-auto"></div>
                      </div>
                      <div className="col-span-2 bg-background/70 rounded p-3 h-32 flex flex-col gap-2">
                        <div className="h-4 bg-primary/20 rounded w-1/4"></div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-5/6 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <div className="w-3/4 h-4 bg-primary/20 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Key Features</h2>
              <p className="text-muted-foreground mt-2">
                Everything you need to manage student payments efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-6 shadow-sm border border-border hover-scale"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="px-4 sm:px-8 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Streamline payment tracking and student management for the Computer Science department
            </p>
            <Button size="lg" onClick={handleGetStarted} className="gap-2">
              Access System
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary rounded-md w-8 h-8 flex items-center justify-center font-bold">
              TTU
            </div>
            <span className="font-medium">PayTrack System</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Takoradi Technical University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
