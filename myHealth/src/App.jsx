import { AuthProvider } from "./hooks/useAuth";

import { BrowserRouter as Router, Routes, Route } from "react-router";


import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import Navbar from "@/components/Navbar";
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


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }}
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            {/* <Navbar onLogin={onLogin} loggedIn={loggedIn} /> */}

            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-2 py-4 md:gap-2 md:py-6 mx-6">
                  {/* Main content */}
                  <Routes>
                    {/* PUBLIC */}
                    <Route path="/" element={<Home />} />

                    <Route path="/doctors" element={<DoctorsIndex />} />
                    <Route path="/doctors/:id" element={<DoctorsShow />} />

                    <Route path="/patients" element={<PatientsIndex />} />
                    <Route path="/patients/:id" element={<PatientsShow />} />

                    {/* PROTECTED */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/doctors/create" element={<DoctorsCreate />} />
                      <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />

                      <Route path="/patients/create" element={<PatientsCreate />} />
                      <Route path="/patients/:id/edit" element={<PatientsEdit />} />
                    </Route>

                  </Routes>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}
