import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import Header from '@/components/Header/Header';
import './globals.scss';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jackpot.bet — Casino Game Lobby',
  description: 'Discover hundreds of casino games — slots, blackjack, baccarat and live dealer.',
  icons: {
    icon: '/icons/sections/jackpot-originals.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        {/* liquid glass SVG displacement filter — defined once, used by game cards */}
        <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="liquid-glass" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves="4" seed="2" stitchTiles="stitch" result="noise"/>
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
              <feDisplacementMap in="SourceGraphic" in2="grayNoise" scale="6" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
              <feComposite in="displaced" in2="SourceGraphic" operator="in"/>
            </filter>
          </defs>
        </svg>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
