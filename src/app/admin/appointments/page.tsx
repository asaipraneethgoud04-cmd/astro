import { getAppointments } from "@/lib/inbox";
import { requireAdmin } from "../session";
import SetupNotice from "../SetupNotice";
import AppointmentsBoard from "./AppointmentsBoard";

export default async function AdminAppointmentsPage() {
  await requireAdmin();
  const { appointments, error } = await getAppointments();

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#aa8016]">Book Appointment form</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#38070e] sm:text-4xl">Appointment Requests</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#614b4f]">
          Every request sent from the Book Appointment page. Move each one along as you contact the client and fix a time.
        </p>
      </header>

      {error ? <SetupNotice table="appointments" /> : <AppointmentsBoard appointments={appointments} />}
    </div>
  );
}
