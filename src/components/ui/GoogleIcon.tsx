import React from 'react';

export interface GoogleIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
  size?: number | string;
  filled?: boolean;
}

export const GoogleIcon: React.FC<GoogleIconProps> = ({
  name,
  className = '',
  size,
  filled = false,
  style,
  ...props
}) => {
  const isSpinning = className.includes('animate-spin');

  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center leading-none ${className}`}
      style={{
        fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : 'inherit',
        fontVariationSettings: filled ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        verticalAlign: 'middle',
        ...style
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
};

// Drop-in icon components replacing Lucide icons with Google Material Symbols
const createIcon = (defaultName: string) => {
  const IconComponent: React.FC<Omit<GoogleIconProps, 'name'>> = (props) => (
    <GoogleIcon name={defaultName} {...props} />
  );
  IconComponent.displayName = `GoogleIcon_${defaultName}`;
  return IconComponent;
};

export const ArrowLeft = createIcon('arrow_back');
export const ArrowRight = createIcon('arrow_forward');
export const Check = createIcon('check');
export const CheckCircle2 = createIcon('check_circle');
export const CheckCheck = createIcon('done_all');
export const AlertTriangle = createIcon('warning');
export const AlertCircle = createIcon('error_outline');
export const Info = createIcon('info');
export const Terminal = createIcon('terminal');
export const Code2 = createIcon('code');
export const Play = createIcon('play_arrow');
export const Send = createIcon('send');
export const Loader2: React.FC<Omit<GoogleIconProps, 'name'>> = ({ className = '', ...props }) => (
  <GoogleIcon name="progress_activity" className={`animate-spin ${className}`} {...props} />
);
export const Lock = createIcon('lock');
export const Shield = createIcon('shield');
export const ShieldCheck = createIcon('verified_user');
export const Mail = createIcon('mail');
export const User = createIcon('person');
export const LogIn = createIcon('login');
export const LogOut = createIcon('logout');
export const UserPlus = createIcon('person_add');
export const ChevronDown = createIcon('expand_more');
export const ChevronRight = createIcon('chevron_right');
export const ChevronUp = createIcon('expand_less');
export const Copy = createIcon('content_copy');
export const FileText = createIcon('description');
export const Layers = createIcon('layers');
export const Trash2 = createIcon('delete');
export const X = createIcon('close');
export const XCircle = createIcon('cancel');
export const Search = createIcon('search');
export const Clock = createIcon('schedule');
export const Flame = createIcon('local_fire_department');
export const Sparkles = createIcon('auto_awesome');
export const Server = createIcon('dns');
export const Cpu = createIcon('memory');
export const Scale = createIcon('gavel');
export const Compass = createIcon('explore');
export const Calendar = createIcon('calendar_today');
export const RotateCcw = createIcon('restart_alt');
export const Maximize2 = createIcon('fullscreen');
export const Minimize2 = createIcon('fullscreen_exit');
export const Settings2 = createIcon('settings');
export const FileCode = createIcon('code_blocks');
export const ExternalLink = createIcon('open_in_new');
export const Star = createIcon('star');
export const MessageSquare = createIcon('chat_bubble_outline');
export const Bug = createIcon('bug_report');
export const Lightbulb = createIcon('lightbulb');
export const Heart = createIcon('favorite_border');
export const HelpCircle = createIcon('help_outline');
export const Edit3 = createIcon('edit');
export const MapPin = createIcon('location_on');
export const Briefcase = createIcon('work_outline');
export const Github = createIcon('code');
export const Trophy = createIcon('emoji_events');
export const Award = createIcon('military_tech');
export const Zap = createIcon('bolt');
export const Database = createIcon('database');
export const Activity = createIcon('show_chart');
export const GitBranch = createIcon('fork_right');
export const RefreshCw = createIcon('sync');
export const ArrowUpRight = createIcon('north_east');
export const Boxes = createIcon('grid_view');
export const Gauge = createIcon('speed');
export const TerminalSquare = createIcon('terminal');
export const Radio = createIcon('sensors');
export const FileCode2 = createIcon('code_blocks');
export const Sliders = createIcon('tune');
export const Network = createIcon('hub');
export const Binary = createIcon('data_object');
export const Layers2 = createIcon('layers');
export const Share2 = createIcon('share');
export const Workflow = createIcon('account_tree');
export const Unlock = createIcon('lock_open');
export const Key = createIcon('key');
export const TrendingUp = createIcon('trending_up');
export const BarChart3 = createIcon('bar_chart');
export const CheckCircle = createIcon('check_circle');
export const Tag = createIcon('label');
export const Save = createIcon('save');
export const Globe = createIcon('public');
export const UserIcon = createIcon('person');
export const MessageSquarePlus = createIcon('add_comment');
export const MessageCircle = createIcon('chat');
export const ThumbsUp = createIcon('thumb_up');
export const Eye = createIcon('visibility');
export const EyeOff = createIcon('visibility_off');


