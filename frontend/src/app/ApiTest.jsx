import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

const ApiTest = () => {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiClient.get("/health");

        setStatus(
          `Backend connected: ${response.data?.message || "OK"}`
        );
      } catch (error) {
        console.error("Backend connection failed:", error);

        setStatus(
          "Backend connection failed. Check API URL and backend server."
        );
      }
    };

    checkBackend();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          RatinoCare
        </h1>

        <p className="mt-4">
          {status}
        </p>
      </div>
    </main>
  );
};

export default ApiTest;