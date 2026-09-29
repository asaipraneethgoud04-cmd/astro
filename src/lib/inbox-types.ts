export const appointmentStatuses = ["new", "contacted", "scheduled", "completed", "cancelled"] as const;
export type AppointmentStatus = (typeof appointmentStatuses)[number];

export const messageStatuses = ["new", "replied", "closed"] as const;
export type MessageStatus = (typeof messageStatuses)[number];

export type Appointment = {
  id: string;
  full_name: string;
  second_name: string | null;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string | null;
  status: AppointmentStatus;
  admin_note: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
};
