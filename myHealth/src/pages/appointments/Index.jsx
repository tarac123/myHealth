import { useEffect, useState } from "react";
import api from "@/config/api";
import { useNavigate } from "react-router";
import { formatUnixDate } from "@/utils/formatUnixDate";
import DeleteBtn from "@/components/DeleteBtn";
import { Button } from "@/components/ui/button";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

export default function Index() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  
useEffect(() => {
  const load = async () => {
    setLoading(true);

    try {
      // Get all 3 lists (appointments + doctors + patients)
      const appointmentsRes = await api.get("/appointments");
      const doctorsRes = await api.get("/doctors");
      const patientsRes = await api.get("/patients");


      // Save to state
      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      console.log(err);

    } finally {
      // stop loading 
      setLoading(false);
    }
  };

  load();
}, []);



  // find names from IDs
  const doctorName = (id) => {
    const d = doctors.find((x) => x.id === id);
    return d ? `${d.first_name} ${d.last_name}` : `Doctor #${id}`;
  };

  const patientName = (id) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.first_name} ${p.last_name}` : `Patient #${id}`;
  };

  const onDeleteSuccess = (deletedId) => {
    // remove it from the table without reloading the page
    setAppointments((prev) => prev.filter((a) => a.id !== deletedId));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">
          <span className="text-blue-600">Apointments</span>
        </h1>

        <Button variant="outline" onClick={() => navigate("/appointments/create")}>
          Create Appointment
        </Button>
      </div>

      <div className="bg-slate-100 rounded-2xl p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {appointments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{doctorName(a.doctor_id)}</TableCell>
                <TableCell>{patientName(a.patient_id)}</TableCell>

                <TableCell>{formatUnixDate(a.appointment_date)}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/appointments/${a.id}/edit`)}
                    >
                      Edit
                    </Button>

                    <DeleteBtn
                      resource="appointments"
                      id={a.id}
                      onDeleteCallback={() => onDeleteSuccess(a.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {!appointments.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
