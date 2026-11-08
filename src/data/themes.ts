import meadow from '../assets/xp-landscape.webp';
import aqua from '../assets/theme-aqua.webp';
import bubbles from '../assets/theme-bubbles.webp';

export const desktopEras = [
  { id: '98', label: '1998 · 98', spoken: '1998, Windows 98' },
  { id: 'xp', label: '2001 · XP', spoken: '2001, Windows XP' },
  { id: '7', label: '2009 · 7', spoken: '2009, Windows 7' },
] as const;

export const themes = [
  { id: 'meadow', label: 'Meadow', wallpaper: meadow },
  { id: 'aqua', label: 'Aqua', wallpaper: aqua },
  { id: 'bubbles', label: 'Bubbles', wallpaper: bubbles },
] as const;
