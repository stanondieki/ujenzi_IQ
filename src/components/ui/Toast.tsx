import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // Allow time for the fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />
  };

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg border shadow-lg transition-opacity duration-300 ${
        colors[type]
      } ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="alert"
    >
      <div className="flex items-center">
        {icons[type]}
        <span className="ml-2 text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 300);
        }}
        className="ml-4 inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-opacity-10 hover:bg-black focus:outline-none"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
