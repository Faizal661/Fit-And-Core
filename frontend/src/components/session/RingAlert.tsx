import { UserIcon } from "lucide-react";

interface RingAlertProps {
  callerInfo: {
    id: string;
    type: "trainer" | "trainee";
    name: string;
    profilePicture: string;
  };
  onAccept: () => void;
  onReject: () => void;
}

export const RingAlert = ({
  callerInfo,
  onAccept,
  onReject,
}: RingAlertProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        <div className="mb-4">
          {callerInfo.profilePicture ? (
            <img
              src={callerInfo.profilePicture}
              alt="Caller"
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">
          Incoming Call from {callerInfo.name}{" "}
          {/* {callerInfo.type === "trainer" ? "Trainer" : "Trainee"} */}
        </h3>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onReject}
            className="px-8 bg-red-500 py-2 rounded-sm font-bold cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-8 bg-green-500 py-2 rounded-sm font-bold cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
