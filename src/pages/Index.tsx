
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 font-semibold text-lg"
        >
          <span className="font-bold">TTU Payment System</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Admin Login
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 md:p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">TTU Payment Management System</h1>
          <p className="max-w-[600px] text-muted-foreground">
            Welcome to Takoradi Technical University's Payment Management System.
            Efficient payment tracking for students and staff.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link to="/login">Admin Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/verify-payment">Verify Your Payment</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Payment Verification</h3>
            <p className="text-muted-foreground mb-4">
              Students can verify their payment status by entering their index number
              and transaction code.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/verify-payment">Verify Payment</Link>
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Admin Portal</h3>
            <p className="text-muted-foreground mb-4">
              Staff and administrators can manage student information,
              record payments, and generate reports.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/login">Access Portal</Link>
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Payment Process</h3>
            <p className="text-muted-foreground mb-4">
              Learn about the payment process, including available payment methods and
              verification steps.
            </p>
            <Button variant="secondary" className="w-full">
              Learn More
            </Button>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Takoradi Technical University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
