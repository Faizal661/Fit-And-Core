import { motion } from 'framer-motion';
import { X, MessageSquare, Video, User } from 'lucide-react';
import { UserBooking } from '../../../types/session.type';

interface BookingModalProps {
  booking: UserBooking | null;
  onClose: () => void;
  currentUserType: 'trainer' | 'trainee'; // To highlight who is viewing
}

export const BookingModal = ({ booking, onClose, currentUserType }: BookingModalProps) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* User/Trainer Information Section */}
            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${currentUserType === 'trainee' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {currentUserType === 'trainee' ? 'Your Trainer' : 'Your Trainee'}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                    {currentUserType === 'trainee' ? (
                      booking.trainer?.profilePicture ? (
                        <img
                          src={booking.trainer.profilePicture}
                          alt={`${booking.trainer.username}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-blue-600" size={20} />
                      )
                    ) : (
                      booking.trainee?.profilePicture ? (
                        <img
                          src={booking.trainee.profilePicture}
                          alt={`${booking.trainee.username}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-blue-600" size={20} />
                      )
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {currentUserType === 'trainee' 
                        ? booking.trainer?.username || 'Unknown Trainer'
                        : booking.trainee?.username || 'Unknown Trainee'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentUserType === 'trainee' ? 'Professional Trainer' : 'Trainee'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Details Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(booking.slotStart).toLocaleDateString([], {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {booking.slotDetails.startTime} - {booking.slotDetails.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${
                    booking.status === 'confirmed' ? 'text-green-600' :
                    booking.status === 'canceled' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageSquare size={16} />
              Chat
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Video size={16} />
              Start Video Call
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};