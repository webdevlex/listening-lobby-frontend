import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContextProvider";
import { UrlContext } from "../../context/UrlContextProvider";

function SocketHandler({
	user,
	setUser,
	setMembers,
	setMessages,
	setQueue,
	setPlayerStatus,
	setButtonsClickable,
	setAlbums,
	setTracks,
	setDisplayAlbumQuestion,
	setAlbumMissingOn,
	beenAdded,
	setAdminId,
	setSearchLoading,
	setFullAlbum,
	setDisplayFullAlbum,
	setShuffle,
}) {
	const params = new URLSearchParams(window.location.search);
	const token = params.get("token");
	const refresh_token = params.get("refresh_token");
	const [socket] = useContext(SocketContext);
	const { frontEndBaseUrl } = useContext(UrlContext);

	useEffect(() => {
		const localStorageData = JSON.parse(localStorage.getItem("user"));

		if (!user) {
			if (localStorageData.authorized) {
				localStorageData.authorized = false;
				localStorage.setItem("user", JSON.stringify(localStorageData));
			} else {
				socket.disconnect();
				// const url =
				// 	process.env.NODE_ENV === "production" ? "." : "http://localhost:3000";

				window.location.replace(frontEndBaseUrl);
			}
			setUser({ ...localStorageData, token, refresh_token });
		} else {
			socket.emit("attemptJoinLobby", {
				lobby_id: localStorageData.lobby_id,
				username: localStorageData.username,
				token: token,
				refresh_token: refresh_token,
				music_provider: localStorageData.music_provider,
				frontEndId: localStorageData.frontEndId,
			});

			socket.on("lobbyMessage", (lobbyMessages) => {
				setMessages(lobbyMessages);
			});

			socket.on("lobbyMaxReached", () => {
				localStorage.setItem("capacity", JSON.stringify({ maxReached: true }));
				// const url =
				// 	process.env.NODE_ENV === "production" ? "." : "http://localhost:3000";
				window.location.replace(frontEndBaseUrl);
			});

			socket.on("setLobbyInfo", (members, lobbyMessages) => {
				setMembers(members);
				setMessages(lobbyMessages);
			});

			socket.on("setMembers", (members) => {
				setMembers(members);
			});

			socket.on("addSong", (queue) => {
				var element = window;
				var event = new Event("resize");
				element.dispatchEvent(event);
				setQueue(queue);
			});

			socket.on("setAdminsPlayerStatus", (playerData) => {
				setPlayerStatus(playerData);
			});

			socket.on("deactivateButtons", () => {
				setButtonsClickable(false);
			});

			socket.on("activateButtons", () => {
				setButtonsClickable(true);
			});

			socket.on("getUserReady", () => {
				socket.emit("userReady", { user });
			});

			socket.on("questionAlbumAdd", (missingOn) => {
				setAlbumMissingOn(missingOn);
				setDisplayAlbumQuestion(true);
			});

			socket.on("uniSearchResults", ({ tracks, albums }) => {
				setSearchLoading(false);
				setAlbums(albums);
				setTracks(tracks);
			});

			socket.on("addCheck", (musicItemId) => {
				beenAdded.current = [...beenAdded.current, musicItemId];
			});

			socket.on("setAdmin", (adminId) => {
				setAdminId(adminId);
			});

			socket.on("kickUser", () => {
				localStorage.setItem("loadingTooLong", true);
				// const url =
				// 	process.env.NODE_ENV === "production" ? "." : "http://localhost:3000";
				window.location.replace(frontEndBaseUrl);
			});

			socket.on("displayAlbum", (tracks) => {
				setFullAlbum(tracks);
				setDisplayFullAlbum(true);
			});

			socket.on("shuffleToggled", (shuffleMode) => {
				setShuffle(shuffleMode);
			});
		}
	}, [
		socket,
		token,
		refresh_token,
		setMembers,
		setMessages,
		setUser,
		setQueue,
		setPlayerStatus,
		setButtonsClickable,
		user,
		setAlbums,
		setTracks,
		setDisplayAlbumQuestion,
		setAlbumMissingOn,
		beenAdded,
		setAdminId,
		setSearchLoading,
		setFullAlbum,
		setDisplayFullAlbum,
		setShuffle,
	]);

	return null;
}

export default SocketHandler;
