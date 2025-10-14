import React from 'react';
import { motion } from 'motion/react';
import { X, Download, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface QRDisplayProps {
  qrCode: string;
  eventTitle: string;
  onClose: () => void;
}

export function QRDisplay({ qrCode, eventTitle, onClose }: QRDisplayProps) {
  // Generate a simple QR code pattern using the qrCode string
  const generateQRPattern = (data: string) => {
    const size = 25;
    const pattern = [];
    
    // Simple hash function to generate pseudo-random pattern
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    for (let i = 0; i < size * size; i++) {
      // Use hash and position to determine if cell should be filled
      const isBlack = ((hash + i) * 7) % 3 === 0;
      pattern.push(isBlack);
    }
    
    return pattern;
  };

  const qrPattern = generateQRPattern(qrCode);
  const qrSize = 25;

  const handleDownload = () => {
    // Create a canvas element to draw the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 8;
    canvas.width = qrSize * cellSize;
    canvas.height = qrSize * cellSize;

    if (ctx) {
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR pattern
      ctx.fillStyle = '#000000';
      qrPattern.forEach((isBlack, index) => {
        if (isBlack) {
          const x = (index % qrSize) * cellSize;
          const y = Math.floor(index / qrSize) * cellSize;
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `qr-${eventTitle.replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Registration Successful!</span>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <h3 className="text-lg text-gray-800">{eventTitle}</h3>
            <p className="text-sm text-gray-600">
              Save this QR code for event attendance
            </p>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-lg">
              <div className="grid grid-cols-25 gap-0 w-64 h-64">
                {qrPattern.map((isBlack, index) => (
                  <div
                    key={index}
                    className={`aspect-square ${isBlack ? 'bg-black' : 'bg-white'}`}
                    style={{
                      width: `${256 / qrSize}px`,
                      height: `${256 / qrSize}px`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Text */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 break-all">{qrCode}</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Present this QR code at the event for attendance</p>
            <p>• Keep a screenshot or download for backup</p>
            <p>• Contact support if you lose your QR code</p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}