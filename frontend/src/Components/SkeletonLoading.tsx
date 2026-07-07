import type { SkeletonProps } from "../types/Layout";

export function Skeleton({
    width = "100%",
    height = "1rem",
    borderRadius = "6px",
    className = ""

}: SkeletonProps) {
    return (
        <div className={`skeleton ${className}`}
            style={{ width, height, borderRadius }}
            aria-hidden="true" />
    )
}

export function DashboardSkeleton() {
    return (
        <div className="skeleton-page">
            <div className="skeleton-header">
                <div>
                    <Skeleton width="200px" height="28px" />
                    <Skeleton width="140px" height="14px" className="skeleton-mt" />
                </div>
                <Skeleton width="100px" height="36px" borderRadius="10px" />
            </div>
        </div>
    )
}

export function ProfileSkeleton() {
    return (
        <div className="skeleton-page">
            <div className="skeleton-header">
                <div>
                    <Skeleton width="180px" height="28px" />
                    <Skeleton width="220px" height="14px" className="skeleton-mt" />
                </div>
            </div>


            <div className="skeleton-card skeleton-mb">
                <Skeleton width="100px" height="1rem" />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton-info-row">
                        <Skeleton width="80px" height="12px" />
                        <Skeleton width="140px" height="14px" />
                    </div>
                ))}
            </div>


            <div className="skeleton-card">
                <Skeleton width="80px" height="1rem" />
                <div className="skeleton-info-row">
                    <Skeleton width="60px" height="12px" />
                    <Skeleton width="80px" height="14px" />
                </div>
            </div>
        </div>
    )
}

export function ToDoSkeleton() {
    return (
        <div className="skeleton-page">
            <div className="skeleton-header">
                <div>
                    <Skeleton width="140px" height="28px" />
                    <Skeleton width="180px" height="14px" className="skeleton-mt" />
                </div>
            </div>

            <div className="skeleton-row skeleton-mb">
                <Skeleton height="42px" borderRadius="10px" />
                <Skeleton width="100px" height="42px" borderRadius="10px" />
                <Skeleton width="72px" height="42px" borderRadius="10px" />
            </div>

            {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-card skeleton-mb skeleton-todo-item">
                    <Skeleton width="18px" height="18px" borderRadius="4px" />
                    <Skeleton height="16px" />
                    <Skeleton width="60px" height="22px" borderRadius="20px" />
                    <Skeleton width="20px" height="20px" borderRadius="4px" />
                </div>
            ))}

        </div>
    )
}