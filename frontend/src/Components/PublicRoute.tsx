import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PublicRouteProps {
    children: ReactNode;
}

function getToken(): string | null {
    return localStorage.getItem("token") ?? sessionStorage.getItem("token")
}

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))

        if (!payload.exp) return false;

        const expiryMs = payload.exp * 1000;

        return Date.now() >= expiryMs;

    } catch {
        return true;
    }
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const token = getToken();

    if (token && !isTokenExpired(token)) {
        
        return <Navigate to="/dashboard" replace/>
        
    }
    return <>{children}</>
}