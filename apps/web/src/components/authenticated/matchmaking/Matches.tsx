import { useState, useEffect } from "react";
import { matchmakingService } from "../../../services/MatchmakingService";
import { LoadingState } from "../applications/states/LoadingState";
import { StatusMessage } from "./StatusMessage";
import { Match } from "../../../utils/types";

export const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await matchmakingService.getMatches();
      console.log(data);
      setMatches(data);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <StatusMessage message={error} type="error" />;
  if (matches.length === 0) return <StatusMessage message="No matches found yet" />;

  return (
    <div className="grid grid-cols-1 gap-6 p-4 max-w-7xl mx-auto">
      {matches.map((match) => (
        <div
          key={match._id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-md mx-auto"
        >
          {/* Ensemble Section */}
          <div className="p-6 bg-steel-blue bg-opacity-5">
            <h3 className="text-xl font-semibold text-steel-blue mb-2">{match.ensemble.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{match.ensemble.description}</p>
          </div>

          {/* User Match Section */}
          <div className="p-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Matched with</h4>
              <div className="flex items-center space-x-2">
                <p className="text-steel-blue font-medium mt-2">
                  {match.user.first_name} {match.user.last_name}
                </p>
                {match.user.instruments && (
                  <span className="inline-block mt-2 px-3 py-1 bg-steel-blue bg-opacity-10 text-steel-blue rounded-full text-sm">
                    {match.user.instruments.join(", ")}
                  </span>
                )}
              </div>

              {match.user.bio && (
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-1">About</h4>
                  <p className="text-gray-600 text-sm">{match.user.bio}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Email"
                  >
                    <title>Email</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">{match.user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Phone"
                  >
                    <title>Phone</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-sm">{match.user.phone_number}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Matched on: {new Date(match.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
