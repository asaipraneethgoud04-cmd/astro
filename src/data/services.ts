export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  iconName: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "horoscope-reading",
    title: "Horoscope Reading",
    description:
      "Personalized interpretation of birth chart, planetary alignments, and wider astrological blueprint for life guidance.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/Horoscope.png",
    iconName: "chart",
  },
  {
    id: "divorce-problem-solution",
    title: "Divorce problem solution",
    description:
      "Confidential Vedic consultation and astrological perspective to navigate marital conflicts, legal separation, and emotional reconciliation.",
    category: "Love & Marriage",
    imageUrl: "/images/services/Divorce.png",
    iconName: "separation",
  },
  {
    id: "evil-spirits-removal",
    title: "Evil Spirits Removal",
    description:
      "Sacred Vedic rituals, protective kavach, and energetic cleansing to dissolve negative entities, psychic disturbances, and heavy auras.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Evil.png",
    iconName: "energy",
  },
  {
    id: "fortune-teller",
    title: "Fortune Teller",
    description:
      "Traditional Jyotish forecasting of upcoming planetary transits, auspicious windows, and significant life milestones.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/Fortune teller.png",
    iconName: "future",
  },
  {
    id: "psychic-reading",
    title: "Psychic Reading",
    description:
      "Intuitive celestial readings and higher spiritual discernment to illuminate uncertain crossroads and unrevealed truths.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Psychic.png",
    iconName: "psychic",
  },
  {
    id: "vashikaran-specialist",
    title: "Vashikaran Specialist",
    description:
      "Authentic, pure sattvic positive energy alignment and relationship harmonization to soften bitter conflicts and restore love.",
    category: "Love & Marriage",
    imageUrl: "/images/services/Vashikaran.png",
    iconName: "heart",
  },
  {
    id: "tarot-reading",
    title: "Tarot Reading",
    description:
      "Intuitive card spread consultations revealing hidden patterns, crossroads, and immediate clarity for love, finance, and career.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/Tarot Reading.png",
    iconName: "numerology",
  },
  {
    id: "curse-removal",
    title: "Curse Removal",
    description:
      "Traditional shastric remedies and planetary Shanti to clear generational doshas, evil eye (drishti), and recurring karmic blockages.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Curse removal.png",
    iconName: "dosha",
  },
  {
    id: "business-problem-solution",
    title: "Business Problem Solution",
    description:
      "Strategic Vedic business counsel, partnership compatibility, launch Muhurat, and remedies for commercial turnaround.",
    category: "Career & Business",
    imageUrl: "/images/services/Business.png",
    iconName: "finance",
  },
  {
    id: "education-employment",
    title: "Education & Employment",
    description:
      "Vedic career guidance, academic direction, competitive examination timing, and solutions for job stability and promotions.",
    category: "Career & Business",
    imageUrl: "/images/services/Education.png",
    iconName: "briefcase",
  },
  {
    id: "financial-problem-solution",
    title: "Financial Problem Solution",
    description:
      "Ancient Dhana Yoga activations and Lakshmi stotrams to overcome debt traps, cash flow blockages, and financial instability.",
    category: "Career & Business",
    imageUrl: "/images/services/Financial.png",
    iconName: "finance",
  },
  {
    id: "health-problem-solution",
    title: "Health Problem Solution",
    description:
      "Vedic astrological analysis of physical vitality, 6th house roga indications, and sacred Maha Mrityunjaya healing remedies.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Health.png",
    iconName: "family",
  },
  {
    id: "spiritual-reading",
    title: "Spiritual Reading",
    description:
      "Sacred Vedic spiritual reflection, puja guidance, and higher soul consciousness practices to cultivate inner serenity.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Spiritual reading.png",
    iconName: "puja",
  },
  {
    id: "kundali-matching",
    title: "Kundali matching",
    description:
      "Comprehensive Ashta Kuta, Navamsha, and Mangal Dosha synastry to assess lifelong harmony and marital prosperity.",
    category: "Love & Marriage",
    imageUrl: "/images/services/Kundali.png",
    iconName: "marriage",
  },
  {
    id: "palm-reading",
    title: "Palm Reading",
    description:
      "Classical Hastarekha palmistry analysis decoding major life lines, mount energies, and divine markings.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/Palm Reading.png",
    iconName: "palm",
  },
  {
    id: "love-marriage-specialist",
    title: "Love Marriage Specialist",
    description:
      "Empathetic astrological guidance to bridge parental hesitations, family opposition, and cultural differences for love marriages.",
    category: "Love & Marriage",
    imageUrl: "/images/services/love-marriage.png",
    iconName: "couple",
  },
];

export const navbarServicesColumns = {
  column1: [
    { id: "horoscope-reading", title: "Horoscope Reading", icon: "chart" },
    { id: "divorce-problem-solution", title: "Divorce problem solution", icon: "separation" },
    { id: "evil-spirits-removal", title: "Evil Spirits Removal", icon: "energy" },
    { id: "fortune-teller", title: "Fortune Teller", icon: "future" },
    { id: "psychic-reading", title: "Psychic Reading", icon: "psychic" },
    { id: "vashikaran-specialist", title: "Vashikaran Specialist", icon: "heart" },
  ],
  column2: [
    { id: "tarot-reading", title: "Tarot Reading", icon: "numerology" },
    { id: "curse-removal", title: "Curse Removal", icon: "dosha" },
    { id: "business-problem-solution", title: "Business Problem Solution", icon: "finance" },
    { id: "education-employment", title: "Education & Employment", icon: "briefcase" },
    { id: "financial-problem-solution", title: "Financial Problem Solution", icon: "finance" },
  ],
  column3: [
    { id: "health-problem-solution", title: "Health Problem Solution", icon: "family" },
    { id: "spiritual-reading", title: "Spiritual Reading", icon: "puja" },
    { id: "kundali-matching", title: "Kundali matching", icon: "marriage" },
    { id: "palm-reading", title: "Palm Reading", icon: "palm" },
    { id: "love-marriage-specialist", title: "Love Marriage Specialist", icon: "couple" },
  ],
};

export const serviceCategories = [
  "All",
  "Love & Marriage",
  "Career & Business",
  "Astrology & Charts",
  "Spiritual & Wellness",
];
