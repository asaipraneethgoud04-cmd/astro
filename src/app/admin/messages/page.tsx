import { getContactMessages } from "@/lib/inbox";
import { requireAdmin } from "../session";
import SetupNotice from "../SetupNotice";
import MessagesBoard from "./MessagesBoard";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const { messages, error } = await getContactMessages();

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#aa8016]">support@TalkAstrologer</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#38070e] sm:text-4xl">Support & Contact Enquiries</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#614b4f]">
          Direct enquiries submitted from the Contact Us page and support desk. Notifications are routed to support@TalkAstrologer and admin mail. Reply directly by email or update enquiry status.
        </p>
      </header>

      {error ? <SetupNotice table="contact_messages" /> : <MessagesBoard messages={messages} />}
    </div>
  );
}
