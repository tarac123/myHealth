import { useEffect, useState } from "react";
import api from "@/config/api";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Create() {
  const navigate = useNavigate();

  // Lists for the dropdowns
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // appointment_date is YYYY-MM-DD from the date input
  const [form, setForm] = useState({
    doctor_id: "",
    patient_id: "",
    appointment_date: "",
  });

  // Load doctors and patients once so can pick  IDs 
  useEffect(() => {
    const load = async () => {
      try {
        const docRes = await api.get("/doctors");
        const patRes = await api.get("/patients");
        setDoctors(docRes.data);
        setPatients(patRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  // Update form state when changing a field
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit form to API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // API expects appointment_date as an ISO string 
    // Date input gives "YYYY-MM-DD" so adds a midnight time + Z 
    const payload = {
      doctor_id: Number(form.doctor_id), // API expects a number
      patient_id: Number(form.patient_id), // API expects a number
      appointment_date: `${form.appointment_date}T00:00:00.000Z`, // ISO string
    };

    try {
      await api.post("/appointments", payload);

      // Go back to appointments list with a message
      navigate("/appointments", {
        state: { message: "Appointment created successfully" },
      });
    } catch (err) {
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Create Appointment</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Pick a doctor */}
        <select
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.first_name} {d.last_name}
            </option>
          ))}
        </select>

        {/* Pick a patient */}
        <select
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>

        {/* Pick the appointment date */}
        <Input
          type="date"
          name="appointment_date"
          value={form.appointment_date}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="outline">
          Save
        </Button>
      </form>
    </div>
  );
}
