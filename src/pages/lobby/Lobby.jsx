import React, { useState, useContext, useEffect, useRef } from "react";
import DesignatedPlayer from "../../components/designated-player/DesignatedPlayer";
import LobbyMembers from "../../components/lobby-members/LobbyMembers";
import LobbyMessages from "../../components/lobby-messages/LobbyMessages";
import LobbySettings from "../../components/lobby-settings/LobbySettings";
import LobbyCenter from "../../components/lobby-center/LobbyCenter";
import SocketHandler from "../../components/socket-handler/SocketHandler";
import AlbumPopup from "../../components/album-popup/AlbumPopup";
import socketio from "socket.io-client";
import LobbyLoading from "../../components/lobby-loading/LobbyLoading";
import InvitePopup from "../../components/invite-popup/InvitePopup";
import { SocketContext } from "../../context/SocketContextProvider";
import { PlayersContext } from "../../context/PlayersContextProvider";
import useWindowSize from "../../hooks/hooks";

import "./lobby.scss";
import { use } from "express/lib/router";
import { UrlContext } from "../../context/UrlContextProvider";

function Lobby() {
	const { frontEndBaseUrl, backEndBaseUrl } = useContext(UrlContext);
	const [width] = useWindowSize();

	// Context
	const [socket, setSocket] = useContext(SocketContext);
	const { apple } = useContext(PlayersContext);
	const [applePlayer] = apple;

	// State managament
	const [playerStatus, setPlayerStatus] = useState(null);
	const [members, setMembers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [queue, setQueue] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [centerDisplay, setCenterDisplay] = useState("player");
	const [likedSongs, setLikedSongs] = useState([]);
	const [albums, setAlbums] = useState([]);
	const [tracks, setTracks] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [displayAlbumQuestion, setDisplayAlbumQuestion] = useState(false);
	const [displayInvitePopup, setDisplayInvitePopup] = useState(false);
	const [albumMissingOn, setAlbumMissingOn] = useState(null);
	const beenAdded = useRef([]);
	const [adminId, setAdminId] = useState(null);
	const [fullAlbum, setFullAlbum] = useState(null);
	const [displayFullAlbum, setDisplayFullAlbum] = useState(false);
	const [shuffle, setShuffle] = useState(false);

	// Timebar
	const [percent, setPercent] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	// Loaders
	const [buttonsClickable, setButtonsClickable] = useState(true);

	useEffect(() => {
		const inProduction = process.env.NODE_ENV === "production";
		if (!socket) {
			// const url = inProduction ? "" : "http://localhost:8888";
			setSocket(socketio.connect(backEndBaseUrl));
		}

		return () => {
			if (socket) {
				// const url = inProduction ? "." : "http://localhost:3000";
				window.location.replace(frontEndBaseUrl);
			}
		};
	}, [applePlayer, setSocket, socket]);

	return socket ? (
		<div className="lobby">
			<SocketHandler
				user={user}
				setUser={setUser}
				setMembers={setMembers}
				setMessages={setMessages}
				setQueue={setQueue}
				setPlayerStatus={setPlayerStatus}
				setButtonsClickable={setButtonsClickable}
				setAlbums={setAlbums}
				setTracks={setTracks}
				setDisplayAlbumQuestion={setDisplayAlbumQuestion}
				setAlbumMissingOn={setAlbumMissingOn}
				beenAdded={beenAdded}
				setAdminId={setAdminId}
				setSearchLoading={setSearchLoading}
				setFullAlbum={setFullAlbum}
				setDisplayFullAlbum={setDisplayFullAlbum}
				setShuffle={setShuffle}
			/>

			{!playerStatus ? (
				<>
					<h1>Loading 1</h1>
					<LobbyLoading />
				</>
			) : (
				<>
					<div className={`player-grid ${loading ? "hide" : null}`}>
						<DesignatedPlayer
							user={user}
							playerStatus={playerStatus}
							queue={queue}
							setLoading={setLoading}
							buttonsClickable={buttonsClickable}
							loading={loading}
							setPlaying={setPlaying}
							playing={playing}
							likedSongs={likedSongs}
							setLikedSongs={setLikedSongs}
							percent={percent}
							setPercent={setPercent}
							currentTime={currentTime}
							setCurrentTime={setCurrentTime}
							shuffle={shuffle}
							setShuffle={setShuffle}
						/>
					</div>
					{loading ? (
						<>
							<h1>Loading 2</h1>
							<LobbyLoading />
						</>
					) : (
						<>
							<AlbumPopup
								displayAlbumQuestion={displayAlbumQuestion}
								setDisplayAlbumQuestion={setDisplayAlbumQuestion}
								albumMissingOn={albumMissingOn}
								user={user}
							/>

							{width > 850 ? (
								<InvitePopup
									displayInvitePopup={displayInvitePopup}
									setDisplayInvitePopup={setDisplayInvitePopup}
									user={user}
								/>
							) : null}
							<div className="settings-grid">
								<LobbySettings
									setCenterDisplay={setCenterDisplay}
									setDisplayInvitePopup={setDisplayInvitePopup}
								/>
							</div>
							{width > 850 ? (
								<div className="members-grid">
									<LobbyMembers
										members={members}
										adminId={adminId}
										displayInvitePopup={displayInvitePopup}
										setDisplayInvitePopup={setDisplayInvitePopup}
										user={user}
									/>
								</div>
							) : null}
							{width > 850 ? (
								<div className="messages-grid">
									<LobbyMessages messages={messages} user={user} />
								</div>
							) : null}

							<div className="center-grid">
								<LobbyCenter
									setCenterDisplay={setCenterDisplay}
									centerDisplay={centerDisplay}
									queue={queue}
									user={user}
									buttonsClickable={buttonsClickable}
									likedSongs={likedSongs}
									setLikedSongs={setLikedSongs}
									albums={albums}
									setAlbums={setAlbums}
									tracks={tracks}
									setTracks={setTracks}
									playing={playing}
									lobbyId={user.lobby_id}
									beenAdded={beenAdded}
									searchLoading={searchLoading}
									setSearchLoading={setSearchLoading}
									percent={percent}
									currentTime={currentTime}
									members={members}
									adminId={adminId}
									setDisplayInvitePopup={setDisplayInvitePopup}
									messages={messages}
									fullAlbum={fullAlbum}
									setFullAlbum={setFullAlbum}
									setDisplayFullAlbum={setDisplayFullAlbum}
									displayFullAlbum={displayFullAlbum}
								/>
							</div>
						</>
					)}
				</>
			)}
		</div>
	) : null;
}

export default Lobby;
