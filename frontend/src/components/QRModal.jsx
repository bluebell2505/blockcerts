// src/components/QRModal.jsx
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

const QRModal = ({ isOpen, onClose, token, userName, eventId }) => {
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      setQrValue(`qdemy://event/${eventId}/verify?token=${token}&user=${encodeURIComponent(userName)}`);
    }
  }, [isOpen, token, userName, eventId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
          <h2 className="text-xl font-bold text-white">Registration Complete!</h2>
        </div>
        
        <div className="p-6 text-center">
          <div className="mx-auto w-64 h-64 bg-white p-4 rounded-lg border border-gray-200">
            <QRCodeSVG 
              value={qrValue}
              size={256}
              level="H"
              includeMargin={false}
              className="w-full h-full"
            />
          </div>
          
          <p className="mt-6 text-gray-600">
            Scan this QR code to verify your attendance at the event.
          </p>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Registration Token:</p>
            <p className="text-xs font-mono text-gray-500 break-all mt-1">{token}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;