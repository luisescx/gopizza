import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextData {}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export default { AuthProvider, useAuth };
