import TinderCard from "react-tinder-card";
import { Ensemble } from "../../../services/EnsembleService";

interface MatchCardProps {
  ensemble: Ensemble;
  onSwipe: (direction: string, ensembleId: string) => void;
}

export const MatchCard = ({ ensemble, onSwipe }: MatchCardProps) => (
  <TinderCard onSwipe={(dir) => onSwipe(dir, ensemble._id)} preventSwipe={["up", "down"]}>
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 mx-auto h-96">
      <div className="p-4 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{ensemble.name}</h2>
          <p className="text-gray-600 mb-6">{ensemble.description}</p>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Location</h4>
            <p className="text-gray-600">
              {ensemble.location.city}, {ensemble.location.country}
            </p>
          </div>
          {ensemble.open_positions.length > 0 && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Open Positions</h4>
              <div className="flex flex-wrap gap-2">
                {ensemble.open_positions.map((position) => (
                  <span
                    key={position}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-steel-blue bg-opacity-10 text-steel-blue"
                  >
                    {position}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </TinderCard>
);
