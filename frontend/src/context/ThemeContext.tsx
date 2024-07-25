import React, { createContext, useContext, useState, ReactNode, useEffect} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider:React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('light')
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    }

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
          root.style.setProperty('--bg-color', 'var(--bg-color-light)');
          root.style.setProperty('--text-color', 'var(--text-color-light)');
        } else {
          root.style.setProperty('--bg-color', 'var(--bg-color-dark)');
          root.style.setProperty('--text-color', 'var(--text-color-dark)');
        }
      }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = ():ThemeContextProps => {
    const context = useContext(ThemeContext)
    if(!context){
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}