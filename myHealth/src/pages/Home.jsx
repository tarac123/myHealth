// src/pages/Home.jsx
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-semibold mb-4">
        Health <span className="text-blue-600">Management</span>
      </h1>

      <p className="text-slate-600 text-lg">
        A simple health management system to manage doctors, patients,
        appointments, diagnoses and prescriptions.
      </p>
    </div>
  );
}
