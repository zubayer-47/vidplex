import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import PlaylistProfileThumbnail from '../../../../components/PlaylistProfileThumbnail';
import useQuery from '../../../../hooks/useQuery';
import { formateTime } from '../../../../libs/helper';
import { PlaylistBodyDataType } from '../../../../types/custom';

type PlaylistProps = {
	isLoading: boolean;
	playlist: PlaylistBodyDataType | undefined;
	vidRef: React.RefObject<HTMLVideoElement>;
};

const Playlist: React.FC<PlaylistProps> = ({ playlist, isLoading, vidRef }) => {
	const query = useQuery();
	const [playlistOpen, setPlaylistOpen] = useState(true);

	const playlistRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!playlistRef.current || !vidRef.current) return;

		const playlistEl = playlistRef.current;
		const vidHeight = vidRef.current.clientHeight;

		// playlistEl.style.maxHeight = `${vidHeight! - 95}px`;
		playlistEl.style.setProperty('--max-height', `${vidHeight - 95}px`);

		window.addEventListener('resize', () => {
			const resizeVidHeight = vidRef.current?.clientHeight;
			// console.log({
			// 	vidRefHeight: vidRef.current?.clientHeight,
			// 	playlistRefHeight: playlistEl?.clientHeight,
			// });

			playlistEl.style.setProperty(
				'--max-height',
				`${resizeVidHeight! - 95}px`
			);
		});
	}, [vidRef]);

	if (isLoading) {
		return (
			<div className='animate-pulse dark:bg-dark-modal'>
				<div className='bg-gray-300/50 p-4 w-full rounded-xl space-y-4'>
					<h1 className='bg-gray-300 h-3.5 w-full rounded-xl'></h1>
					<h1 className='bg-gray-300 h-3 w-4/5 rounded-xl'></h1>
				</div>
			</div>
		);
	}

	// const height = vidRef.current?.clientHeight;

	return (
		<div
			className={`w-full h-fit lg:w-80 xl:w-96 border-indigo-200 dark:border-dark-modal dark:bg-dark-overlay-100/50 rounded-xl p-3 ${
				!playlistOpen ? 'bg-indigo-200/30' : 'bg-indigo-100'
			}`}
		>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-xl line-clamp-1 font-medium dark:text-slate-300'>
						{/* Mix - Zara Zara Bahekta Hai - halraj [asdasdas] */}
						{playlist?.title}
					</h1>
					<h2 className='text-sm line-clamp-1 text-gray-700 dark:text-dark-text'>
						{/* Mixes are playlists YoutUbe makes for you */}
						{playlist?.description}
					</h2>
				</div>
				<button
					onClick={() => setPlaylistOpen((prev) => !prev)}
					className='focus:bg-indigo-200/60 dark:focus:bg-dark-overlay-100 dark:bg-dark-overlay-200 focus:border dark:border-none rounded-full p-2'
				>
					{!playlistOpen ? (
						<FiChevronDown className='h-7 w-7 dark:text-slate-300' />
					) : (
						<FiX className='h-7 w-7 dark:text-slate-300' />
					)}
				</button>
			</div>

			{!playlistOpen ? null : (
				// <div className='flex flex-col gap-3 mt-5 max-h-[60vh] overflow-y-auto overflow-x-hidden '>
				<div
					ref={playlistRef}
					className='flex cHeight flex-col bg-transparent gap-3 mt-5  overflow-auto'
				>
					{playlist?.playlist_video.map((plItem) => (
						<PlaylistProfileThumbnail
							key={plItem.videoId}
							thumbnail={
								plItem?.thumbnail &&
								`${import.meta.env.VITE_API_URI}/static/thumbnails/${
									plItem.thumbnail
								}`
							}
							timeStamp={formateTime(plItem.duration)}
							title={plItem.title}
							channelName={plItem.channel.name}
							chnLink={`/ch/${plItem.channelId}`}
							vidLink={`/watch?v=${plItem.videoId}${
								query.has('v') && `&p=${query.get('p')}`
							}`}
							uploadedAt={dayjs(plItem.createdAt).toNow(true)}
							classes='h-20 w-32'
							isActive={query.get('v') === plItem.videoId}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Playlist;
