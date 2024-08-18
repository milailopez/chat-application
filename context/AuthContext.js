
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);


    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                setUserToken(token);
            } else {
                setUserToken(null);
            }
        } catch (error) {
            console.error('Failed to get token:', error); 
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    const signIn = async (token) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            setUserToken(token);
        } catch (error) {
            console.error('Failed to save token:', error); 
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setUserToken(null);
        } catch (error) {
            console.error('Failed to remove token:', error); 
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
