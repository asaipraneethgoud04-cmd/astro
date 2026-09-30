import React from "react";
import Link from "next/link";
import { Phone, Calendar, MessageSquare } from "lucide-react";

export default function CtaBannerSection({ last = false }: { last?: boolean }) {
  return (
    <section className={`${last ? "section-t page-bottom" : "section-y"} bg-[#fdfbf7] relative`}>
      <div className="site-container">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#220409] via-[#3a0812] to-[#220409] border border-[#c59b27]/40 py-12 px-6 sm:px-12 text-center text-white shadow-xl overflow-hidden">
          {/* Subtle starry / galaxy particles */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f6e27a_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-[#fdfaf4]">
              Begin Your Journey to Clarity
            </h2>

            {/* 3 Action Buttons strictly matching screenshot */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              {/* Button 1: Book Appointment */}
              <Link
                href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#fdfaf4] hover:bg-[#f6e27a] text-[#28040b] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Calendar className="w-4 h-4 text-[#28040b]" />
                Book Appointment
              </Link>

              {/* Button 2: Call Us Now */}
              <a
                href="tel:+12146699699"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#ebdcc2]/60 hover:border-white text-white hover:bg-white/10 font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300"
              >
                <Phone className="w-4 h-4 text-[#f6e27a]" />
                Call Us Now
              </a>

              {/* Button 3: WhatsApp */}
              <a
                href="https://wa.me/+12146699699"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
