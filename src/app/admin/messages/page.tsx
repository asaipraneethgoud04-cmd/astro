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
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#aa8016]">Contact page form</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#38070e] sm:text-4xl">Contact Messages</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#614b4f]">
          Questions sent from the Contact page. Reply by email, then mark the message as replied or closed.
        </p>
      </header>

      {error ? <SetupNotice table="contact_messages" /> : <MessagesBoard messages={messages} />}
    </div>
  );
}
