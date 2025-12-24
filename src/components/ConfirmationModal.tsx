// src/components/ConfirmationModal.tsx
'use client';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Potwierdź",
  cancelLabel = "Anuluj",
  isDangerous = false,
  isLoading = false
}: ConfirmationModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      {/* ZMIANY CSS:
         1. max-h-[90vh] -> Modal nigdy nie będzie wyższy niż 90% ekranu.
         2. flex flex-col -> Pozwala nam zarządzać układem w pionie (nagłówek - treść - przyciski).
         3. max-w-md -> Zwiększyłem nieco szerokość z 'sm' na 'md', żeby tekst miał więcej miejsca.
      */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col border border-gray-200">
        
        {/* HEADER (Zawsze widoczny) */}
        <div className="p-6 pb-2">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>

        {/* CONTENT (Przewijalny) */}
        {/* ZMIANY CSS:
           1. overflow-y-auto -> Jeśli tekst jest długi, pojawi się pasek przewijania TYLKO tutaj.
           2. px-6 -> Padding po bokach.
           3. break-words -> Kluczowe! Długie słowa (np. ID taska) zostaną złamane do nowej linii.
        */}
        <div className="px-6 py-2 overflow-y-auto">
          <p className="text-gray-600 text-sm break-words whitespace-pre-wrap">
            {message}
          </p>
        </div>
        
        {/* FOOTER / BUTTONS (Zawsze widoczne na dole) */}
        <div className="p-6 pt-4 flex justify-end gap-3 mt-auto">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded text-sm font-medium transition disabled:opacity-70 flex items-center gap-2 ${
              isDangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}