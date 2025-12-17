import { useEffect, useState } from "react";
import axios from "@/config/api";
import DoctorCard from "@/components/DoctorCard";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";


export default function Index() {
  const [doctors, setDoctors] = useState([]);
  const { token } = useAuth();

  const location = useLocation();
  const nav = useNavigate();

  // Show success/error message from delete/create/edit
  useEffect(() => {
    const msg = location.state?.message;
    if (msg) {
      alert(msg);
      nav("/doctors", { replace: true, state: null }); // clear message so it doesn't repeat
    }
  }, [location.state]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">
          Our <span className="text-blue-600">Doctors</span>
        </h1>

        {token && (
          <Button asChild className="rounded-full px-6">
            <Link to="/doctors/create">Create Doctor</Link>
          </Button>
        )}
      </div>

      <div className="flex justify-center">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </>
  );
}
