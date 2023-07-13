import React, { createContext, useState } from "react";

export const UrlContext = createContext();
export const frontEndUrl =
	process.env.NODE_ENV === "production"
		? "https://listeninglobby.com"
		: "http://localhost:3000";
export const backEndUrl =
	process.env.NODE_ENV === "production"
		? "https://listening-lobby-backend.onrender.com"
		: "http://localhost:8888";

export function UrlContextProvider({ children }) {
	const [frontEndBaseUrl, setFrontEndBaseUrl] = useState(frontEndUrl);
	const [backEndBaseUrl, setbackEndBaseUrl] = useState(backEndUrl);

	return (
		<UrlContext.Provider
			value={{
				frontEndBaseUrl,
				backEndBaseUrl,
			}}>
			{children}
		</UrlContext.Provider>
	);
}
