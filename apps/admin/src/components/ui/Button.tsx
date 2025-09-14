import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
        return (
            <button
                className={clsx(
                    'btn',
                    {
                        'btn-primary': variant === 'primary',
                        'btn-secondary': variant === 'secondary',
                        'btn-outline': variant === 'outline',
                        'btn-ghost': variant === 'ghost',
                        'btn-sm': size === 'sm',
                        'btn-lg': size === 'lg',
                        'opacity-50 cursor-not-allowed': disabled || loading,
                    },
                    className
                )}
                disabled={disabled || loading}
                ref={ref}
                {...props}
            >
                {loading && (
                    <div className="loading-spinner mr-2" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
