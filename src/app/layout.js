import localFont from "next/font/local";
import "./globals.css";

export const metadata = {
  title: "Worst UI ever",
  description: "Worst UI ever",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` flex min-h-screen items-center justify-center mx-auto antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
