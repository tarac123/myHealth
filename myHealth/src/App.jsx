import { AuthProvider } from "./hooks/useAuth";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import TopNavBar from "@/components/TopNavBar";

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

import DiagnosesCreate from "@/pages/diagnoses/Create";
import DiagnosesEdit from "@/pages/diagnoses/Edit";

import PrescriptionsCreate from "@/pages/prescriptions/Create";
import PrescriptionsEdit from "@/pages/prescriptions/Edit";

import AppointmentsIndex from "@/pages/appointments/Index";
import AppointmentsEdit from "@/pages/appointments/Edit";
import AppointmentsCreate from "@/pages/appointments/Create";


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <TopNavBar />

          <main className="mx-auto max-w-6xl px-6 py-8">
            <Routes>
              {/* public */}
              <Route path="/" element={<Home />} />

              <Route path="/doctors" element={<DoctorsIndex />} />
              <Route path="/doctors/:id" element={<DoctorsShow />} />

              <Route path="/patients" element={<PatientsIndex />} />
              <Route path="/patients/:id" element={<PatientsShow />} />


              {/* protected */}
              <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/doctors/:id" element={<DoctorsShow />} />
                <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />
                <Route path="/doctors/create" element={<DoctorsCreate />} />
                <Route path="/patients/:patientId/diagnoses/create" element={<DiagnosesCreate />}/>
                <Route path="/diagnoses/:id/edit" element={<DiagnosesEdit />} />
                <Route path="/patients/:patientId/prescriptions/create" element={<PrescriptionsCreate />}/>
                <Route path="/prescriptions/:id/edit" element={<PrescriptionsEdit />} />
                <Route path="/appointments" element={<AppointmentsIndex />} />
                <Route path="/appointments/:id/edit" element={<AppointmentsEdit />} />
                <Route path="/appointments/create" element={<AppointmentsCreate />} />
              </Route>

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
