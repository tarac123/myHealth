import { useEffect, useState } from "react";
import api from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatUnixDate } from "@/utils/formatUnixDate";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Index() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  // Only fetch patients when logged in
  useEffect(() => {
    if (!token) {
      setPatients([]);
      return;
    }

    const fetchPatients = async () => {
      try {
        const res = await api.get("/patients");

        // sort alphabetically by last name
        const sorted = [...res.data].sort((a, b) =>
          (a.last_name || "").localeCompare(b.last_name || "", undefined, {
            sensitivity: "base",
          })
        );

        setPatients(sorted);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();
  }, [token]);

  const onDeleteCallback = (id) => {
    toast.success("Patient deleted successfully");
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };


  // If not logged in, don't show the list at all
  if (!token) {
    return <div>Please log in to view patients.</div>;
  }

  return (
    <>

          <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">
          <span className="text-blue-600">Patients</span>
        </h1>

        {token && (
          <Button asChild className="rounded-full px-6">
            <Link to="/patients/create">Create Patient</Link>
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.first_name}</TableCell>
              <TableCell>{patient.last_name}</TableCell>
              <TableCell>{formatUnixDate(patient.date_of_birth)}</TableCell>


              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phone}</TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <Eye />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/patients/${patient.id}/edit`)}
                  >
                    <Pencil />
                  </Button>

                  <DeleteBtn
                    onDeleteCallback={onDeleteCallback}
                    resource="patients"
                    id={patient.id}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}

          {!patients.length && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-slate-500">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
