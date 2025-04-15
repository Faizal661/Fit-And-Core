import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trainer } from "../../../types/trainer.type";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Skeleton } from "@mui/material";
import Footer from "../../../components/shared/Footer";
import { getSubscribedTrainers } from "../../../services/trainer/trainerService";

const TrainersPage = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");

  const {
    data: subscribedTrainers = [],
    isLoading,
    // error,
  } = useQuery<Trainer[]>({
    queryKey: ["subscribedTrainers", userId],
    queryFn: () => getSubscribedTrainers(userId),
  });

  const handleFindNewTrainers = () => {
    navigate("/find-trainers");
  };

  return (
    <div>
      <div className="min-h-screen bg-white p-8 pt-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-xl text-gray-800">My trainers</h1>
            <button
              onClick={handleFindNewTrainers}
              className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Find trainers
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton height={120} animation="wave" />
              <Skeleton height={120} animation="wave" />
              <Skeleton height={120} animation="wave" />
            </div>
          ) : (
            <div>
              {subscribedTrainers.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  You haven't subscribed to any trainers yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscribedTrainers.map((trainer) => (
                    <div
                      key={trainer._id}
                      className="border border-gray-100 p-6"
                    >
                      <h2 className="text-base mb-3">{trainer.username}</h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {trainer.specialization}
                      </p>
                      <p className="text-xs text-gray-400">
                        {trainer.yearsOfExperience} experience
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrainersPage;
