import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Vibe India — Indian Vibes. One Song at a Time.",
    template: "%s — Vibe India",
  },
  description:
    "Vibe India is a collection of simple Indian music experiences — Truck Driver, Deluxe Saloon, Chai Tapri, Auto Rickshaw and more.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Vibe India — Indian Vibes. One Song at a Time.",
    description:
      "Vibe India is a collection of simple Indian music experiences — Truck Driver, Deluxe Saloon, Chai Tapri, Auto Rickshaw and more.",
    url: "https://vibe-india.vercel.app",
    type: "website",
    locale: "en_IN",
    siteName: "Vibe India",
    images: [
      {
        url: "/master.png",
        width: 1200,
        height: 630,
        alt: "Vibe India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe India — Indian Vibes. One Song at a Time.",
    description:
      "Vibe India is a collection of simple Indian music experiences.",
    images: ["/master.png"],
  },
  icons: {
    icon: "/Logo_OnlyVector.png",
    shortcut: "/Logo_OnlyVector.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white selection:bg-white/20 app-shell">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
