import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'sans-serif', background: '#F6F9FC', color: '#0A2540', padding: '80px 24px' }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
        <p style={{ marginTop: 16 }}>No encontramos esa página.</p>
        <p style={{ marginTop: 24 }}>
          <Link href="/" style={{ color: '#0B6BCB' }}>
            Volver al inicio
          </Link>
        </p>
      </body>
    </html>
  );
}
