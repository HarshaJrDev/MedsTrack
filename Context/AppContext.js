import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const LocationProvider = ({ children }) => {
  const [fullAddress, setFullAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [accessToken, setAccessToken] = useState("");

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
        accessToken,      
        setAccessToken,   
      }}>
      {children}
    </AppContext.Provider>
  );
};
