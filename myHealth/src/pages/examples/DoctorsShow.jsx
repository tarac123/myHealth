import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Show() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  let token = localStorage.getItem("token");

  const fetchDoctor = async () => {
    const options = {
      method: "GET",
      url: `https://ca2-med-api.vercel.app/doctors/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      setDoctor(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPrescriptions = async () => {
    const options = {
      method: "GET",
      url: `https://ca2-med-api.vercel.app/prescriptions`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);

      console.log(typeof response.data[0].doctor_id)
      console.log(typeof id)

      setPrescriptions(response.data.filter(prescription => prescription.doctor_id == id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppointments = async () => {
    const options = {
      method: "GET",
      url: `https://ca2-med-api.vercel.app/appointments`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      setAppointments(response.data.filter(appointment => appointment.doctor_id == id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDoctor();
      await fetchAppointments();
      await fetchPrescriptions();
    };
    fetchData();
  }, []);

  // We make this function asynchronous, because the tasks it performs might take some time
  const deleteDoctor = async () => {
    // User may try to run this function after a delete has happened, in which case we don't want to do anything
    if (!doctor) {
      return;
    }

    // Wrapping our API calls in a try/catch block means we can handle any errors that occur
    try {
      // In this first if block, we check if the doctor has any appointments or prescriptions
      // If so, we need to delete them first
      if (appointments.length > 0) {
        // Map will return our array of promises, which we can await

        // better than using forEach, because then we'd need to create an array beforehand and push to it
        const deleteAppointmentJobs = appointments.map((appointment) => {
          return axios.delete(
            `https://ca2-med-api.vercel.app/appointments/${appointment.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        });

        console.log(deleteAppointmentJobs);

        // WAIT for all the promises to resolve before continuing
        await Promise.all(deleteAppointmentJobs);
      }

      if (prescriptions.length > 0) {
        // Once again, we iterate over the array of prescriptions, adding each delete request to an array
        // We then wait for all of them to complete before continuing
        const deletePrescriptionJobs = prescriptions.map((prescription) => {
          return axios.delete(
            `https://ca2-med-api.vercel.app/prescriptions/${prescription.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        });

        await Promise.all(deletePrescriptionJobs);
      }

      // With our appointments and prescriptions deleted, we can now delete the doctor
      await axios.delete(`https://ca2-med-api.vercel.app/doctors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Doctor deleted");

      // Clear out all our state values
      setAppointments([]);
      setPrescriptions([]);
      setDoctor(null);
    } catch (e) {
      console.error(e);
    }
  };

  const unixToLocalDateString = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString(); // Format the date to a readable string
  }

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{doctor.first_name + " " + doctor.last_name}</CardTitle>
          <CardDescription>{doctor.specialisation}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Phone: {doctor.phone}</p>
          <p>Email: {doctor.email}</p>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            variant="primary"
            className="cursor-pointer text-red-500 hover:border-red-700 hover:text-red-700"
            onClick={deleteDoctor}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                {/* convert unix timestamp to local date string */}

                <span className="font-bold">Date: </span>{unixToLocalDateString(appointment.appointment_date)} - <span className="font-bold">Patient: </span>{appointment.patient_id} <span className="text-gray-400">// should get the patient name here</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          <ul>
            {prescriptions.map((prescription) => (
              <li key={prescription.id}>
                <span className="font-bold">Medication:</span> {prescription.medication} - <span className="font-bold">Dosage:</span> {prescription.dosage}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
