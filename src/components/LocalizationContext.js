// src/components/LocalizationContext.js
import { createContext, useState, useEffect } from "react";

const LocalizationContext = createContext();

const LocalizationProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const storedLanguage = localStorage.getItem("language");
        return storedLanguage || "en";
    });
    const [decimalSeparator, setDecimalSeparator] = useState(".");
    const [thousandsSeparator, setThousandsSeparator] = useState(",");

    useEffect(() => {
        const savedDecimalSeparator = localStorage.getItem("decimalSeparator");
        const savedThousandsSeparator = localStorage.getItem("thousandsSeparator");
        const storedLanguage = localStorage.getItem("language");

        if (savedDecimalSeparator) {
            setDecimalSeparator(savedDecimalSeparator);
        }
        if (savedThousandsSeparator) {
            setThousandsSeparator(savedThousandsSeparator);
        }
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("decimalSeparator", decimalSeparator);
        localStorage.setItem("thousandsSeparator", thousandsSeparator);
        localStorage.setItem("language", language);
    }, [decimalSeparator, thousandsSeparator, language]);

    const updateLanguage = (lang) => {
        if (lang !== language) {
            setLanguage(lang);
        }
    };

    const updateDecimalSeparator = (separator) => setDecimalSeparator(separator);
    const updateThousandsSeparator = (separator) => setThousandsSeparator(separator);

    return (
        <LocalizationContext.Provider
            value={{
                language,
                updateLanguage,
                decimalSeparator,
                thousandsSeparator,
                updateDecimalSeparator,
                updateThousandsSeparator,
            }}
        >
            {children}
        </LocalizationContext.Provider>
    );
};

export { LocalizationProvider, LocalizationContext };
