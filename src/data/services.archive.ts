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
    id: "love-relationship-guidance",
    title: "Love & Relationship Guidance",
    description:
      "Support for questions involving love, relationships, emotional uncertainty and important personal decisions.",
    category: "Love & Marriage",
    imageUrl: "/images/services/love and relationship guidence.png",
    iconName: "heart",
  },
  {
    id: "marriage-compatibility",
    title: "Marriage & Compatibility",
    description:
      "Traditional astrological perspectives on compatibility, marriage-related questions and family considerations.",
    category: "Love & Marriage",
    imageUrl: "/images/services/marriage and compatability.png",
    iconName: "marriage",
  },
  {
    id: "love-marriage-family",
    title: "Love Marriage & Family Concerns",
    description:
      "Guidance for people navigating love marriage decisions, family expectations and relationship concerns.",
    category: "Love & Marriage",
    imageUrl: "/images/services/love marriage & family concerns.png",
    iconName: "couple",
  },
  {
    id: "separation-divorce",
    title: "Separation & Divorce-related Concerns",
    description:
      "A confidential space to reflect on difficult relationship periods and seek an astrological perspective.",
    category: "Love & Marriage",
    imageUrl: "/images/services/divorce.png",
    iconName: "separation",
  },
  {
    id: "career-education-job",
    title: "Career, Education & Job Guidance",
    description:
      "Astrological perspective for career choices, professional changes, educational decisions and important transitions.",
    category: "Career & Business",
    imageUrl: "/images/services/career.png",
    iconName: "briefcase",
  },
  {
    id: "business-financial",
    title: "Business & Financial Matters",
    description:
      "Traditional astrological perspective for business decisions, financial concerns and periods requiring careful planning.",
    category: "Career & Business",
    imageUrl: "/images/services/Business & Financial Matters.png",
    iconName: "finance",
  },
  {
    id: "family-parents-children",
    title: "Family, Parents & Children",
    description:
      "Supportive consultation for family relationships, parenting concerns and challenges involving parents and children.",
    category: "Family & Personal",
    imageUrl: "/images/services/Family, Parents & Children.png",
    iconName: "family",
  },
  {
    id: "future-guidance",
    title: "Future-oriented Guidance",
    description:
      "Traditional interpretation of possible periods, tendencies and themes reflected in the horoscope.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/future -orientiend.png",
    iconName: "future",
  },
  {
    id: "horoscope-kundli",
    title: "Horoscope & Kundli Reading",
    description:
      "Personalized interpretation of birth information and the wider chart rather than relying on one isolated factor.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/horoscope& kundli reading.png",
    iconName: "chart",
  },
  {
    id: "dosha-guidance",
    title: "Dosha Guidance",
    description:
      "Context-based interpretation of relevant Doshas and other chart factors, with traditional remedies discussed where appropriate.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/Dosha Guidance.png",
    iconName: "dosha",
  },
  {
    id: "vastu-shastra",
    title: "Vastu Shastra",
    description:
      "Traditional Vastu-based guidance concerning homes, workplaces and living environments.",
    category: "Family & Personal",
    imageUrl: "/images/services/Vastu Shastra.png",
    iconName: "vastu",
  },
  {
    id: "numerology",
    title: "Numerology",
    description:
      "Traditional numerological interpretation offered as an additional perspective.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/numerology.png",
    iconName: "numerology",
  },
  {
    id: "palm-reading",
    title: "Palm Reading",
    description: "Traditional palmistry-based reflection and guidance.",
    category: "Astrology & Charts",
    imageUrl: "/images/services/palm reading.png",
    iconName: "palm",
  },
  {
    id: "face-aura-reading",
    title: "Face & Aura Reading",
    description:
      "Traditional interpretive practices approached respectfully and without presenting them as scientific diagnosis.",
    category: "Astrology & Charts",
    imageUrl:
      "/images/services/Face & Aura Reading.png",
    iconName: "face",
  },
  {
    id: "psychic-intuitive",
    title: "Psychic / Intuitive Guidance",
    description:
      "Reflective intuitive guidance for people seeking another perspective during uncertain times.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Psychic  Intuitive Guidance.png",
    iconName: "psychic",
  },
  {
    id: "puja-spiritual",
    title: "Puja & Spiritual Guidance",
    description:
      "Traditional spiritual and puja-related guidance intended to support prayer, reflection and connection with one's spiritual beliefs.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Puja & Spiritual Guidance.png",
    iconName: "puja",
  },
  {
    id: "negative-energy",
    title: "Negative-energy / Spiritual Concerns",
    description:
      "Compassionate discussion of spiritual concerns, with traditional practices or remedies considered according to individual beliefs.",
    category: "Spiritual & Wellness",
    imageUrl: "/images/services/Negative-energy  Spiritual Concerns.png",
    iconName: "energy",
  },
  {
    id: "inter-caste-marriage",
    title: "Inter-caste Marriage Concerns",
    description:
      "Guidance for relationship and family situations involving different cultural or social backgrounds.",
    category: "Love & Marriage",
    imageUrl: "/images/services/Inter-caste Marriage Concerns.png",
    iconName: "couple",
  },
  {
    id: "overseas-abroad",
    title: "Overseas / Abroad-related Concerns",
    description:
      "Astrological guidance for questions related to overseas opportunities, relocation or life abroad.",
    category: "Career & Business",
    imageUrl: "/images/services/Overseas  Abroad-related Concerns.png",
    iconName: "abroad",
  },
  {
    id: "film-entertainment",
    title: "Film & Entertainment Career Concerns",
    description:
      "Astrological perspective for people working toward or navigating careers in film and entertainment.",
    category: "Career & Business",
    imageUrl:
      "/images/services/Film & Entertainment Career Concerns.png",
    iconName: "film",
  },
];

export const serviceCategories = [
  "All",
  "Love & Marriage",
  "Career & Business",
  "Family & Personal",
  "Astrology & Charts",
  "Spiritual & Wellness",
];
