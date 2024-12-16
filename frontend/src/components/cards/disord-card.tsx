

import CardWrapper from "@/components/cards/card-wrapper";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDiscord } from "react-icons/fa";
import SendmessageIcon from "../lottie-ui/send-message"; // Import SendmessageIcon
import { useTheme } from "next-themes"; // Import for theme management

interface DiscordData {
  username: string;
  avatar: string;
  status: string;
  platform: string;
  activity: string;
  globalName: string; // Added global name field
  elapsedTime: number | null;
}

const DiscordCard = () => {
  const [discordData, setDiscordData] = useState<DiscordData>({
    username: "",
    avatar: "",
    status: "",
    platform: "",
    activity: "",
    globalName: "", // Initialize globalName as empty string
    elapsedTime: null,
  });

  const { resolvedTheme } = useTheme(); // Get current theme (light/dark)

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const { data } = await axios.get("https://acanto7.onrender.com/api/details");
        const discordUserId = data.discordUserId;

        const response = await axios.get(
          `https://api.lanyard.rest/v1/users/${discordUserId}`
        );

        const user = response.data.data;

        const username = `${user.discord_user.username}#${user.discord_user.discriminator}`;
        const avatar = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.png`;
        const status = user.discord_status;

        let platform = "Unknown";
        if (user.active_on_discord_mobile) platform = "Mobile";
        else if (user.active_on_discord_web) platform = "Web";
        else if (user.active_on_discord_desktop) platform = "Desktop";

        let activity = "No activity";
        let elapsedTime: number | null = null;

        // Handling activity
        if (user.activities.length) {
          const firstActivity = user.activities[0];
          activity =
            firstActivity.state && firstActivity.state !== "No Details"
              ? `${firstActivity.name}: ${firstActivity.state}`
              : firstActivity.name;

          if (firstActivity.timestamps?.start) {
            elapsedTime = Date.now() - firstActivity.timestamps.start;
          }
        }

        const globalName = user.discord_user.global_name || ""; // Fetch the global name if available

        setDiscordData({
          username,
          avatar,
          status,
          platform,
          activity,
          globalName, // Store the global name
          elapsedTime,
        });
      } catch (error) {
        console.error("Error fetching Discord data:", error);
      }
    };

    fetchDiscordData();
  }, []);

  useEffect(() => {
    if (discordData.elapsedTime === null) return;

    const intervalId = setInterval(() => {
      setDiscordData((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime !== null ? prev.elapsedTime + 1000 : null,
      }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [discordData.elapsedTime]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <CardWrapper>
      <div
        className="text-white rounded-2xl p-4 h-full flex flex-col gap-4"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "100%",
        }}
      >
        {/* Wide background card - now covering whole top, left, and right */}
        <div className="bg-[#2d2f38] absolute top-0 left-0 right-0 h-24 rounded-t-2xl">
          {/* Discord Icon */}
          <div className="absolute top-4 right-4 bg-[#e4d8b4] p-4 rounded-full shadow-md">
            <FaDiscord size={30} className="text-black" />
          </div>

          {/* Profile Picture - Overlapping the card */}
          <div className="absolute -bottom-8 left-4">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-4 border-[#e6eaf0] ${
                resolvedTheme === "dark" ? "grayscale-0" : "grayscale"
              } hover:grayscale-0 transition-all duration-300`}
            >
              <img
                src={discordData.avatar || "/static/avatar.webp"}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online Status Badge */}
            <div
              className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-[#e6eaf0] ${
                discordData.status === "online" ? "bg-green-500" : "bg-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Adjust spacing to account for overlapping profile picture */}
        <div className="mt-28">
          {/* User Info Section */}
          <div className="mb-4">
            {/* Show global name only if it's available */}
            {discordData.globalName && (
              <h2 className="text-2xl font-bold">{discordData.globalName}</h2>
            )}
            <p className="text-sm ">{discordData.username || "Unknown User"}</p>
            {/* <p className="text-sm">Active on: {discordData.platform || "Unknown"}</p> */}
            <p className="text-sm">{discordData.platform || "Unknown"}</p>
          </div>

          {/* Status Section */}
          <div
            className={`flex items-center justify-between rounded-lg p-4 ${
              resolvedTheme === "dark" ? "bg-[#100524]" : "bg-[#363945]"
            }`}
          >
            <div className="flex items-center gap-3">
              {discordData.activity.startsWith("Visual Studio Code") ? (
                <img
                  src="/tech-icons/vscode.svg"
                  alt="VS Code Icon"
                  className="w-10 h-10 rounded-md bg-gray-700"
                />
              ) : discordData.activity.startsWith("VALORANT") ? (
                <img
                  src="/tech-icons/valorant.svg"
                  alt="Valorant Icon"
                  className="w-10 h-10 rounded-md bg-gray-700"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-md" />
              )}

              <div>
                <h3 className="text-sm font-semibold">
                  {discordData.activity || "No activity!"}
                </h3>
                <p className="text-sm text-gray-400">{discordData.status || "Offline"}</p>
                <p className="text-gray-300 text-md">
                  {discordData.elapsedTime !== null
                    ? formatTime(discordData.elapsedTime)
                    : "No data"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SendmessageIcon Button - made smaller */}
        <div
          className="absolute bottom-4 right-4 flex items-center justify-center p-1 rounded-full transition-all duration-300
            bg-yellow-400 text-black hover:ring-2 hover:ring-yellow-500 "
        >
          <div className="flex items-center justify-center">
            <SendmessageIcon
              link={`https://discord.com/users/${discordData.username}`} // Link to the Discord user profile
              lottieName="SendMessageIcon" // Lottie animation for the icon
            />
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default DiscordCard;
