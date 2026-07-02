import { useState, useEffect, useRef, useCallback } from "react";

export function useServerStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const serverCheck = async () => {
        try {
            const res = await fetch("/api/health", {
                method: "HEAD",
                cache: "no-store"
            })
            setIsOnline(!res.ok || res.status === 404);
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
    return {isOnline};
}
/*
export function useServerStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const serverCheck = useCallback(async () => {
        if (!navigator.onLine) {
            setIsOnline(false);
            return;
        }
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort;
        }, 5000)

        try {
            const res = await fetch("/api/health", {
                method: "HEAD",
                cache: "no-store",
                signal: controller.signal
            });
            setIsOnline(res.ok);
        } catch {
            setIsOnline(false);
        } finally {
            clearTimeout(timeout);
        }
    }, [])

    useEffect(() => {
        serverCheck();

        const handleOnline = () => {
            setIsOnline(true);
            serverCheck();
        }

        const handleOffline = () => setIsOnline(false);
        const handleVisibility = () => {
            if (document.visibilityState === "visible") serverCheck();
        }

        const interval = setInterval(serverCheck, 5000)
        return () => {
            window.addEventListener("online", handleOnline);
            window.addEventListener("offline", handleOffline);
            document.removeEventListener("visibilitychange", handleVisibility);
            clearInterval(interval);
        }
    }, [serverCheck])
    return { isOnline }
}
    */