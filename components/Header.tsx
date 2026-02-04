import Image from 'next/image';

interface HeaderProps {
  logo: string;
}

export default function Header({ logo }: HeaderProps) {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image
            src="/atr-logo.png"
            alt="Arthurite Integrated Logo"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-[#1a472a] mb-2">
        Arthurite Integrated
      </h1>
      <p className="text-gray-600 text-lg">
        e-Contact Card Generator
      </p>
      <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
        Create unique, shareable contact cards with QR codes. Professional digital business cards for modern networking.
      </p>
    </header>
  );
}
