import { useState, useEffect } from "react";
import { Ensemble } from "../../../services/EnsembleService";
import { matchmakingService } from "../../../services/MatchmakingService";
import { Container } from "../../Container";
import { MatchCard } from "./MatchCard";
import { LoadingState } from "../applications/states/LoadingState";
import { StatusMessage } from "./StatusMessage";
import { Matches } from "./Matches";

type Tab = "feed" | "matches";

const tabs = [
  { name: "Feed", current: true },
  { name: "Matches", current: false, count: 0 },
] as const;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Matchmaking = () => {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [swipeMessage, setSwipeMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tabCounts, setTabCounts] = useState({ matches: 0 });

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
          } catch {
            setErrorMessage("Error fetching ensembles");
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

  useEffect(() => {
    const fetchMatchesCount = async () => {
      try {
        const matches = await matchmakingService.getMatches();
        setTabCounts((prev) => ({ ...prev, matches: matches.length }));
      } catch (error) {
        console.error("Error fetching matches count:", error);
      }
    };

    fetchMatchesCount();
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

  const renderTabs = () => (
    <div>
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as Tab)}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-steel-blue"
        >
          {tabs.map((tab) => {
            const tabKey = tab.name.toLowerCase() as Tab;
            return (
              <option key={tabKey} value={tabKey}>
                {tab.name} {tabKey === "matches" && `(${tabCounts.matches})`}
              </option>
            );
          })}
        </select>
        <svg
          className="pointer-events-none col-start-1 row-start-1 mr-2 h-5 w-5 self-center justify-self-end fill-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const tabKey = tab.name.toLowerCase() as Tab;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={classNames(
                    activeTab === tabKey
                      ? "border-steel-blue text-steel-blue"
                      : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                    "flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                  )}
                  type="button"
                >
                  {tab.name}
                  {tabKey === "matches" && (
                    <span
                      className={classNames(
                        activeTab === tabKey
                          ? "bg-steel-blue bg-opacity-10 text-steel-blue"
                          : "bg-gray-100 text-gray-900",
                        "ml-3 hidden rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block",
                      )}
                    >
                      {tabCounts.matches}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <Container className="my-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-steel-blue mb-2">Matchmaking</h1>
        <p className="text-gray-600">
          {activeTab === "feed"
            ? "Discover and connect with ensembles near you. Swipe right to like or left to pass."
            : "View ensembles that have shown interest in connecting with you."}
        </p>
      </div>
      {renderTabs()}
      <div className="flex justify-center items-center min-h-[32rem]">
        {activeTab === "feed" ? renderContent() : <Matches />}
      </div>
      {activeTab === "feed" && swipeMessage && (
        <div className="mt-6 text-center">
          <span className="text-lg font-bold text-steel-blue bg-steel-blue bg-opacity-10 px-4 py-2 rounded-full">
            {swipeMessage}
          </span>
        </div>
      )}
    </Container>
  );
};
