import type { Metadata } from 'next';
import './globals.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Brickell Barber — Precisión que se nota',
  description: 'Barbería contemporánea. Cortes precisos, presencia impecable.',
  metadataBase: new URL('https://ddamianzr.github.io/brickell-barber-demo/'),
  openGraph: {
    title: 'Brickell Barber',
    description: 'Tu próximo corte empieza aquí.',
    images: [{ url: 'https://ddamianzr.github.io/brickell-barber-demo/logo.jpg', width: 720, height: 720 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body data-base-path={basePath}>{children}</body></html>;
}
