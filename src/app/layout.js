import { Noto_Serif_SC, Noto_Sans_SC, Barlow_Condensed } from 'next/font/google';
import '../styles/globals.scss';

const serif = Noto_Serif_SC({ weight: ['500', '700'], display: 'swap', preload: false, variable: '--f-serif' });
const sans = Noto_Sans_SC({ weight: ['400', '500'], display: 'swap', preload: false, variable: '--f-sans' });
const display = Barlow_Condensed({ weight: ['500', '600'], subsets: ['latin'], display: 'swap', variable: '--f-display' });

export const metadata = {
  title: 'Valentina Banner · 作品集',
  description: 'Portfolio of a web designer and front-end developer.',
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#e9dfc8' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
