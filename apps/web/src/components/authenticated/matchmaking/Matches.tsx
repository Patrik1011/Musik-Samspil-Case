import { useState, useEffect } from "react";
import { matchmakingService } from "../../../services/MatchmakingService";
import { LoadingState } from "../applications/states/LoadingState";
import { StatusMessage } from "./StatusMessage";

interface Match {
  _id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  ensemble_id: string;
  created_at: string;
}

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <div
          key={match._id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {match.user.first_name} {match.user.last_name}
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>Email: {match.user.email}</p>
            <p>Phone: {match.user.phone_number}</p>
            <p className="text-sm text-gray-400">
              Matched on: {new Date(match.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
