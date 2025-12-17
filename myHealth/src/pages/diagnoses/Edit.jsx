import { useEffect, useRef, useState } from "react";
import api from "@/config/api";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Edit() {
  // Diagnosis id from the URL
  // Example: /diagnoses/12/edit -> id = 12
  const { id } = useParams();

  // Used to go back to the patient show page after saving
  const navigate = useNavigate();

  // Store the patient_id so we know where to redirect after update
  const patientIdRef = useRef(null);

  // Store the form values
  const [form, setForm] = useState({
    condition: "",
    diagnosis_date: "", // YYYY-MM-DD for the date input
  });

  const [loading, setLoading] = useState(true);

  // Load the diagnosis data when the page opens
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/diagnoses/${id}`);

        // Save the patient_id for redirect later
        patientIdRef.current = res.data.patient_id;

        // Fill the form
        // diagnosis_date should already be a string date.
        // If it includes time (like 2025-01-15T00:00:00Z), we cut it to YYYY-MM-DD
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
      condition: form.condition,
      diagnosis_date: form.diagnosis_date, // YYYY-MM-DD string
    };

    try {
      // Update the diagnosis
      await api.patch(`/diagnoses/${id}`, payload);

      // Redirect back to the patient show page with a success message
      navigate(`/patients/${patientIdRef.current}`, {
        state: { message: "Diagnosis updated successfully" },
      });
    } catch (err) {
      console.log(err?.response?.data || err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Edit Diagnosis</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Condition input */}
        <Input
          name="condition"
          placeholder="Condition"
          value={form.condition}
          onChange={handleChange}
          required
        />

        {/* Date input (normal date picker) */}
        <Input
          type="date"
          name="diagnosis_date"
          value={form.diagnosis_date}
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
