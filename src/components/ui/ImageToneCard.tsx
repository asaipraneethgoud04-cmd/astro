"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Heart,
  HeartHandshake,
  Briefcase,
  House,
  TrendingUp,
  Compass,
  Users,
  BookOpen,
  Shield,
  Building,
  Hash,
  Hand,
  ScanFace,
  Eye,
  Flame,
  Globe,
  Clapperboard,
  Scale,
} from "lucide-react";

export type ImageTone = {
  bg: string;
  accent: string;
};

const FALLBACK_TONE: ImageTone = { bg: "#241c1a", accent: "#3a302c" };

const toneCache = new Map<string, ImageTone>();

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: h / 6, s, l };
}

function hueToRgb(p: number, q: number, t: number) {
  let channel = t;
  if (channel < 0) channel += 1;
  if (channel > 1) channel -= 1;
  if (channel < 1 / 6) return p + (q - p) * 6 * channel;
  if (channel < 1 / 2) return q;
  if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
  return p;
}

function hslToHex(h: number, s: number, l: number) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hueToRgb(p, q, h) * 255);
  const b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function toneFromRgb(r: number, g: number, b: number): ImageTone {
  const { h, s, l } = rgbToHsl(r, g, b);
  const muted = clamp(s * 0.5, 0.08, 0.4);
  const bgL = clamp(l * 0.42, 0.12, 0.22);
  const accentL = clamp(bgL + 0.1, 0.2, 0.34);
  return {
    bg: hslToHex(h, muted, bgL),
    accent: hslToHex(h, clamp(muted + 0.06, 0.1, 0.46), accentL),
  };
}

function extractDominantTone(src: string): Promise<ImageTone> {
  const cached = toneCache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 32;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        toneCache.set(src, FALLBACK_TONE);
        resolve(FALLBACK_TONE);
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      try {
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0;
        let g = 0;
        let b = 0;
        let weight = 0;
        for (let i = 0; i < data.length; i += 4) {
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const alpha = data[i + 3];
          if (alpha < 200) continue;
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          const lum = (pr + pg + pb) / 3;
          if (lum < 16 || lum > 246) continue;
          const sat = max === 0 ? 0 : (max - min) / max;
          const sampleWeight = 1 + sat * 3;
          r += pr * sampleWeight;
          g += pg * sampleWeight;
          b += pb * sampleWeight;
          weight += sampleWeight;
        }
        const tone =
          weight === 0 ? FALLBACK_TONE : toneFromRgb(r / weight, g / weight, b / weight);
        toneCache.set(src, tone);
        resolve(tone);
      } catch {
        toneCache.set(src, FALLBACK_TONE);
        resolve(FALLBACK_TONE);
      }
    };
    img.onerror = () => {
      toneCache.set(src, FALLBACK_TONE);
      resolve(FALLBACK_TONE);
    };
    img.src = src;
  });
}

function useImageTone(src: string, isVisible: boolean) {
  const [tone, setTone] = useState<ImageTone>(() => toneCache.get(src) ?? FALLBACK_TONE);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    const cached = toneCache.get(src);
    if (cached) {
      setTone(cached);
      return;
    }
    extractDominantTone(src).then((next) => {
      if (!cancelled) setTone(next);
    });
    return () => {
      cancelled = true;
    };
  }, [src, isVisible]);

  return tone;
}

function FallbackMark({ iconName }: { iconName?: string }) {
  const className = "w-8 h-8 text-white/90";
  switch (iconName) {
    case "heart":
      return <Heart className={className} />;
    case "marriage":
      return <HeartHandshake className={className} />;
    case "briefcase":
      return <Briefcase className={className} />;
    case "family":
      return <House className={className} />;
    case "finance":
      return <TrendingUp className={className} />;
    case "future":
      return <Compass className={className} />;
    case "chart":
      return <BookOpen className={className} />;
    case "dosha":
      return <Shield className={className} />;
    case "vastu":
      return <Building className={className} />;
    case "numerology":
      return <Hash className={className} />;
    case "palm":
      return <Hand className={className} />;
    case "face":
      return <ScanFace className={className} />;
    case "psychic":
      return <Eye className={className} />;
    case "puja":
      return <Flame className={className} />;
    case "energy":
      return <Sparkles className={className} />;
    case "abroad":
      return <Globe className={className} />;
    case "film":
      return <Clapperboard className={className} />;
    case "separation":
      return <Scale className={className} />;
    default:
      return <Users className={className} />;
  }
}

type ImageToneCardProps = {
  id?: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  meta?: string;
  href: string;
  ctaLabel: string;
  iconName?: string;
  className?: string;
};

export default function ImageToneCard({
  id,
  imageUrl,
  imageAlt,
  title,
  description,
  meta,
  href,
  ctaLabel,
  iconName,
  className = "",
}: ImageToneCardProps) {
  const articleRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible || !articleRef.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(articleRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  const tone = useImageTone(imageUrl, isVisible);
  const [imageError, setImageError] = useState(false);

  return (
    <article
      ref={articleRef}
      id={id}
      className={`group relative flex h-full min-w-0 aspect-[3/4] flex-col overflow-hidden rounded-[18px] shadow-[0_16px_36px_rgba(24,14,16,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(24,14,16,0.26)] sm:aspect-auto sm:min-h-[440px] sm:rounded-[26px] lg:min-h-[480px] ${className}`}
      style={
        {
          backgroundColor: tone.bg,
          "--card-bg": tone.bg,
          "--card-accent": tone.accent,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
            className="object-cover object-[center_30%] transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#241c1a]">
            <FallbackMark iconName={iconName} />
          </div>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 42%, ${tone.accent} 74%, ${tone.bg} 90%)`,
        }}
      />

      <div className="relative z-10 mt-auto flex min-w-0 flex-col px-2.5 pb-2.5 pt-20 sm:px-5 sm:pb-5 sm:pt-28">
        <div className="flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <h3 className="line-clamp-3 break-words font-serif text-[16px] font-bold leading-tight text-white sm:text-[1.55rem] sm:leading-snug">
            {title}
          </h3>
          {meta ? (
            <span className="max-w-full truncate rounded-full bg-black/35 px-2 py-0.5 text-[9px] font-medium text-white sm:mt-0.5 sm:shrink-0 sm:px-2.5 sm:py-1 sm:text-[11px]">
              {meta}
            </span>
          ) : null}
        </div>

        <p className="mt-2 hidden text-sm leading-relaxed text-white/75 sm:line-clamp-none sm:block">
          {description}
        </p>

        <Link
          href={href}
          className="mt-2.5 inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-full bg-white px-2 py-1.5 text-[10px] font-semibold leading-none text-[#1a1210] shadow-[0_8px_18px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f6f1e8] hover:shadow-[0_12px_22px_rgba(0,0,0,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-5 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm [&_svg]:h-3 [&_svg]:w-3 sm:[&_svg]:h-4 sm:[&_svg]:w-4"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
