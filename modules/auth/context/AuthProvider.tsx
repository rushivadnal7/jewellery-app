import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    login?: (email: string, password: string) => Promise<void>;
    logout?: () => Promise<void>;
    authState: {
        token: string | null,
        authenticated: boolean | null
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token'

const API_URL = 'https://dummyjson.com'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null
    }>({
        token: null,
        authenticated: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                setAuthState({ token, authenticated: true });
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        };
        loadToken();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const payload = {
                username: username.trim(),
                password: password,
                expiresInMins: 30, 
            };

            console.log('payload', payload)

            const result = await axios.post(`${API_URL}/auth/login`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('login api result', result.data);

            if (result.data.accessToken) {
                setAuthState({
                    token: result.data.accessToken,
                    authenticated: true,
                });

                axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.accessToken}`;
                await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            throw error; 
        }
    };


    const logout = async () => {
        try {

            setAuthState({
                token: null,
                authenticated: false
            })

            axios.defaults.headers.common['Authorization'] = ``

            await SecureStore.deleteItemAsync(TOKEN_KEY)
        } catch (error) {
            console.error(error)

        }
    }

    const value: AuthContextType = {
        login,
        logout,
        authState
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
