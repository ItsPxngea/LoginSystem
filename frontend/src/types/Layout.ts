import type { ReactNode } from "react";

export interface LayoutProps{
    children:ReactNode
}

export interface SkeletonProps{
    width?:string
    height?:string
    borderRadius?:string
    className?:string
}