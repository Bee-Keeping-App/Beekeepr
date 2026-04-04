import React, { useState } from 'react';
import { Login } from '../../screens/Auth/Login';
import { Register } from '../../screens/Auth/Register';

type AuthScreen = 'login' | 'register';

// Simple screen switcher — no nested NavigationContainer needed for two screens
export function AuthStack() {
    const [screen, setScreen] = useState<AuthScreen>('login');

    if (screen === 'register') {
        return <Register onNavigateToLogin={() => setScreen('login')} />;
    }

    return <Login onNavigateToRegister={() => setScreen('register')} />;
}
