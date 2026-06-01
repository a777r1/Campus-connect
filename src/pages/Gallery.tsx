import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download as LucideDownload, 
  Maximize2, 
  X, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  MapPin,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import UploadModal, { UploadedPhoto } from '../components/gallery/UploadModal';
import DeleteConfirmModal from '../components/gallery/DeleteConfirmModal';
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// Firebase imports
import { db, storage, isFirebaseConfigured } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface GalleryImage {
  id: string;
  url: string;
  eventTitle: string;
  eventDate: string;
  category: string;
  uploadedBy?: string;
  isUserUploaded?: boolean;
  storagePath?: string;
}

export default function Gallery() {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [filter, setFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userPhotos, setUserPhotos] = useState<GalleryImage[]>([]);

  // Load user photos from Firestore if configured
  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.log("Firebase is not configured. Photo uploads will be stored in-memory.");
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "gallery"), (snapshot) => {
      const photos = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          url: data.url,
          eventTitle: data.eventTitle,
          eventDate: data.eventDate,
          category: data.category,
          uploadedBy: data.uploadedBy,
          isUserUploaded: true,
          storagePath: data.storagePath,
        };
      });
      setUserPhotos(photos);
    }, (error) => {
      console.error("Firestore loading error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Flatten all gallery images from mock events
  const mockImages: GalleryImage[] = MOCK_EVENTS.flatMap(event => 
    (event.gallery || []).map((img, idx) => ({
      id: `mock-${event.id}-${idx}`,
      url: img,
      eventTitle: event.title,
      eventDate: event.date,
      category: event.category,
      isUserUploaded: false,
    }))
  );

  const allImages = [...mockImages, ...userPhotos];

  const filteredImages = filter === 'All' 
    ? allImages 
    : allImages.filter(img => img.category === filter);

  const categories = ['All', 'Academic', 'Social', 'Sports', 'Workshop', 'Cultural'];

  const handleUpload = async (photos: UploadedPhoto[]) => {
    if (isFirebaseConfigured) {
      try {
        for (const photo of photos) {
          const uniqueId = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const storagePath = `gallery/${uniqueId}_${photo.file.name}`;
          const storageRef = ref(storage, storagePath);
          
          // Upload to Firebase Storage
          await uploadBytes(storageRef, photo.file);
          const downloadUrl = await getDownloadURL(storageRef);

          // Add document to Firestore
          await addDoc(collection(db, "gallery"), {
            url: downloadUrl,
            eventTitle: photo.eventTitle,
            eventDate: photo.eventDate,
            category: photo.category,
            uploadedBy: user?.id || 'anonymous',
            uploadedAt: new Date().toISOString(),
            storagePath,
          });
        }
        showToast(`${photos.length} photo${photos.length > 1 ? 's' : ''} uploaded to Firebase successfully!`, 'success');
      } catch (error) {
        console.error("Firebase upload failed:", error);
        showToast("Firebase upload failed. Falling back to local preview.", "error");
        
        // Local preview fallback
        const newImages: GalleryImage[] = photos.map(p => ({
          id: p.id,
          url: p.url,
          eventTitle: p.eventTitle,
          eventDate: p.eventDate,
          category: p.category,
          uploadedBy: p.uploadedBy,
          isUserUploaded: true,
        }));
        setUserPhotos(prev => [...prev, ...newImages]);
      }
    } else {
      // Local/Sandbox in-memory upload
      const newImages: GalleryImage[] = photos.map(p => ({
        id: p.id,
        url: p.url,
        eventTitle: p.eventTitle,
        eventDate: p.eventDate,
        category: p.category,
        uploadedBy: p.uploadedBy,
        isUserUploaded: true,
      }));
      setUserPhotos(prev => [...prev, ...newImages]);
      showToast(`${photos.length} photo${photos.length > 1 ? 's' : ''} uploaded locally! (Firebase not configured)`, 'success');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    if (isFirebaseConfigured && !deleteTarget.id.startsWith('mock-')) {
      try {
        // Delete file from Firebase Storage
        if (deleteTarget.storagePath) {
          const storageRef = ref(storage, deleteTarget.storagePath);
          await deleteObject(storageRef);
        }

        // Delete document from Firestore
        await deleteDoc(doc(db, "gallery", deleteTarget.id));
        
        setIsDeleting(false);
        setDeleteTarget(null);
        showToast('Photo deleted from Firebase successfully!', 'success');
      } catch (error) {
        console.error("Firebase deletion failed:", error);
        showToast("Deletion failed. Removing from local view.", "error");
        
        // Remove locally as fallback
        setUserPhotos(prev => prev.filter(p => p.id !== deleteTarget.id));
        setIsDeleting(false);
        setDeleteTarget(null);
      }
    } else {
      // Sandbox delete
      setTimeout(() => {
        setUserPhotos(prev => prev.filter(p => p.id !== deleteTarget.id));
        setIsDeleting(false);
        setDeleteTarget(null);
        showToast('Photo deleted locally!', 'success');
      }, 800);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Campus Memory Wall</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Hand-picked highlights from across all campus events</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg shadow-slate-900/20 dark:shadow-white/10"
          >
            <Plus size={20} />
            <span>Upload Photos</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-6 mb-8 scrollbar-hide">
        <div className="flex items-center px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e] text-slate-500 dark:text-slate-400 mr-2">
          <Filter size={18} className="mr-2" />
          <span className="text-sm font-bold">Filter</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
              filter === cat 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10" 
                : "bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-[#2a2a3e] text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-dashed border-slate-300 dark:border-[#2a2a3e]">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No photos found for this category.</p>
          {isAuthenticated && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 text-slate-900 dark:text-white font-bold hover:underline"
            >
              Upload the first one!
            </button>
          )}
        </div>
      )}

      {/* Masonry-style Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group rounded-3xl overflow-hidden bg-slate-100 dark:bg-[#16213e] break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <img 
              src={img.url} 
              alt={img.eventTitle}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-end">
              <span className="inline-block w-fit px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest mb-2 border border-white/20">
                {img.category}
              </span>
              <h3 className="text-white font-bold text-lg mb-1">{img.eventTitle}</h3>
              <div className="flex items-center text-slate-400 text-xs mb-6">
                <Calendar size={12} className="mr-1" />
                <span>{img.eventDate}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => { setPhotoIndex(idx); setIsOpen(true); }}
                  className="flex-1 py-3 bg-white text-slate-900 rounded-xl text-center text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center shadow-lg"
                >
                  <Maximize2 size={14} className="mr-2" /> View Full
                </button>
                {img.isUserUploaded && isAuthenticated && (
                  <button
                    onClick={() => setDeleteTarget(img)}
                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    title="Delete photo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                {!img.isUserUploaded && (
                  <a 
                    href={img.url}
                    download
                    onClick={e => e.stopPropagation()}
                    className="p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors shadow-lg"
                  >
                    <LucideDownload size={16} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={filteredImages.map(img => ({ 
          src: img.url,
          title: img.eventTitle,
          description: `${img.category} • ${img.eventDate}`
        }))}
        plugins={[Download, Zoom, Thumbnails]}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        imageUrl={deleteTarget?.url || ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
}
