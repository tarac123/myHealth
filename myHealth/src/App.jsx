import { AuthProvider } from "./hooks/useAuth";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import TopNavbar from "@/components/TopNavbar";

import Home from "@/pages/Home";
import ProtectedRoute from "@/pages/ProtectedRoute";

import DoctorsIndex from "@/pages/doctors/Index";
import DoctorsShow from "@/pages/doctors/Show";
import DoctorsCreate from "@/pages/doctors/Create";
import DoctorsEdit from "@/pages/doctors/Edit";

import PatientsIndex from "@/pages/patients/Index";
import PatientsShow from "@/pages/patients/Show";
import PatientsCreate from "@/pages/patients/Create";
import PatientsEdit from "@/pages/patients/Edit";

// add these when you make them:
// import AppointmentsIndex from "@/pages/appointments/Index";
// import PrescriptionsIndex from "@/pages/prescriptions/Index";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <TopNavbar />

          <main className="mx-auto max-w-6xl px-6 py-8">
            <Routes>
              {/* public */}
              <Route path="/" element={<Home />} />

              <Route path="/doctors" element={<DoctorsIndex />} />
              <Route path="/doctors/:id" element={<DoctorsShow />} />

              <Route path="/patients" element={<PatientsIndex />} />
              <Route path="/patients/:id" element={<PatientsShow />} />

              {/* <Route path="/appointments" element={<AppointmentsIndex />} />
              <Route path="/prescriptions" element={<PrescriptionsIndex />} /> */}

              {/* protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/doctors/create" element={<DoctorsCreate />} />
                <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />

                <Route path="/patients/create" element={<PatientsCreate />} />
                <Route path="/patients/:id/edit" element={<PatientsEdit />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
