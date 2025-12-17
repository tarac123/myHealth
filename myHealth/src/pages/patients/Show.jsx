import { useEffect, useRef, useState } from "react";
import api from "@/config/api";
import { useNavigate, useParams, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import DeleteBtn from "@/components/DeleteBtn";
import { formatUnixDate } from "@/utils/formatUnixDate";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, CalendarDays } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Show() {
  // Patient id from the URL ( /patients/:id )
  const { id } = useParams();

  // Used to move between pages
  const navigate = useNavigate();

  // Used to read success messages when returning from create/edit pages
  const location = useLocation();

  // Token = logged in (this page is protected anyway, but this is extra safety)
  const { token } = useAuth();

  // Page data
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Prevent the success alert showing twice in dev (StrictMode)
  const shownRef = useRef(false);

  // If not logged in, go back to login page
  useEffect(() => {
    if (!token) navigate("/", { replace: true });
  }, [token, navigate]);

  // Show a success message (e.g. after edit/create) once
  useEffect(() => {
    const msg = location.state?.message;
    if (msg && !shownRef.current) {
      shownRef.current = true;
      alert(msg);

      // Clear message so it won't show again on refresh/back
      navigate(`/patients/${id}`, { replace: true, state: null });
    }
  }, [location.state, id, navigate]);

  // Load all data for this page
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        // 1) Get the patient details
        const patientRes = await api.get(`/patients/${id}`);
        setPatient(patientRes.data);

        // 2) Get appointments for this patient, then find doctor ids
        const apptRes = await api.get(`/patients/${id}/appointments`);
        const doctorIds = [...new Set(apptRes.data.map((a) => a.doctor_id))];

        // 3) If we have doctor ids, load doctors and filter to just those
        if (doctorIds.length) {
          const doctorsRes = await api.get("/doctors");
          setDoctors(doctorsRes.data.filter((d) => doctorIds.includes(d.id)));
        } else {
          setDoctors([]);
        }

        // 4) Diagnoses: API returns ALL diagnoses, so filter by patient_id here
        const diagRes = await api.get("/diagnoses");
        setDiagnoses(diagRes.data.filter((d) => String(d.patient_id) === String(id)));

        // 5) Prescriptions: API returns ALL prescriptions, so filter by patient_id here
        const presRes = await api.get("/prescriptions");
        setPrescriptions(
          presRes.data.filter((p) => Number(p.patient_id) === Number(id))
        );

      setPrescriptions(filteredPres);

            } catch (err) {
              console.log(err);
            } finally {
              setLoading(false);
            }
          };

    load();
  }, [id]);

  // loading and error
  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found.</div>;

  return (
    <div className="max-w-5xl">
      {/* Page title */}
      <div className="mb-6">
        <p className="text-blue-600 text-3xl font-medium">Patient</p>
        <h1 className="text-4xl font-semibold">
          {patient.first_name} {patient.last_name}
        </h1>
      </div>

      {/* Patient info */}
      <Card className="max-w-xl border-2 border-blue-500 rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <span className="text-sm">{formatUnixDate(patient.date_of_birth)}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="text-sm">{patient.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <span className="text-sm">{patient.phone}</span>
          </div>

          {/* Patient CRUD actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => navigate(`/patients/${id}/edit`)}>
              Edit
            </Button>

            <DeleteBtn
              resource="patients"
              id={id}
              onDeleteCallback={() =>
                navigate("/patients", { state: { message: "Patient deleted successfully" } })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctors table */}
      <div className="mt-10">
        <h2 className="text-blue-600 text-2xl font-medium mb-4">Doctors</h2>

        <div className="bg-slate-100 rounded-2xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Specialisation</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {doctors.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.first_name}</TableCell>
                  <TableCell>{d.last_name}</TableCell>
                  <TableCell>{d.specialisation}</TableCell>
                  <TableCell>{d.email}</TableCell>
                </TableRow>
              ))}

              {!doctors.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                    No doctors found for this patient.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* diagnoses table + CRUD */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-blue-600 text-2xl font-medium">Diagnoses</h2>

          <Button variant="outline" onClick={() => navigate(`/patients/${id}/diagnoses/create`)}>
            Add Diagnosis
          </Button>
        </div>

        <div className="bg-slate-100 rounded-2xl p-4">
          <Table>
<TableHeader>
  <TableRow>
    <TableHead>ID</TableHead>   {/* temporary */}
    <TableHead>Condition</TableHead>
    <TableHead>Date Diagnosed</TableHead>
    <TableHead></TableHead>
  </TableRow>
</TableHeader>

            <TableBody>
{diagnoses.map((d) => (
  <TableRow key={d.id}>
    {/* TEMP: show diagnosis ID for debugging */}
    <TableCell className="text-xs text-slate-500">
      #{d.id}
    </TableCell>

    <TableCell>{d.condition}</TableCell>
    <TableCell>{formatUnixDate(d.diagnosis_date)}</TableCell>

    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/diagnoses/${d.id}/edit`)}
        >
          Edit
        </Button>

        <DeleteBtn
          resource="diagnoses"
          id={d.id}
          onDeleteCallback={() =>
            setDiagnoses((prev) => prev.filter((x) => x.id !== d.id))
          }
        />
      </div>
    </TableCell>
  </TableRow>
))}

              {!diagnoses.length && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm text-slate-500">
                    No diagnoses found for this patient.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* srescriptions table + CRUD */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-blue-600 text-2xl font-medium">Prescriptions</h2>

          <Button variant="outline" onClick={() => navigate(`/patients/${id}/prescriptions/create`)}>
            Add Prescription
          </Button>
        </div>

        <div className="bg-slate-100 rounded-2xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {prescriptions.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.medication}</TableCell>
                  <TableCell>{p.dosage}</TableCell>
                  <TableCell>{formatUnixDate(p.start_date)}</TableCell>
                  <TableCell>{formatUnixDate(p.end_date)}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/prescriptions/${p.id}/edit`)}
                      >
                        Edit
                      </Button>

                      <DeleteBtn
                        resource="prescriptions"
                        id={p.id}
                        onDeleteCallback={() =>
                          setPrescriptions((prev) => prev.filter((x) => x.id !== p.id))
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!prescriptions.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-slate-500">
                    No prescriptions found for this patient.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
