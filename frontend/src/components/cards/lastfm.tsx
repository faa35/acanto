
import CardWrapper from "@/components/cards/card-wrapper"; // Import CardWrapper
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpotify } from "react-icons/fa";
import SendmessageIcon from "../lottie-ui/send-message"; // Assuming you have this component available
import { useTheme } from "next-themes"; // Import to manage theme

const LastfmCard = () => {
  const [lastFmDetails, setLastFmDetails] = useState({
    lastFmApiKey: "",
    lastFmUsername: "",
  });

  const [songData, setSongData] = useState({
    songName: "",
    artistName: "",
    albumArtUrl: "",
    isNowPlaying: false,
  });

  const { resolvedTheme } = useTheme(); // Get current theme (light or dark)

  useEffect(() => {
    // Fetch Last.fm API Key and Username from the backend
    axios
      .get("http://localhost:8080/api/details")
      .then((response) => {
        const { lastFmApiKey, lastFmUsername } = response.data;
        setLastFmDetails({ lastFmApiKey, lastFmUsername });

        // Fetch the last played song using the Last.fm API
        return axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUsername}&api_key=${lastFmApiKey}&format=json`
        );
      })
      .then((response) => {
        const track = response.data.recenttracks.track[0];
        const isNowPlaying = track["@attr"]?.nowplaying === "true";
        const songName = track.name;
        const artistName = track.artist["#text"];
        const albumArtUrl = track.image[3]["#text"] || "";

        setSongData({ songName, artistName, albumArtUrl, isNowPlaying });
      })
      .catch((error) => {
        console.error("Error fetching Last.fm data:", error);
      });
  }, []);

  return (
    <CardWrapper>
      {/* Card Wrapper ensures the outer container styling */}
      <div className="text-white rounded-3xl p-8 h-full flex flex-col lg:flex-row gap-8 justify-between relative shadow-lg">
        {/* Spotify Icon */}
        <div className="absolute top-4 right-4 bg-[#e4d8b4] p-4 rounded-full shadow-md">
          <FaSpotify size={30} className="text-black" />
        </div>

        {/* Last Played Track */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Larger Album Art */}
          <img
            src={songData.albumArtUrl || "/default-album-art.jpg"}
            alt="Track Cover"
            className={`ml-[-5px] w-64 h-64 lg:w-80 lg:h-80 rounded-3xl border border-gray-700 
  ${resolvedTheme === "dark" ? "grayscale-0" : "grayscale"} 
  hover:grayscale-0 transition-all duration-300`}
          />

          {/* Song Info */}
          <div className="lg:ml-0 mt-8">
            <p className="text-yellow-400 text-base mb-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
              {songData.isNowPlaying ? "Now Playing..." : "Last played..."}
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight mb-2">
              {songData.songName || "Unknown Song"}
            </h2>
            <p className="font-bold  text-xl">
              <span className="font-normal text-gray-300">by </span>
              {songData.artistName || "Unknown Artist"}
            </p>
          </div>
        </div>

        {/* External Link Button using SendmessageIcon */}
        <div
          className="absolute bottom-4 right-4 flex items-center justify-center p-1 rounded-full transition-all duration-300
            bg-yellow-400 text-black hover:ring-2 hover:ring-yellow-500"
        >
          <SendmessageIcon
            link={`https://www.last.fm/user/${lastFmDetails.lastFmUsername}`}
            lottieName="SendMessageIconLastfm" // Ensure that the lottieName is unique for each animation. This way, the animations will not overlap or interfere with one another.
            
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default LastfmCard;
