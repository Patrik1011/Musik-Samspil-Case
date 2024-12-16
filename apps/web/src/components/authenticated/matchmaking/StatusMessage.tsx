interface StatusMessageProps {
  message: string;
  type?: "error" | "info";
}

export const StatusMessage = ({ message, type = "info" }: StatusMessageProps) => (
  <div
    className={`text-center p-8 rounded-lg ${
      type === "error" ? "text-red-500 bg-red-50" : "text-gray-600 bg-gray-50"
    }`}
  >
    {message}
  </div>
);
