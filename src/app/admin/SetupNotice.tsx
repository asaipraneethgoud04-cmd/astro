export default function SetupNotice({ table }: { table: string }) {
  return (
    <div className="mt-8 rounded-[22px] border border-[#e5d0ad] bg-white p-6 text-sm leading-relaxed text-[#3b171c]">
      <p className="font-semibold text-[#38070e]">The {table} table is not ready yet.</p>
      <p className="mt-2">
        Open the Supabase SQL editor and run <span className="font-medium">supabase/inbox.sql</span> once. Then refresh this page.
      </p>
    </div>
  );
}
