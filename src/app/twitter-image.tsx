import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Tulane AI & Data Science Division';
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#006747', // Tulane Green
          backgroundImage: 'linear-gradient(135deg, #006747 0%, #0F4C81 100%)',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            padding: '40px',
            zIndex: 1,
          }}
        >
          {/* Main Title */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              lineHeight: '1.1',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Tulane AI &
          </h1>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              margin: '0 0 24px 0',
              lineHeight: '1.1',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Data Science Division
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: '24px',
              margin: '0 0 32px 0',
              opacity: 0.9,
              maxWidth: '700px',
              lineHeight: '1.3',
            }}
          >
            Advancing medical research through AI and data science
          </p>
          
          {/* University Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '12px 24px',
              borderRadius: '40px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
              }}
            >
              Tulane University School of Medicine
            </span>
          </div>
        </div>
        
        {/* Bottom Accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #C8102E 0%, #006747 50%, #0F4C81 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}