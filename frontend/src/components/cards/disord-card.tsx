

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
        const { data } = await axios.get("https://journey-genie-v2.onrender.com/api/details"); // http://localhost:8080/api/details
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

        // // Handling activity
        // if (user.activities.length) {
        //   const firstActivity = user.activities[0];
        //   activity =
        //     firstActivity.state && firstActivity.state !== "No Details"
        //       ? `${firstActivity.name}: ${firstActivity.state}`
        //       : firstActivity.name;

        //   if (firstActivity.timestamps?.start) {
        //     elapsedTime = Date.now() - firstActivity.timestamps.start;
        //   }
        // }




        // Discord Activity Display Fix
        // Problem
        // I had an issue with my Discord status component where it was displaying my Spotify activity even when I had other applications like Visual Studio Code running. I wanted the component to prioritize showing other activities over Spotify.
        // Solution
        // I modified the activity selection logic to filter out Spotify from the activities list when other applications are running. Here's what I did:
        
        // Identified that the issue was in the activity selection code, which was always picking the first item from the activities array.
        // Implemented a search function using JavaScript's find() method to look for the first non-Spotify activity in the array.
        // If a non-Spotify activity was found (like VS Code, Valorant, etc.), the component now displays that instead.
        // Added proper TypeScript typing to the function parameters to avoid compilation errors.        


        // Inside the fetchDiscordData function, replace the current activity handling code with this:
        // Handling activity - prioritize non-Spotify applications
        if (user.activities.length) {
          // Find the first non-Spotify activity
          const nonSpotifyActivity = user.activities.find((act: any)  => act.name !== "Spotify");
          
          // Use the non-Spotify activity if found, otherwise fallback to the first activity
          const selectedActivity = nonSpotifyActivity || user.activities[0];
          
          activity =
            selectedActivity.state && selectedActivity.state !== "No Details"
              ? `${selectedActivity.name}: ${selectedActivity.state}`
              : selectedActivity.name;

          if (selectedActivity.timestamps?.start) {
            elapsedTime = Date.now() - selectedActivity.timestamps.start;
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
        {/* bg-[#2d2f38] */}
        <div className="bg-[rgba(45,47,56,0.5)] absolute top-0 left-0 right-0 h-24 rounded-t-2xl">  
          {/* Discord Icon */}
          <div className={`absolute top-3 right-3 p-3 rounded-full shadow-md ${resolvedTheme === "dark" ? "bg-[#291e40]" : "bg-[#b0b5bf]"}`}>
            <FaDiscord size={40} className={resolvedTheme === "dark" ? "text-green" : "text-black"} />
          </div>

          {/* Profile Picture - Overlapping the card */}
          <div className="absolute -bottom-8 left-4">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-4 border-[#e6eaf0] "
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
              resolvedTheme === "dark" ? "bg-[rgba(45,47,56,0.5)]" : "bg-[rgba(45,47,56,0.5)]"
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
              ): discordData.activity.startsWith("OneNote") ? (
                <img
                  src="/tech-icons/onenote.svg"
                  alt="OneNote Icon"
                  className="w-10 h-10 rounded-md bg-gray-700"
                />
              ) : discordData.activity.startsWith("Brave") ? (
                <img
                  src="/tech-icons/brave.svg"
                  alt="Brave Icon"
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
        {/* <div
          className="absolute bottom-4 right-4 flex items-center justify-center p-1 rounded-full transition-all duration-300
            bg-yellow-400 text-black hover:ring-2 hover:ring-yellow-500 "
        > */}
        <div
          className="absolute bottom-4 right-4 flex items-center justify-center p-1 rounded-full transition-all duration-300
            "
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
