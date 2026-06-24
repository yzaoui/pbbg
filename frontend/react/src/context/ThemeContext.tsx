/* eslint-disable react-refresh/only-export-components */
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { COLOR_SCHEMES, ColorScheme, THEMES, ThemeStyle } from "../styles/themeRegistry";

interface ThemeContextType {
    theme: ThemeStyle;
    colorScheme: ColorScheme;
    setTheme: (theme: ThemeStyle) => void;
    setColorScheme: (colorScheme: ColorScheme) => void;
    toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
  
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Theme style (default, halloween, etc.)
    const [theme, setThemeState] = useState<ThemeStyle>(() => {
        const stored = localStorage.getItem("pbbg-theme-style");
        
        // Validate stored theme exists in registry
        if (stored && stored in THEMES) {
            return stored as ThemeStyle;
        }
        
        return "default";
  });

    // Color scheme (light/dark)
    const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
        // Check localStorage first (user's explicit preference)
        const stored = localStorage.getItem("pbbg-color-scheme");
        if (stored && stored in COLOR_SCHEMES) {
            return stored as ColorScheme;
        }

        // Fall back to system preference
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        // Default to light mode
        return "light";
    });

    useEffect(() => {
        // Apply theme style to root element
        document.documentElement.setAttribute("data-theme", theme);

        // Persist to localStorage
        localStorage.setItem("pbbg-theme-style", theme);
    }, [theme]);

    useEffect(() => {
        // Apply color scheme to root element
        document.documentElement.setAttribute("data-color-scheme", colorScheme);

        // Persist to localStorage
        localStorage.setItem("pbbg-color-scheme", colorScheme);
    }, [colorScheme]);

    useEffect(() => {
        // Listen for system preference changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            // Only auto-switch if user hasn't manually set a preference
            const stored = localStorage.getItem("pbbg-color-scheme");
            if (!stored) {
                setColorSchemeState(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleColorScheme = () => {
        setColorSchemeState(prev => prev === "light" ? "dark" : "light");
    };

    const setTheme = (newTheme: ThemeStyle) => {
        setThemeState(newTheme);
    };

    const setColorScheme = (newColorScheme: ColorScheme) => {
        setColorSchemeState(newColorScheme);
    };

    return <ThemeContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme, toggleColorScheme }}>
        {children}
    </ThemeContext.Provider>;
};
