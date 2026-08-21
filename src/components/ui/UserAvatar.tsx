import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Award, GraduationCap, Crown } from 'lucide-react';

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
  const seed = encodeURIComponent(String(id || name || 'gkce').replace(/\s+/g, '_'));

  if (role === 'DEAN') {
    // SUDO / Dean — lorelei-neutral with dark navy, gold ring personality
    return `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=GKCE_Dean_SUDO_${seed}&backgroundColor=0f172a&radius=16`;
  }
  if (role === 'MENTOR') {
    // Faculty Mentor — avataaars professional style
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor_${seed}&backgroundColor=dbeafe&radius=16&clothingColor=2563eb&hairColor=2d1b0e`;
  }
  // STUDENT — micah style, per roll-number seed for consistency
  return `https://api.dicebear.com/7.x/micah/svg?seed=Student_${seed}&backgroundColor=f1f5f9&radius=16&baseColor=f9dbc7,f5cba7&earringColor=2563eb`;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const RING_MAP = {
  xs: 'ring-1',
  sm: 'ring-2',
  md: 'ring-2',
  lg: 'ring-2',
  xl: 'ring-[3px]',
  '2xl': 'ring-[3px]',
};

const BADGE_MAP = {
  xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5 p-[2px]',
  sm: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5 p-[2px]',
  md: 'w-4 h-4 -bottom-1 -right-1 p-0.5',
  lg: 'w-5 h-5 -bottom-1 -right-1 p-1',
  xl: 'w-6 h-6 -bottom-1 -right-1 p-1',
  '2xl': 'w-7 h-7 -bottom-1.5 -right-1.5 p-1.5',
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
  const isDean = roleUpper === 'DEAN';
  const isMentor = roleUpper === 'MENTOR';

  const ringClass = isDean
    ? `${RING_MAP[size]} ring-amber-400 ring-offset-1 ring-offset-white shadow-amber-500/20`
    : isMentor
    ? `${RING_MAP[size]} ring-blue-300 ring-offset-1 ring-offset-white`
    : '';

  const badgeBg = isDean
    ? 'bg-amber-500 ring-2 ring-white shadow-amber-500/50'
    : isMentor
    ? 'bg-blue-600 ring-2 ring-white'
    : 'bg-emerald-500 ring-2 ring-white';

  const badgeTitle = isDean ? 'Dean of Academics (SUDO)' : isMentor ? 'Faculty Mentor' : 'Student';

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <img
        src={displaySrc}
        alt={name}
        onError={() => setHasError(true)}
        className={`${
          SIZE_MAP[size]
        } rounded-2xl object-cover bg-slate-100 border border-slate-200/80 shadow-2xs transition-all ${
          ringClass
        }`}
      />

      {showBadge && (
        <div
          className={`absolute rounded-full text-white shadow-xs flex items-center justify-center ${BADGE_MAP[size]} ${badgeBg}`}
          title={badgeTitle}
        >
          {isDean && <Crown className="w-full h-full" />}
          {isMentor && <Award className="w-full h-full" />}
          {!isDean && !isMentor && <GraduationCap className="w-full h-full" />}
        </div>
      )}
    </div>
  );
};
