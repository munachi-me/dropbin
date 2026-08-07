// components/Toast.tsx
"use client"
import { 
    useState, 
    useEffect, 
    ReactNode ,
    createContext, 
    useContext,
} from "react"
import { 
    BsCheck2, 
    BsXCircle, 
    BsExclamationTriangle, 
    BsClock,
    BsX 
} from "react-icons/bs"
import { v7 as uuid } from "uuid";

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    type: ToastType
    message: string
    duration?: number
}

interface ToastItemProps {
    toast: Toast
    onClose: (id: string) => void
}

interface ToastContainerProps {
    toasts: Toast[]
    onClose: (id: string) => void
}

// Individual Toast Item
function ToastItem({ toast, onClose }: ToastItemProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id)
        }, 5000)
        
        return () => clearTimeout(timer)
    }, [toast.id, toast.duration, onClose])

    const icons: Record<ToastType, ReactNode> = {
        success: <BsCheck2 className="text-success" />,
        error: <BsXCircle className="text-destructive" />,
        warning: <BsExclamationTriangle className="text-warning" />,
        info: <BsClock className="text-primary" />,
    }

    const styles: Record<ToastType, string> = {
        success: 'border-success text-success',
        error: 'border-destructive text-destructive',
        warning: 'border-warning text-warning',
        info: 'border-primary text-primary',
    }

    const iconColors: Record<ToastType, string> = {
        success: 'text-success',
        error: 'text-destructive',
        warning: 'text-warning',
        info: 'text-primary',
    }

    return (
        <div className={`font-bold bg-secondary flex items-center gap-3 p-4 rounded-xl border ${styles[toast.type]} shadow-lg animate-in slide-in-from-top-2 duration-300 max-w-md w-full`}>
            <span className={`text-xl flex-shrink-0 ${iconColors[toast.type]}`}>
                {icons[toast.type]}
            </span>
            <span className="text-sm flex-1">{toast.message}</span>
            <button 
                onClick={() => onClose(toast.id)}
                className="p-1 hover:bg-foreground/10 rounded-full transition-colors flex-shrink-0"
                aria-label="Close notification"
            >
                <BsX />
            </button>
        </div>
    )
}

// Toast Container
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    if (toasts.length === 0) return null
    
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
            <div className="pointer-events-auto space-y-2">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={onClose} />
                ))}
            </div>
        </div>
    )
}

// Toast Functions
export function success(m: string): Toast {
    return {
        id: uuid(),
        type: 'success',
        message: m
    }
}
export function errorT(m: string): Toast {
    return {
        id: uuid(),
        type: 'error',
        message: m
    }
}
export function warning(m: string): Toast {
    return {
        id: uuid(),
        type: 'warning',
        message: m
    }
}
export function info(m: string): Toast {
    return {
        id: uuid(),
        type: 'info',
        message: m
    }
}