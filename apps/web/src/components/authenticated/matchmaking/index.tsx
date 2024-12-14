import { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { Ensemble } from "../../../services/EnsembleService";
import { matchmakingService } from "../../../services/MatchmakingService";
import { Container } from "../../Container.tsx";

export const Matchmaking = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [swipeMessage, setSwipeMessage] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const recommendations = await matchmakingService.getRecommendations({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setEnsembles(recommendations);
          } catch (error) {
            console.error("Error fetching recommendations:", error);
            setErrorMessage("Unable to fetch recommendations. Please try again later.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setErrorMessage("Location services are unavailable. Please enable location permissions.");
        },
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
    }
  }, []);

  const onSwipe = async (direction: string, ensembleId: string) => {
    const liked = direction === "right";
    setSwipeMessage(liked ? "Liked!" : "Passed!");

    try {
      await matchmakingService.createMatch(ensembleId, liked);
      // Move to next card after successful swipe
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <Container className="my-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-steel-blue mb-2">Matchmaking</h1>
        <p className="text-gray-600">
          Discover and connect with ensembles near you. Swipe right to like or left to pass.
        </p>
      </div>
      <div className="flex justify-center items-center min-h-[32rem]">
        {errorMessage ? (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{errorMessage}</div>
        ) : currentIndex >= ensembles.length ? (
          <div className="text-gray-600 text-center p-8 bg-gray-50 rounded-lg">
            No more ensembles to show!
          </div>
        ) : (
          <div className="relative w-full max-w-sm">
            {ensembles.slice(currentIndex).map((ensemble, index) => (
              <div
                key={ensemble._id}
                className="transition-opacity duration-300"
                style={{
                  position: index === 0 ? "relative" : "absolute",
                  top: 0,
                  width: "100%",
                }}
              >
                <TinderCard
                  onSwipe={(dir) => onSwipe(dir, ensemble._id)}
                  preventSwipe={["up", "down"]}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 mx-auto">
                    <div className="p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">{ensemble.name}</h2>
                      <p className="text-gray-600 mb-6">{ensemble.description}</p>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-base font-semibold text-gray-900 mb-2">Location</h4>
                          <p className="text-gray-600">
                            {ensemble.location.city}, {ensemble.location.country}
                          </p>
                        </div>

                        {ensemble.open_positions.length > 0 && (
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-2">
                              Open Positions
                            </h4>
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
              </div>
            ))}
          </div>
        )}
      </div>
      {swipeMessage && (
        <div className="mt-6 text-center">
          <span className="text-lg font-bold text-steel-blue bg-steel-blue bg-opacity-10 px-4 py-2 rounded-full">
            {swipeMessage}
          </span>
        </div>
      )}
    </Container>
  );
};
