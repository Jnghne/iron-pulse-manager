import React from 'react';
import { cn } from '@/lib/utils';
import { Dumbbell } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sidebar';
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md',
  variant = 'default'
}) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  if (variant === 'sidebar') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', sizes[size], className)}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2563eb]">
        <Dumbbell className="h-5 w-5 text-white" />
      </div>
      <div className="font-bold tracking-tight">
        <span className="text-primary">Gym</span>
        <span className="text-muted-foreground">Manager</span>
      </div>
    </div>
  );
};

export default Logo;
