const primaryColorScheme = ""; // "light" | "dark" - leave empty to follow system
const defaultColorScheme = "orange"; // default accent color

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");
const currentColorScheme = localStorage.getItem("colorScheme");

function getPreferTheme() {
    // return theme value in local storage if it is set
    if (currentTheme) return currentTheme;

    // return primary color scheme if it is set
    if (primaryColorScheme) return primaryColorScheme;

    // return user device's prefer color scheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getColorScheme() {
    return currentColorScheme || defaultColorScheme;
}

let themeValue = getPreferTheme();
let colorScheme = getColorScheme();

function setPreference() {
    localStorage.setItem("theme", themeValue);
    localStorage.setItem("colorScheme", colorScheme);
    reflectPreference();
}

function reflectPreference() {
    document.documentElement.setAttribute("data-theme", themeValue);
    document.documentElement.setAttribute(
        "data-color-scheme",
        colorScheme === "orange" ? "" : colorScheme
    );

    // Update theme button aria-label if exists
    document.querySelector("#theme-toggle")?.setAttribute("aria-label", themeValue);

    // Get the computed styles for the body element
    const body = document.body;
    if (body) {
        const computedStyles = window.getComputedStyle(body);
        const bgColor = computedStyles.backgroundColor;

        // Set the background color in <meta theme-color ... />
        document
            .querySelector("meta[name='theme-color']")
            ?.setAttribute("content", bgColor);
    }
}

// Set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
    function setThemeFeature() {
        // Set on load so screen readers can get the latest value on the button
        reflectPreference();

        // Listen for clicks on the theme toggle button
        document.querySelector("#theme-toggle")?.addEventListener("click", () => {
            themeValue = themeValue === "light" ? "dark" : "light";
            setPreference();
        });

        // Listen for color scheme selector changes
        document.querySelectorAll("[data-color-scheme-btn]").forEach((btn) => {
            btn.addEventListener("click", () => {
                colorScheme = btn.getAttribute("data-color-scheme-btn");
                setPreference();
            });
        });
    }

    setThemeFeature();

    // Runs on view transitions navigation
    document.addEventListener("astro:after-swap", setThemeFeature);
};

// sync with system changes
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
        themeValue = isDark ? "dark" : "light";
        setPreference();
    });
