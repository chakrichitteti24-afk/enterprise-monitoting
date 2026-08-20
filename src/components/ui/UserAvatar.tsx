import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Shield, Award, GraduationCap } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  id?: string | number;
  role?: UserRole | 'DEAN' | 'MENTOR' | 'STUDENT' | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
}

export function getRbacDefaultAvatar(
  role?: string,
  name?: string,
  id?: string | number
): string {
  const seed = encodeURIComponent(String(id || name || 'gkce'));
  
  if (role === 'DEAN') {
    // Academic Leadership / Dean Avatar
    return `https://api.dicebear.com/7.x/identicon/svg?seed=Dean_${seed}&backgroundColor=0f172a`;
  }
  if (role === 'MENTOR') {
    // Faculty & Mentor Avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor_${seed}&backgroundColor=e0f2fe`;
  }
  // STUDENT / Default
  return `https://api.dicebear.com/7.x/bottts/svg?seed=Student_${seed}&backgroundColor=f1f5f9`;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const BADGE_SIZE_MAP = {
  xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 p-0.5',
  sm: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5 p-0.5',
  md: 'w-4 h-4 -bottom-1 -right-1 p-0.5',
  lg: 'w-5 h-5 -bottom-1 -right-1 p-1',
  xl: 'w-6 h-6 -bottom-1 -right-1 p-1',
  '2xl': 'w-7 h-7 -bottom-1 -right-1 p-1.5',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'User',
  id,
  role = 'STUDENT',
  size = 'md',
  className = '',
  showBadge = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const fallbackUrl = getRbacDefaultAvatar(role, name, id);
  const displaySrc = hasError || !src ? fallbackUrl : src;

  const roleUpper = (role || 'STUDENT').toUpperCase();

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <img
        src={displaySrc}
        alt={name}
        onError={() => setHasError(true)}
        className={`${SIZE_MAP[size]} rounded-2xl object-cover bg-slate-100 border border-slate-200/80 shadow-2xs transition-all`}
      />

      {showBadge && (
        <div
          className={`absolute rounded-full text-white shadow-xs flex items-center justify-center ${BADGE_SIZE_MAP[size]} ${
            roleUpper === 'DEAN'
              ? 'bg-amber-600 ring-2 ring-white'
              : roleUpper === 'MENTOR'
              ? 'bg-blue-600 ring-2 ring-white'
              : 'bg-emerald-600 ring-2 ring-white'
          }`}
          title={roleUpper === 'DEAN' ? 'Dean of Academics' : roleUpper === 'MENTOR' ? 'Faculty Mentor' : 'Student'}
        >
          {roleUpper === 'DEAN' && <Shield className="w-full h-full" />}
          {roleUpper === 'MENTOR' && <Award className="w-full h-full" />}
          {roleUpper === 'STUDENT' && <GraduationCap className="w-full h-full" />}
        </div>
      )}
    </div>
  );
};
