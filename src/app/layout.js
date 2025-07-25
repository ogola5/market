// src/app/layout.js
import './globals.css';
// Assuming AuthComponent.js is in src/app/ and exports AuthProvider
import { AuthProvider } from './AuthComponent'; // Changed path

export const metadata = {
  title: 'Marketing App',
  description: 'Converted from React to Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}