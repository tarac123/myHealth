import { useState } from "react";
import api from "@/config/api";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Create() {
  // Get the patientId from the URL
  const { patientId } = useParams();

  // redirect the user after diagnosis is created
  const navigate = useNavigate();

  // store the form input values
  const [form, setForm] = useState({
    condition: "",
    diagnosis_date: "", // Stored as YYYY-MM-DD from the date input
  });

  // dupdate form state when the user types
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing

    // Data sent to the API
    // patient_id as a number
    // diagnosis_date as a date string
    const payload = {
      patient_id: Number(patientId),
      condition: form.condition,
      diagnosis_date: form.diagnosis_date,
    };

    try {
      // Send the new diagnosis to the API
      await api.post("/diagnoses", payload);

      // Go back to the patients show page
      // and display a success message
      navigate(`/patients/${patientId}`, {
        state: { message: "Diagnosis created successfully" },
      });
    } catch (err) {
      // Log API errors
      console.log(err?.response?.data || err);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Add Diagnosis</h1>

      {/* Diagnosis form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Condition input */}
        <Input
          name="condition"
          placeholder="Condition"
          value={form.condition}
          onChange={handleChange}
          required
        />

        {/* normal date picker */}
        <Input
          type="date"
          name="diagnosis_date"
          value={form.diagnosis_date}
          onChange={handleChange}
          required
        />

        {/* submit */}
        <Button type="submit" variant="outline" className="mt-2">
          Save
        </Button>
      </form>
    </div>
  );
}
