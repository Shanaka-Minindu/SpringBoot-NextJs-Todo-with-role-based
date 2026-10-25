import "@/app/globals.css";
import { Toaster } from "sonner";
import { Inter, Caveat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-script' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <body>
        {children}
        {/* Make sure this component is here! */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}