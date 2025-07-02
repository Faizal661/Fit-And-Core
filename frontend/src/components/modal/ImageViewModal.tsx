import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

interface ImageViewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageViewModal = ({ imageUrl, onClose }: ImageViewModalProps) => {
  if (!imageUrl) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeIn}
    >
      <motion.div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-6 -right-8 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:cursor-pointer focus:outline-none hover:ring-2 hover:ring-white"
          aria-label="Close image modal"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="Enlarged document view"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-md"
        />
      </motion.div>
    </motion.div>
  );
};

export default ImageViewModal;
