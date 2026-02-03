export const THEMES = {
  default: {
    id: "default",
    label: "Default",
  },
  halloween: {
    id: "halloween",
    label: "Halloween",
  },
  christmas: {
    id: "christmas",
    label: "Christmas",
  },
} as const;

export const COLOR_SCHEMES = {
  light: {
    id: "light",
    label: "Light Mode",
  },
  dark: {
    id: "dark",
    label: "Dark Mode",
  },
} as const;

// Auto-generate TypeScript types from the registry
export type ThemeStyle = keyof typeof THEMES;
export type ColorScheme = keyof typeof COLOR_SCHEMES;

export const getAvailableThemes = () => Object.values(THEMES);
