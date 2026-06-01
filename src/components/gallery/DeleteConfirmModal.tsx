import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({ isOpen, imageUrl, onClose, onConfirm, isDeleting = false }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-[#1a1a2e] rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 dark:border-[#2a2a3e]"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Photo?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              This action cannot be undone. The photo will be permanently removed.
            </p>

            {/* Thumbnail Preview */}
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 border border-slate-100 dark:border-[#2a2a3e]">
              <img src={imageUrl} alt="Photo to delete" className="w-full h-full object-cover" />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2a2a3e] hover:bg-slate-50 dark:hover:bg-[#16213e] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center shadow-lg shadow-red-500/20"
              >
                {isDeleting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
