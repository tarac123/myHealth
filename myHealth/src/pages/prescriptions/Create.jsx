import { useEffect, useState } from "react";
import api from "@/config/api";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Create() {
  const { patientId } = useParams(); // /patients/:patientId/prescriptions/create
  const navigate = useNavigate();

  // dropdowns
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);

  // Form values
  const [form, setForm] = useState({
    doctor_id: "",
    diagnosis_id: "",
    medication: "",
    dosage: "",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(true);

  // Load doctors +diagnoses for patient
  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      try {
        // Doctors from patients appointments
        const apptRes = await api.get(`/patients/${patientId}/appointments`);
        const doctorIds = [...new Set(apptRes.data.map((a) => a.doctor_id))];

        if (doctorIds.length) {
          const doctorsRes = await api.get("/doctors");
          setDoctorOptions(doctorsRes.data.filter((d) => doctorIds.includes(d.id)));
        } else {
          setDoctorOptions([]);
        }

        // Diagnoses for this patient, filter
        const diagRes = await api.get("/diagnoses");
        setDiagnosisOptions(
          diagRes.data.filter((d) => Number(d.patient_id) === Number(patientId))
        );
      } catch (err) {
        console.log(err?.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [patientId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // stop 0 / NaN from being sent
    if (!form.doctor_id || !form.diagnosis_id) {
      alert("Please select a doctor and a diagnosis.");
      return;
    }

    const payload = {
      patient_id: Number(patientId),          // be a real patient id
      doctor_id: Number(form.doctor_id),      // exist
      diagnosis_id: Number(form.diagnosis_id),// exist and match patient
      medication: form.medication,
      dosage: form.dosage,
      start_date: form.start_date,
      end_date: form.end_date,
    };

    try {
      await api.post("/prescriptions", payload);

      navigate(`/patients/${patientId}`, {
        state: { message: "Prescription created successfully" },
      });
    } catch (err) {
      // show the backend error
      console.log("STATUS:", err?.response?.status);
      console.log("DATA:", err?.response?.data);
      console.log("PAYLOAD SENT:", payload);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Add Prescription</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Doctor dropdown  */}
        <select
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select Doctor</option>
          {doctorOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.first_name} {d.last_name} (#{d.id})
            </option>
          ))}
        </select>

        {/* Diagnosis dropdown */}
        <select
          name="diagnosis_id"
          value={form.diagnosis_id}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select Diagnosis</option>
          {diagnosisOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.condition} (#{d.id})
            </option>
          ))}
        </select>

        <Input
          name="medication"
          placeholder="Medication"
          value={form.medication}
          onChange={handleChange}
          required
        />

        <Input
          name="dosage"
          placeholder="Dosage"
          value={form.dosage}
          onChange={handleChange}
          required
        />

        <Input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />

        <Input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="outline" className="mt-2">
          Save
        </Button>
      </form>
    </div>
  );
}
