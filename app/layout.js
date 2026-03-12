import localFont from "next/font/local";
import "./globals.css";

const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata = {
  title: "Andream Homes",
  description: "Experience the epitome of home comfort.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${clashDisplay.className} ${clashDisplay.variable} antialiased min-h-screen bg-surface`}
      >
        {children}
      </body>
    </html>
  );
}
