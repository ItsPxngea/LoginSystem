import { useServerStatus } from "../hooks/UseServerStatus";

export default function OfflineBanner() {
    const { isOnline } = useServerStatus();

    if (isOnline) return null;

    return (
        <div className="offline-banner">
            <span className="offline-icon">⚡</span>
            <span>
                Cannot reach the server - Unfourtunately some features may not work.
                We will reconnect soon.
            </span>
        </div>
    )
}