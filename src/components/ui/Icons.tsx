import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

const BaseSvg: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  className = '',
  children,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 select-none ${className}`}
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const ArrowLeft: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </BaseSvg>
);

export const ArrowRight: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </BaseSvg>
);

export const ArrowUpRight: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </BaseSvg>
);

export const Check: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M20 6 9 17l-5-5" />
  </BaseSvg>
);

export const CheckCircle: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </BaseSvg>
);

export const CheckCircle2: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </BaseSvg>
);

export const CheckCheck: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </BaseSvg>
);

export const AlertTriangle: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseSvg>
);

export const AlertCircle: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </BaseSvg>
);

export const Info: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </BaseSvg>
);

export const Terminal: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </BaseSvg>
);

export const TerminalSquare: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="m7 15 4-4-4-4" />
    <path d="M13 15h4" />
  </BaseSvg>
);

export const Code2: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </BaseSvg>
);

export const Play: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <polygon points="6 3 20 12 6 21 6 3" />
  </BaseSvg>
);

export const Send: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </BaseSvg>
);

export const Loader2: React.FC<IconProps> = ({ className = '', ...props }) => (
  <BaseSvg className={`animate-spin ${className}`} {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </BaseSvg>
);

export const Lock: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </BaseSvg>
);

export const Unlock: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </BaseSvg>
);

export const Key: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </BaseSvg>
);

export const Shield: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </BaseSvg>
);

export const ShieldCheck: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </BaseSvg>
);

export const Mail: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </BaseSvg>
);

export const User: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </BaseSvg>
);

export const UserIcon = User;

export const UserPlus: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </BaseSvg>
);

export const LogIn: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </BaseSvg>
);

export const LogOut: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </BaseSvg>
);

export const ChevronDown: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m6 9 6 6 6-6" />
  </BaseSvg>
);

export const ChevronRight: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m9 18 6-6-6-6" />
  </BaseSvg>
);

export const ChevronUp: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m18 15-6-6-6 6" />
  </BaseSvg>
);

export const Copy: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </BaseSvg>
);

export const FileText: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </BaseSvg>
);

export const Layers: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 12.5-9.42 4.29a2 2 0 0 1-1.66 0L2 12.5" />
    <path d="m22 17.5-9.42 4.29a2 2 0 0 1-1.66 0L2 17.5" />
  </BaseSvg>
);

export const Layers2 = Layers;

export const Trash2: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </BaseSvg>
);

export const Menu: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </BaseSvg>
);

export const X: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </BaseSvg>
);

export const XCircle: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </BaseSvg>
);

export const Search: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </BaseSvg>
);

export const Clock: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </BaseSvg>
);

export const Flame: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
  </BaseSvg>
);

export const Sparkles: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </BaseSvg>
);

export const Server: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </BaseSvg>
);

export const Cpu: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M15 2v2" />
    <path d="M15 20v2" />
    <path d="M2 15h2" />
    <path d="M2 9h2" />
    <path d="M20 15h2" />
    <path d="M20 9h2" />
    <path d="M9 2v2" />
    <path d="M9 20v2" />
  </BaseSvg>
);

export const Scale: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </BaseSvg>
);

export const Compass: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </BaseSvg>
);

export const Calendar: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </BaseSvg>
);

export const RotateCcw: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </BaseSvg>
);

export const RefreshCw: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </BaseSvg>
);

export const Maximize2: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </BaseSvg>
);

export const Minimize2: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </BaseSvg>
);

export const Settings2: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M20 7h-9" />
    <path d="M14 17H5" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="7" r="3" />
  </BaseSvg>
);

export const FileCode: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m10 13-2 2 2 2" />
    <path d="m14 17 2-2-2-2" />
  </BaseSvg>
);

export const FileCode2 = FileCode;

export const ExternalLink: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </BaseSvg>
);

export const Star: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </BaseSvg>
);

export const Heart: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </BaseSvg>
);

export const MessageSquare: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </BaseSvg>
);

export const MessageSquarePlus: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="12" y1="7" x2="12" y2="13" />
    <line x1="9" y1="10" x2="15" y2="10" />
  </BaseSvg>
);

export const MessageCircle: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </BaseSvg>
);

export const Bug: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="8" height="14" x="8" y="6" rx="4" />
    <path d="m19 7-3 2" />
    <path d="m5 7 3 2" />
    <path d="m19 19-3-2" />
    <path d="m5 19 3-2" />
    <path d="M20 13h-4" />
    <path d="M4 13h4" />
    <path d="m10 4 1 2" />
    <path d="m14 4-1 2" />
  </BaseSvg>
);

export const Lightbulb: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </BaseSvg>
);

export const HelpCircle: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </BaseSvg>
);

export const Edit3: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </BaseSvg>
);

export const MapPin: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </BaseSvg>
);

export const Briefcase: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </BaseSvg>
);

export const Github: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </BaseSvg>
);

export const Trophy: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.45.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </BaseSvg>
);

export const Award: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </BaseSvg>
);

export const Zap: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </BaseSvg>
);

export const Database: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </BaseSvg>
);

export const Activity: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </BaseSvg>
);

export const GitBranch: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </BaseSvg>
);

export const Boxes: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l6.03 3.48a2 2 0 0 0 2 0l6.03-3.48a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L11 9.44a2 2 0 0 0-2 0l-6.03 3.48z" />
    <path d="M7 16.5 12 14l5 2.5" />
    <path d="M12 14v7.5" />
    <path d="M12 2.14 7 5l5 2.86L17 5l-5-2.86z" />
  </BaseSvg>
);

export const Gauge: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </BaseSvg>
);

export const Radio: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </BaseSvg>
);

export const Sliders: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </BaseSvg>
);

export const Network: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
    <path d="M12 12V8" />
  </BaseSvg>
);

export const Binary: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect x="14" y="14" width="4" height="6" rx="2" />
    <rect x="6" y="4" width="4" height="6" rx="2" />
    <path d="M6 20h4" />
    <path d="M14 10h4" />
    <path d="M6 14h2v6" />
    <path d="M14 4h2v6" />
  </BaseSvg>
);

export const Share2: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </BaseSvg>
);

export const Workflow: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />
  </BaseSvg>
);

export const TrendingUp: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </BaseSvg>
);

export const BarChart3: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </BaseSvg>
);

export const Tag: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </BaseSvg>
);

export const Save: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </BaseSvg>
);

export const Globe: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </BaseSvg>
);

export const ThumbsUp: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3" />
  </BaseSvg>
);

export const Eye: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </BaseSvg>
);

export const EyeOff: React.FC<IconProps> = (props) => (
  <BaseSvg {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </BaseSvg>
);

export interface DynamicIconProps extends IconProps {
  name: string;
  filled?: boolean;
}

export const GoogleIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'arrow_back': return <ArrowLeft {...props} />;
    case 'arrow_forward': return <ArrowRight {...props} />;
    case 'check': return <Check {...props} />;
    case 'check_circle': return <CheckCircle2 {...props} />;
    case 'done_all': return <CheckCheck {...props} />;
    case 'warning': return <AlertTriangle {...props} />;
    case 'error_outline': return <AlertCircle {...props} />;
    case 'info': return <Info {...props} />;
    case 'terminal': return <Terminal {...props} />;
    case 'code': return <Code2 {...props} />;
    case 'play_arrow': return <Play {...props} />;
    case 'send': return <Send {...props} />;
    case 'progress_activity': return <Loader2 {...props} />;
    case 'lock': return <Lock {...props} />;
    case 'lock_open': return <Unlock {...props} />;
    case 'shield': return <Shield {...props} />;
    case 'verified_user': return <ShieldCheck {...props} />;
    case 'mail': return <Mail {...props} />;
    case 'person': return <User {...props} />;
    case 'person_add': return <UserPlus {...props} />;
    case 'login': return <LogIn {...props} />;
    case 'logout': return <LogOut {...props} />;
    case 'expand_more': return <ChevronDown {...props} />;
    case 'chevron_right': return <ChevronRight {...props} />;
    case 'expand_less': return <ChevronUp {...props} />;
    case 'content_copy': return <Copy {...props} />;
    case 'description': return <FileText {...props} />;
    case 'layers': return <Layers {...props} />;
    case 'delete': return <Trash2 {...props} />;
    case 'close': return <X {...props} />;
    case 'cancel': return <XCircle {...props} />;
    case 'search': return <Search {...props} />;
    case 'schedule': return <Clock {...props} />;
    case 'local_fire_department': return <Flame {...props} />;
    case 'auto_awesome': return <Sparkles {...props} />;
    case 'dns': return <Server {...props} />;
    case 'memory': return <Cpu {...props} />;
    case 'gavel': return <Scale {...props} />;
    case 'explore': return <Compass {...props} />;
    case 'calendar_today': return <Calendar {...props} />;
    case 'restart_alt': return <RotateCcw {...props} />;
    case 'fullscreen': return <Maximize2 {...props} />;
    case 'fullscreen_exit': return <Minimize2 {...props} />;
    case 'settings': return <Settings2 {...props} />;
    case 'code_blocks': return <FileCode {...props} />;
    case 'open_in_new': return <ExternalLink {...props} />;
    case 'star': return <Star {...props} />;
    case 'chat_bubble_outline': return <MessageSquare {...props} />;
    case 'add_comment': return <MessageSquarePlus {...props} />;
    case 'chat': return <MessageCircle {...props} />;
    case 'bug_report': return <Bug {...props} />;
    case 'lightbulb': return <Lightbulb {...props} />;
    case 'favorite_border': return <Heart {...props} />;
    case 'help_outline': return <HelpCircle {...props} />;
    case 'edit': return <Edit3 {...props} />;
    case 'location_on': return <MapPin {...props} />;
    case 'work_outline': return <Briefcase {...props} />;
    case 'emoji_events': return <Trophy {...props} />;
    case 'military_tech': return <Award {...props} />;
    case 'bolt': return <Zap {...props} />;
    case 'database': return <Database {...props} />;
    case 'show_chart': return <Activity {...props} />;
    case 'fork_right': return <GitBranch {...props} />;
    case 'sync': return <RefreshCw {...props} />;
    case 'north_east': return <ArrowUpRight {...props} />;
    case 'grid_view': return <Boxes {...props} />;
    case 'speed': return <Gauge {...props} />;
    case 'sensors': return <Radio {...props} />;
    case 'tune': return <Sliders {...props} />;
    case 'hub': return <Network {...props} />;
    case 'data_object': return <Binary {...props} />;
    case 'share': return <Share2 {...props} />;
    case 'account_tree': return <Workflow {...props} />;
    case 'key': return <Key {...props} />;
    case 'trending_up': return <TrendingUp {...props} />;
    case 'bar_chart': return <BarChart3 {...props} />;
    case 'label': return <Tag {...props} />;
    case 'save': return <Save {...props} />;
    case 'public': return <Globe {...props} />;
    case 'thumb_up': return <ThumbsUp {...props} />;
    case 'visibility': return <Eye {...props} />;
    case 'visibility_off': return <EyeOff {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};

