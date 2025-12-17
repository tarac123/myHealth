import { useEffect, useRef, useState } from "react";
import api from "@/config/api";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Edit() {
  // Prescription id from the URL
  const { id } = useParams();

  // Used to go back to the patient show page after saving
  const navigate = useNavigate();

  // Store the patient_id so we know where to redirect after update
  const patientIdRef = useRef(null);

  // Store the form values
  const [form, setForm] = useState({
    medicaton: "",
    start_date: "", // YYYY-MM-DD for the date input
    end_date: "",
    dosage: ""
  });

  const [loading, setLoading] = useState(true);

  // Load the prescriptions data when the page opens
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/prescriptions/${id}`);

        // Save the patient_id for redirect later
        patientIdRef.current = res.data.patient_id;

        // Fill the form
        // diagnosis_date should already be a string date
        //  cut it to YYYY-MM-DD slice
        setForm({
          condition: res.data.condition || "",
          diagnosis_date: (res.data.diagnosis_date || "").slice(0, 10),
        });

        setLoading(false);
      } catch (err) {
        console.log(err?.response?.data || err);
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Update form state when the user types
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Run when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Data sent to the API
    // We only send the fields we are editing
    const payload = {
      medication: form.medication,
      start_date: form.start_date, // YYYY-MM-DD string
      end_date: form.end_date,
      dosage: form.dosage
    };

    try {
      // Update the diagnosis
      await api.patch(`/prescriptions/${id}`, payload);

      // Redirect back to the patient show page with a success message
      navigate(`/patients/${patientIdRef.current}`, {
        state: { message: "Prescriptions updated successfully" },
      });
    } catch (err) {
      console.log(err?.response?.data || err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Edit Prescription</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Condition input */}
        <Input
          name="medication"
          placeholder="Medication"
          value={form.medication}
          onChange={handleChange}
          required
        />

        {/* Date input (normal date picker) */}
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

          <Input
          type="text"
          name="dosage"
          value={form.dosage}
          onChange={handleChange}
          required
        />

        {/* Save button */}
        <Button type="submit" variant="outline" className="mt-2">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
