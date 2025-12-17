import { useEffect, useState } from "react";
import api from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Edit() {
  const { id } = useParams(); // appointment id from URL
  const navigate = useNavigate();

  // Dropdown lists
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // Form state (date input needs YYYY-MM-DD)
  const [form, setForm] = useState({
    doctor_id: "",
    patient_id: "",
    appointment_date: "",
  });

  const [loading, setLoading] = useState(true);

  // Load appointment + dropdown options
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        // Load doctors + patients + appointment at the same time
        const [docRes, patRes, apptRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/patients"),
          api.get(`/appointments/${id}`),
        ]);

        setDoctors(docRes.data);
        setPatients(patRes.data);

        // API returns ISO date, date input needs YYYY-MM-DD
        const dateForInput = String(apptRes.data.appointment_date).split("T")[0];

        setForm({
          doctor_id: String(apptRes.data.doctor_id),
          patient_id: String(apptRes.data.patient_id),
          appointment_date: dateForInput,
        });
      } catch (err) {


        // If not logged in, go to login page
        if (err?.response?.status === 401) {
          navigate("/", {
            replace: true,
            state: { message: "Please login to edit appointments" },
          });
          return;
        }

        // Otherwise stay on this page and show a basic message
        alert("Could not load appointment. Check the console.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  // Update form state when user changes fields
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save updated appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // API expects ISO string
    const payload = {
      doctor_id: Number(form.doctor_id),
      patient_id: Number(form.patient_id),
      appointment_date: `${form.appointment_date}T00:00:00.000Z`,
    };

    try {
      // Use PATCH (matches your other pages)
      await api.patch(`/appointments/${id}`, payload);

      // Back to index with success message
      navigate("/appointments", {
        state: { message: "Appointment updated successfully" },
      });
    } catch (err) {


      if (err?.response?.status === 401) {
        navigate("/", {
          replace: true,
          state: { message: "Please login to edit appointments" },
        });
      } else {

      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Edit Appointment</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Doctor dropdown */}
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

        {/* Patient dropdown */}
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

        {/* Date input */}
        <Input
          type="date"
          name="appointment_date"
          value={form.appointment_date}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="outline">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
