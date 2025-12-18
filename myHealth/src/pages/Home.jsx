
import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-semibold mb-4">
        Health <span className="text-blue-600">Management</span>
      </h1>

      <p className="text-slate-600 text-lg mb-8">
        A simple health management system to manage doctors, patients,
        appointments, diagnoses and prescriptions.
      </p>

      {/* Login form */}
      <div className="max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
