import { motion } from "framer-motion";
import { X, Flag, Send } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitReport } from "../../../services/session/reportService";
import { SubmitReportData } from "../../../types/report.types";
import { useToast } from "../../../context/ToastContext";
import { spinner } from "../Spinner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  reportedUserId: string;
  reporterType: "trainer" | "trainee";
}

export const ReportModal = ({
  isOpen,
  onClose,
  bookingId,
  reportedUserId,
  reporterType,
}: ReportModalProps) => {
  const [reportMessage, setReportMessage] = useState("");
  const { showToast } = useToast();

  const reportMutation = useMutation({
    mutationFn: (data: SubmitReportData) => submitReport(data),
    onSuccess: () => {
      showToast("success", "Report submitted successfully.");
      setReportMessage("");
      onClose();
    },
    onError: (error) => {
      showToast("error", error.message || "Failed to submit report");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reportMessage.trim()) {
      reportMutation.mutate({
        bookingId,
        reportedUserId,
        message: reportMessage.trim(),
        reporterType,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 h-dvh">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Flag className="text-red-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800">
                Report an Issue
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={reportMutation.isPending}
            >
              <X size={20} />
            </button>
          </div>

          {/* <div className="flex items-start gap-3 mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="text-amber-600 mt-0.5" size={16} />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Before reporting:</p>
              <p>Please try to resolve the issue directly with the other party first. Reports are reviewed by our admin team.</p>
            </div>
          </div> */}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="reportMessage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Describe the Issue
              </label>
              <textarea
                id="reportMessage"
                value={reportMessage}
                onChange={(e) => setReportMessage(e.target.value)}
                placeholder="Please provide details about the issue you're experiencing..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
                disabled={reportMutation.isPending}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {reportMessage.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={reportMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reportMutation.isPending || !reportMessage.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {reportMutation.isPending ? (
                  spinner
                ) : (
                  <>
                    <Send size={16} />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
