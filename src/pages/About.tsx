
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function About() {
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
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Admin Login
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6 container max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">About This Project</h1>
            <p className="text-muted-foreground">
              Learn more about the TTU Payment Management System
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Project Overview</h2>
            <p>
              The TTU Payment Management System is a web-based application developed for the 
              Computer Science Department of Takoradi Technical University. This system aims to 
              track payments for textbooks, course outlines, and other materials, ensuring 
              transparency, accountability, and organized record-keeping.
            </p>
            <p>
              The system is designed to be scalable so that other departments can adopt it 
              in the future, creating a unified payment management solution for the entire university.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Role-based access control (Super Admin, Main Course Rep, Assistant Rep, Student)</li>
              <li>Secure payment tracking and verification</li>
              <li>Mobile Money and Cash payment processing</li>
              <li>Course and student management</li>
              <li>Detailed reporting and analytics</li>
              <li>Payment verification for students</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">User Roles</h2>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Super Admin</h3>
              <p>
                System administrators with full control over the system. They can reset passwords,
                restore settings, manage backups, and assign privileges to other users.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Main Course Rep</h3>
              <p>
                Manages payments and student records. They can record payments, generate unique
                payment codes, edit student details, and manage courses and learning materials.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Assistant Rep</h3>
              <p>
                Similar to the Main Course Rep but with limited privileges. They can record
                payments and generate payment codes but cannot modify or delete records.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Student</h3>
              <p>
                Can check payment status using their Index Number and payment code.
                Students cannot register themselves but can verify their payments.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Specializations</h2>
            <p>The system caters to the following Information Technology specializations:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>ITS</strong> - Information Technology Software</li>
              <li><strong>ITN</strong> - Information Technology Networking</li>
              <li><strong>ITD</strong> - Information Technology Data Management</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Future Enhancements</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email & SMS notifications for successful payments</li>
              <li>Enhanced graphical reports and charts</li>
              <li>Automated reminders for students with unpaid balances</li>
              <li>Multi-department expansion</li>
              <li>Mobile app version for easier access</li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Takoradi Technical University. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Developed by Manuel with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </div>
        </div>
      </footer>
    </div>
  );
}
