import axios from "axios";
import { backEndUrl } from "../../context/UrlContextProvider";

export async function setUpMusicKit(
	authorized,
	setAuthorized,
	setApplePlayer,
	setAppleToken
) {
	try {
		const res = await axios.get(backEndUrl + "/apple/token");
		const devToken = res.data.token;
		setAppleToken(devToken);

		if (window.MusicKit && !authorized) {
			let configData = {
				developerToken: devToken,
				app: {
					name: "MusicKit Web App",
					build: "1.0.0",
				},
			};

			const setupMusicKit = new Promise((resolve) => {
				let musicKitInstance = window.MusicKit.configure(configData);
				resolve(musicKitInstance);
			});

			try {
				const musicKitInstance = await setupMusicKit;
				await musicKitInstance.authorize();
				setApplePlayer(musicKitInstance);
				setAuthorized(true);
			} catch (err) {}
		}
	} catch (err) {
		console.log(err);
	}
}
