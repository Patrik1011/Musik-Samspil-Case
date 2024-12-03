import { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { Ensemble } from "../../../services/EnsembleService";
import { matchmakingService } from "../../../services/MatchmakingService";

export const Matchmaking = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [currentIndex] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const recommendations = await matchmakingService.getRecommendations({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setEnsembles(recommendations);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, []);

  const onSwipe = async (direction: string, ensembleId: string) => {
    const liked = direction === "right";
    try {
      await matchmakingService.createMatch(ensembleId, liked);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-sm">
        {ensembles.map((ensemble, index) => (
          <TinderCard
            key={ensemble._id}
            onSwipe={(dir) => onSwipe(dir, ensemble._id)}
            preventSwipe={["up", "down"]}
            className={`absolute ${index === currentIndex ? "z-10" : "z-0"}`}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 h-[32rem]">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{ensemble.name}</h2>
                <p className="text-gray-600 mb-4">{ensemble.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Location</h4>
                    <p className="text-gray-600">
                      {ensemble.location.city}, {ensemble.location.country}
                    </p>
                  </div>

                  {ensemble.open_positions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Open Positions</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ensemble.open_positions.map((position) => (
                          <span
                            key={position}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-steel-blue bg-opacity-10 text-steel-blue"
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
        ))}
      </div>
    </div>
  );
};
