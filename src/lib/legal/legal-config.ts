export const legalConfig = {
  tradeName: "Te Resuelvo",
  siteUrl: "https://teresuelvo.net",
  contactEmail: "info@teresuelvo.net",
  updatedLabel: "30 de septiembre de 2026",
  termsPath: "/terminos-y-condiciones",
  privacyPath: "/aviso-de-privacidad",
} as const;

export const publicLegalPaths = [
  legalConfig.termsPath,
  legalConfig.privacyPath,
] as const;
