import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const LocationProvider = ({ children }) => {
  const [fullAddress, setFullAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [accessToken, setAccessToken] = useState(""); // ✅ Added Access Token State

  return (
    <AppContext.Provider
      value={{
        fullAddress,
        setFullAddress,
        pincode,
        setPincode,
        landmark,
        setLandmark,
        lat,
        setLat,
        lon,
        setLon,
        accessToken,      // ✅ Provide access token globally
        setAccessToken,   // ✅ Function to update access token
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
