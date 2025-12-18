import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function DoctorCard({ doctor }) {
  //  use a placeholder that varies by id
  const img = `https://i.pravatar.cc/200?img=${(doctor.id % 70) + 1}`;

  return (
    <Card className="w-full max-w-[260px] rounded-2xl shadow-sm hover:shadow-md transition">
      <CardContent className="pt-8 pb-6 flex flex-col items-center text-center gap-3">
        <div className="h-28 w-28 rounded-full bg-slate-100 overflow-hidden">
          <img
            src={img}
            alt={`${doctor.first_name} ${doctor.last_name}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-1">
          <p className="text-sm font-medium">
            Dr. {doctor.first_name} {doctor.last_name}
          </p>
          <p className="text-xs text-blue-600">{doctor.specialisation}</p>
        </div>

        <Button asChild className="mt-2 rounded-full px-8">
          <Link to={`/doctors/${doctor.id}`}>Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
