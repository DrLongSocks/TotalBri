import { ImageResponse } from 'next/og';

export const alt = 'Total Bri — Fabricación de Productos de Limpieza';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0A2540 0%, #0B6BCB 55%, #14B8A6 100%)',
          color: 'white',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.8 }}>
          Michoacán, México
        </div>
        <div style={{ display: 'flex', fontSize: 110, fontWeight: 600, lineHeight: 1, marginTop: 24 }}>
          Total&nbsp;
          <span style={{ fontStyle: 'italic' }}>Bri</span>
        </div>
        <div style={{ display: 'flex', fontSize: 32, marginTop: 24, maxWidth: 820, opacity: 0.9 }}>
          Fabricación de productos concentrados de limpieza.
        </div>
      </div>
    ),
    { ...size },
  );
}
