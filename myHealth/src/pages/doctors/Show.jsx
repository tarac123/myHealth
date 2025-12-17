import { useEffect, useRef, useState } from "react";
import api from "@/config/api";
import { useNavigate, useParams, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import DeleteBtn from "@/components/DeleteBtn";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Stethoscope } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Show() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const shownRef = useRef(false);


  // Show success message after edit
  useEffect(() => {
    const msg = location.state?.message;
    if (msg && !shownRef.current) {
      shownRef.current = true;
      alert(msg);
      navigate(`/doctors/${id}`, { replace: true, state: null });
    }
  }, [location.state, id, navigate]);

  // Load doctor + patients
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // doctor
        const docRes = await api.get(`/doctors/${id}`);
        setDoctor(docRes.data);

        // patients via appointments
        const apptRes = await api.get(`/appointments?doctor_id=${id}`);
        const patientIds = [...new Set(apptRes.data.map(a => a.patient_id))];

        if (patientIds.length) {
          const patientsRes = await api.get("/patients");
          setPatients(
            patientsRes.data.filter(p => patientIds.includes(p.id))
          );
        } else {
          setPatients([]);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        navigate("/", { replace: true });
      }
    };

    load();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!doctor) return null;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-blue-600 text-3xl font-medium">Doctor</p>
        <h1 className="text-4xl font-semibold">
          {doctor.first_name} {doctor.last_name}
        </h1>
      </div>

      <Card className="max-w-xl border-2 border-blue-500 rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <span className="text-sm">{doctor.specialisation}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="text-sm">{doctor.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <span className="text-sm">{doctor.phone}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/doctors/${id}/edit`)}
            >
              Edit
            </Button>

            <DeleteBtn
              resource="doctors"
              id={id}
              onDeleteCallback={() =>
                navigate("/doctors", {
                  state: { message: "Doctor deleted successfully" },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-blue-600 text-2xl font-medium mb-4">Patients</h2>

        <div className="bg-slate-100 rounded-2xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.first_name}</TableCell>
                  <TableCell>{p.last_name}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.email}</TableCell>
                </TableRow>
              ))}

              {!patients.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                    No patients found for this doctor.
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
