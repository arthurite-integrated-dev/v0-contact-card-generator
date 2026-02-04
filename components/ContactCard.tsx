'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Contact } from '@/lib/dynamodb';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownloadQR = (format: 'png' | 'jpeg') => {
    const canvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('QR code canvas not found');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = canvas.toDataURL(`image/${format}`);
      link.download = `${contact.name.replace(/\s+/g, '-')}-qr.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`[v0] Downloaded QR code as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('[v0] Error downloading QR code:', error);
    }
  };

  useEffect(() => {
    if (qrRef.current && contact?.card_slug) {
      try {
        // Clear previous content
        qrRef.current.innerHTML = '';
        
        const cardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/card/${contact.card_slug}`;
        console.log('[v0] Generating QR code for URL:', cardUrl);
        
        const canvas = document.createElement('canvas');
        qrRef.current.appendChild(canvas);
        
        QRCode.toCanvas(
          canvas,
          cardUrl,
          {
            errorCorrectionLevel: 'H',
            width: 200,
            margin: 1,
            color: {
              dark: '#1a472a',
              light: '#ffffff',
            },
          },
          (error) => {
            if (error) {
              console.error('[v0] QR Code error:', error);
            } else {
              console.log('[v0] QR Code generated successfully');
            }
          }
        );
      } catch (error) {
        console.error('[v0] Error generating QR code:', error);
      }
    }
  }, [contact?.card_slug]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header with green background */}
      <div className="bg-gradient-to-r from-[#1a472a] to-[#2d6a4f] p-8 text-white text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/atr-logo.png"
            alt="Arthurite Integrated"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold">Arthurite Integrated</h1>
        <p className="text-[#d8f3dc] text-sm">Information Technology Solutions at Its Peak!</p>
      </div>

      {/* Contact Body */}
      <div className="p-8">
        {/* Photo */}
        {contact.photo_url ? (
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1a472a] shadow-lg">
              <Image
                src={contact.photo_url}
                alt={contact.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('[v0] Image load error:', e);
                }}
                onLoad={() => {
                  console.log('[v0] Image loaded successfully:', contact.photo_url);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1a472a] shadow-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No photo</span>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{contact.name}</h2>
          <p className="text-[#1a472a] font-semibold mb-4">{contact.position}</p>

          <div className="space-y-2 text-sm text-gray-600">
            {contact.email && (
              <p>
                <span className="font-medium text-gray-700">Email:</span>
                <br />
                <a href={`mailto:${contact.email}`} className="text-[#1a472a] hover:underline">
                  {contact.email}
                </a>
              </p>
            )}
            {contact.phone && (
              <p>
                <span className="font-medium text-gray-700">Phone:</span>
                <br />
                <a href={`tel:${contact.phone}`} className="text-[#1a472a] hover:underline">
                  {contact.phone}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-[#d8f3dc] mb-8" />

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Scan to Add</p>
          <div className="flex flex-col items-center gap-4">
            <div
              ref={qrRef}
              className="bg-white p-2 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadQR('png')}
                className="flex items-center gap-2 px-3 py-2 bg-[#1a472a] hover:bg-[#0f3020] text-white text-xs font-medium rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                PNG
              </button>
              <button
                onClick={() => handleDownloadQR('jpeg')}
                className="flex items-center gap-2 px-3 py-2 bg-[#1a472a] hover:bg-[#0f3020] text-white text-xs font-medium rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                JPEG
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>© Arthurite Integrated</p>
          <p className="mt-1">Digital Contact Card</p>
        </div>
      </div>
    </div>
  );
}
