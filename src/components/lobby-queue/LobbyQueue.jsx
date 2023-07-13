import React, { useState, useContext, useEffect } from 'react';
import QueueTrack from '../queue-track/QueueTrack';
import { SocketContext } from '../../context/SocketContextProvider';
import './lobby-queue.scss';

export default function LobbyQueue({
	queue,
	user,
	buttonsClickable,
	likedSongs,
	setLikedSongs,
	playing,
	setAlbums,
	setTracks,
}) {
	const queueHasItems = queue[0];
	const [hover, setHover] = useState(false);
	const [hoverIndex, setHoverIndex] = useState(false);
	const [socket] = useContext(SocketContext);

	useEffect(() => {
		setTracks([]);
		setAlbums([]);
	}, [setAlbums, setTracks]);

	function handleHover(index) {
		setHoverIndex(index);
		setHover(true);
	}

	function handleDoubleClick(e, index) {
		const nodeName = e.target.nodeName;
		console.log(nodeName);
		if (nodeName === 'DIV') {
			socket.emit('songDoubleClicked', { index, user });
		}
	}

	return (
		<div className='lobby-queue'>
			{queueHasItems &&
				queue.map((song, index) => (
					<div
						className='queue-track'
						key={index}
						onMouseOver={() => handleHover(index)}
						onMouseOut={() => setHover(false)}
						onDoubleClick={(e) => handleDoubleClick(e, index)}>
						<QueueTrack
							song={song}
							index={index}
							buttonsClickable={buttonsClickable}
							setLikedSongs={setLikedSongs}
							likedSongs={likedSongs}
							user={user}
							playing={playing}
							hover={hover}
							hoverIndex={hoverIndex}
						/>
					</div>
				))}
		</div>
	);
}
