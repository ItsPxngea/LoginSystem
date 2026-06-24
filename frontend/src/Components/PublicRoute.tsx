import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
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

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")

        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}