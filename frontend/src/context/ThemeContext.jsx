import React from 'react';
import { SettingsContext, SettingsProvider } from './SettingsContext';

export const ThemeContext = SettingsContext;

export const ThemeProvider = ({ children }) => <SettingsProvider>{children}</SettingsProvider>;
