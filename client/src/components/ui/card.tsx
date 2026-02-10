import type { ReactNode } from 'react';

interface CardProps {
    className?: string;
    children: ReactNode;
}

export function Card({ className = '', children }: CardProps) {
    return (
        <div className={`p-6 rounded-xl shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ className = '', children }: CardProps) {
    return (
        <h3 className={`text-lg font-semibold text-zinc-100 mb-2 ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ className = '', children }: CardProps) {
    return (
        <div className={`text-zinc-300 ${className}`}>
            {children}
        </div>
    );
}
