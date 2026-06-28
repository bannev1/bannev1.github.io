import "../styles/global/global.css"


export const metadata = {
  title: "Valentina Banner",
  description: "Valentina Banner's personal portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
