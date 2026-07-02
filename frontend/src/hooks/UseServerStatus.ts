import { useState, useEffect, useRef } from "react";

export function useServerStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const serverCheck = async () => {
        try {
            const res = await fetch("/api/health", {
                method: "HEAD",
                cache: "no-store"
            })
            setIsOnline(res.ok || res.status === 404);
        } catch {
            setIsOnline(false);
        }
    }

    useEffect(() => {
        serverCheck()
        intervalRef.current = setInterval(serverCheck, 30000)

        window.addEventListener("focus", serverCheck);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            window.removeEventListener("focus", serverCheck);
        }
    }, [])
    return (isOnline);
}