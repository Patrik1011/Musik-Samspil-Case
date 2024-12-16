import { useState, useEffect } from "react";
import { Ensemble } from "../../../services/EnsembleService";
import { matchmakingService } from "../../../services/MatchmakingService";
import { Container } from "../../Container";
import { MatchCard } from "./MatchCard";
import { LoadingState } from "../applications/states/LoadingState";
import { StatusMessage } from "./StatusMessage";

export const Matchmaking = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [swipeMessage, setSwipeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
            setErrorMessage(error as string);
          } finally {
            setIsLoading(false);
          }
        },
        () => {
          setErrorMessage("Location services are unavailable. Please enable location permissions.");
          setIsLoading(false);
        },
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);

  const onSwipe = async (direction: string, ensembleId: string) => {
    const liked = direction === "right";
    setSwipeMessage(liked ? "Interested!" : "Nahh!");

    try {
      await matchmakingService.createMatch(ensembleId, liked);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setTimeout(() => setSwipeMessage(""), 500);
      }, 300);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (errorMessage) return <StatusMessage message={errorMessage} type="error" />;
    if (ensembles.length === 0) return <StatusMessage message="No ensembles found in your area" />;
    if (currentIndex >= ensembles.length)
      return <StatusMessage message="No more ensembles to show!" />;

    return (
      <div className="relative w-full max-w-sm">
        {ensembles
          .slice(currentIndex)
          .map((ensemble, index) => (
            <div
              key={ensemble._id}
              style={{
                position: index === 0 ? "relative" : "absolute",
                top: 0,
                width: "100%",
              }}
            >
              <MatchCard ensemble={ensemble} onSwipe={onSwipe} />
            </div>
          ))
          .reverse()}
      </div>
    );
  };

  return (
    <Container className="my-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-steel-blue mb-2">Matchmaking</h1>
        <p className="text-gray-600">
          Discover and connect with ensembles near you. Swipe right to like or left to pass.
        </p>
      </div>
      <div className="flex justify-center items-center min-h-[32rem]">{renderContent()}</div>
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
