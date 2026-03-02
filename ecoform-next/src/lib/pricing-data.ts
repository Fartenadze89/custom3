export type CupSize = "4oz" | "8oz" | "12oz";

export interface PricingTier {
  quantity: string;
  singleWhite: string;
  doubleWhite: string;
  doubleKraft: string;
}

export interface SizeData {
  withoutLogo: PricingTier[];
  withLogo: PricingTier[];
}

export const pricingData: Record<CupSize, SizeData> = {
  "4oz": {
    withoutLogo: [
      { quantity: "∞", singleWhite: "0.08₾", doubleWhite: "0.17₾", doubleKraft: "0.18₾" },
    ],
    withLogo: [
      { quantity: "500", singleWhite: "0.55₾", doubleWhite: "0.80₾", doubleKraft: "-" },
      { quantity: "1,000", singleWhite: "0.37₾", doubleWhite: "0.50₾", doubleKraft: "-" },
      { quantity: "2,000", singleWhite: "0.25₾", doubleWhite: "0.35₾", doubleKraft: "-" },
      { quantity: "3,000", singleWhite: "0.15₾", doubleWhite: "0.22₾", doubleKraft: "-" },
      { quantity: "10,000", singleWhite: "0.14₾", doubleWhite: "0.20₾", doubleKraft: "-" },
    ],
  },
  "8oz": {
    withoutLogo: [
      { quantity: "∞", singleWhite: "0.10₾", doubleWhite: "0.21₾", doubleKraft: "0.22₾" },
    ],
    withLogo: [
      { quantity: "500", singleWhite: "0.65₾", doubleWhite: "1.00₾", doubleKraft: "-" },
      { quantity: "1,000", singleWhite: "0.40₾", doubleWhite: "0.60₾", doubleKraft: "-" },
      { quantity: "2,000", singleWhite: "0.30₾", doubleWhite: "0.40₾", doubleKraft: "-" },
      { quantity: "3,000", singleWhite: "0.22₾", doubleWhite: "0.26₾", doubleKraft: "-" },
      { quantity: "10,000", singleWhite: "0.21₾", doubleWhite: "0.25₾", doubleKraft: "-" },
    ],
  },
  "12oz": {
    withoutLogo: [
      { quantity: "∞", singleWhite: "0.18₾", doubleWhite: "0.26₾", doubleKraft: "0.27₾" },
    ],
    withLogo: [
      { quantity: "500", singleWhite: "0.70₾", doubleWhite: "1.10₾", doubleKraft: "-" },
      { quantity: "1,000", singleWhite: "0.45₾", doubleWhite: "0.65₾", doubleKraft: "-" },
      { quantity: "2,000", singleWhite: "0.35₾", doubleWhite: "0.45₾", doubleKraft: "-" },
      { quantity: "3,000", singleWhite: "0.26₾", doubleWhite: "0.32₾", doubleKraft: "-" },
      { quantity: "10,000", singleWhite: "0.24₾", doubleWhite: "0.30₾", doubleKraft: "-" },
    ],
  },
};

export const productInfo = [
  {
    size: "4oz" as CupSize,
    name: "Espresso Cup",
    description: "Perfect for espresso, macchiato, and small tastings",
    features: ["Single layer (White)", "Double layer (Kraft/White)", "Custom logo printing"],
    priceFrom: "0.08₾",
  },
  {
    size: "8oz" as CupSize,
    name: "Classic Cup",
    description: "The standard choice for cappuccinos and flat whites",
    features: [
      "Single layer (White)",
      "Double layer (Kraft/White)",
      "Custom logo printing",
      "Matching lids available",
    ],
    priceFrom: "0.10₾",
    featured: true,
  },
  {
    size: "12oz" as CupSize,
    name: "Grande Cup",
    description: "Ideal for lattes, americanos, and iced drinks",
    features: [
      "Single layer (White)",
      "Double layer (Kraft/White)",
      "Custom logo printing",
      "Matching lids available",
    ],
    priceFrom: "0.18₾",
  },
];
