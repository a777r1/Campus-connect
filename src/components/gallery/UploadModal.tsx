import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { MOCK_EVENTS } from '../../constants';
import { cn } from '../../lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: UploadedPhoto[]) => Promise<void> | void;
}

export interface UploadedPhoto {
  id: string;
  url: string;
  file: File;
  eventTitle: string;
  eventDate: string;
  category: string;
  uploadedBy: string;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState(MOCK_EVENTS[0]?.id || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    setSelectedFiles(prev => [...prev, ...imageFiles]);
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    
    const event = MOCK_EVENTS.find(e => e.id === selectedEvent);
    
    const photos: UploadedPhoto[] = selectedFiles.map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      url: previews[i],
      file,
      eventTitle: event?.title || 'General',
      eventDate: event?.date || new Date().toISOString().split('T')[0],
      category: event?.category || 'Social',
      uploadedBy: 'current-user',
    }));

    try {
      await onUpload(photos);
      setIsUploading(false);
      setSelectedFiles([]);
      setPreviews([]);
      onClose();
    } catch (err) {
      console.error("Upload error in modal:", err);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setIsDragging(false);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-[#1a1a2e] rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 dark:border-[#2a2a3e]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2a2a3e]">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Photos</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Share your campus memories</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-[#16213e]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Event Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Associate with Event
              </label>
              <select
                value={selectedEvent}
                onChange={e => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#2a2a3e] bg-white dark:bg-[#16213e] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all"
              >
                {MOCK_EVENTS.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
                isDragging
                  ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-[#16213e] scale-[1.02]"
                  : "border-slate-200 dark:border-[#2a2a3e] hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#16213e]"
              )}
            >
              <div className="w-14 h-14 bg-slate-100 dark:bg-[#16213e] text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                <Upload size={28} />
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                {isDragging ? 'Drop files here' : 'Click or drag photos here'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
            </div>

            {/* Preview Thumbnails */}
            {previews.length > 0 && (
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  {previews.length} photo{previews.length > 1 ? 's' : ''} selected
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {previews.map((preview, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-100 dark:border-[#2a2a3e]">
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#16213e] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center",
                selectedFiles.length === 0 || isUploading
                  ? "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                  : "bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg"
              )}
            >
              {isUploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900 rounded-full mr-2"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
