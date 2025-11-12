// FIX: Import FC and SVGProps from react to resolve namespace errors.
import type { FC, SVGProps } from 'react';

export interface Department {
  id: string;
  name: string;
  manager: string;
  parentId?: string | null;
  description?: string;
}

export interface Assignment {
  question: string;
  solution: string;
  isSolutionVisible: boolean;
  questionFiles: { name: string; url: string }[];
  solutionFiles: { name: string; url: string }[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  textContent: string;
  fileUrl?: string;
  isActive: boolean;
  assignment: Assignment;
}

export interface Company {
  slug: string;
  name: string;
  logoUrl: string;
  slogan: string;
  sloganImageUrl: string;
  managementIntro: string;
  shortDescription: string;
  services: {
    // FIX: Use FC<SVGProps<SVGSVGElement>> instead of React.FC<React.SVGProps<SVGSVGElement>>.
    icon: FC<SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
  }[];
  targetCustomers: string[];
  competitiveAdvantages: {
    // FIX: Use FC<SVGProps<SVGSVGElement>> instead of React.FC<React.SVGProps<SVGSVGElement>>.
    icon: FC<SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
  }[];
  assets: {
    // FIX: Use FC<SVGProps<SVGSVGElement>> instead of React.FC<React.SVGProps<SVGSVGElement>>.
    icon: FC<SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
  }[];
  brandIdentity: {
    colors: string[];
    personality: string;
    tone: string;
  };
  ceo: {
    name: string;
    quote: string;
  };
  organizationalChart: Department[];
}

export interface HoldingData {
  name: string;
  slogan: string;
  intro: string;
  heroImageUrl: string;
  vision: { title: string; text: string };
  mission: { title: string; text: string };
  // FIX: Use FC<SVGProps<SVGSVGElement>> instead of React.FC<React.SVGProps<SVGSVGElement>>.
  values: { title: string; items: { icon: FC<SVGProps<SVGSVGElement>>; name: string; description: string }[] };
  subsidiaries: Company[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  socialLinks: {
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  organizationalChart: Department[];
  trainingModules: TrainingModule[];
}