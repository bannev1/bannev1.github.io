import "@/styles/global.css";

export const metadata = {
  title: "Valentina Banner",
  description: "A website portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
