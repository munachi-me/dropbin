// components/Toast.tsx
"use client"
import { useState, useEffect, ReactNode } from "react"
import { 
    BsCheck2, 
    BsXCircle, 
    BsExclamationTriangle, 
    BsClock,
    BsX 
} from "react-icons/bs"

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
        }, toast.duration || 5000)
        
        return () => clearTimeout(timer)
    }, [toast.id, toast.duration, onClose])

    const icons: Record<ToastType, ReactNode> = {
        success: <BsCheck2 className="text-green-500" />,
        error: <BsXCircle className="text-red-500" />,
        warning: <BsExclamationTriangle className="text-yellow-500" />,
        info: <BsClock className="text-blue-500" />,
    }

    const styles: Record<ToastType, string> = {
        success: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300',
        error: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
        warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
    }

    const iconColors: Record<ToastType, string> = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500',
    }

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${styles[toast.type]} shadow-lg animate-in slide-in-from-top-2 duration-300 max-w-md w-full`}>
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

// Custom hook for toast notifications
export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7)
        setToasts((prev) => [...prev, { ...toast, id }])
        
        // Auto-remove toast after duration
        if (toast.duration !== 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id))
            }, toast.duration || 5000)
        }
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    const clearAllToasts = () => {
        setToasts([])
    }

    return {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success: (message: string, duration?: number) => 
            addToast({ type: 'success', message, duration }),
        error: (message: string, duration?: number) => 
            addToast({ type: 'error', message, duration }),
        warning: (message: string, duration?: number) => 
            addToast({ type: 'warning', message, duration }),
        info: (message: string, duration?: number) => 
            addToast({ type: 'info', message, duration }),
    }
}

// Toast Context for global toast management
import { createContext, useContext, ReactNode } from 'react'

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
    clearAllToasts: () => void
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const toastHook = useToast()

    return (
        <ToastContext.Provider value={toastHook}>
            {children}
            <ToastContainer toasts={toastHook.toasts} onClose={toastHook.removeToast} />
        </ToastContext.Provider>
    )
}

export function useToastContext() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider')
    }
    return context
}