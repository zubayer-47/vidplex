import { useEffect, useState } from 'react';
import { FiChevronRight, FiPlay } from 'react-icons/fi';
import defaultThumbnail from '../../assets/demo.jpg';
import { BASE_URL } from '../../libs/axios';
import usePlayer from './hooks/usePlayer';
import VideoController from './partials/VideoController';
import VideoLoading from './partials/VideoLoading';

type Props = {
	source: string;
	thumbnail?: string;
};

const VideoPlayer = ({ source, thumbnail }: Props) => {
	const {
		parentRef,
		vidRef,
		progressRef,
		bufferRef,
		isWaiting,
		removeThumbnail,
		isPlay,
		isMuted,
		duration,
		timeElapsed,
		volume,
		isFullScreen,
		settings,
		setSettings,
		handlePlayPause,
		handleSeekPosition,
		updateVolumeBar,
		toggleMute,
		toggleFullScreen,
		handlePlaybackSeed,
	} = usePlayer();
	const [show, setShow] = useState(false);
	const [points, setPoints] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleShow = () => {
			console.log('handleshow called')
			setShow(false);
		}

		window.addEventListener('click', handleShow);

		return () => {
			window.removeEventListener('click', handleShow)
		}
	}, []);

	console.log(points)



	return (
		<>
			<div
				className='w-full relative group/video-player-item rounded overflow-hidden'
				ref={parentRef}
				onContextMenu={e => {
					e.preventDefault();

					setPoints(({
						x: e.pageX,
						y: e.pageY
					}))
					setShow(prev => !prev);
				}}
			>
				{isWaiting && <VideoLoading />}
				{!removeThumbnail && (
					<div
						className='video-thumb object-fill'
						style={{ backgroundImage: `url(${thumbnail || defaultThumbnail})` }}
					/>
				)}

				<button
					type='button'
					className='absolute inset-0 bg-transparent outline-none grid place-content-center z-10 cursor-default'
					onClick={handlePlayPause}
				>
					<div
						className={`px-10 py-5 rounded-2xl grid place-content-center bg-indigo-600/50 hover:bg-indigo-600/70 cursor-pointer ${!isPlay ? 'block' : 'hidden'
							}`}
					>
						<FiPlay className='w-7 h-7 text-white' />
					</div>
				</button>

				<VideoController
					progressRef={progressRef}
					bufferRef={bufferRef}
					isPlay={isPlay}
					isMuted={isMuted}
					duration={duration}
					timeElapsed={timeElapsed}
					volume={volume}
					isFullScreen={isFullScreen}
					settings={settings}
					handleSettings={setSettings}
					handlePlaybackSeed={handlePlaybackSeed}
					togglePlay={handlePlayPause}
					toggleMute={toggleMute}
					handleSeekPosition={handleSeekPosition}
					updateVolumeBar={updateVolumeBar}
					toggleFullScreen={toggleFullScreen}
				/>

				<video
					ref={vidRef}
					width={'100%'}
					height={'auto'}
					crossOrigin='anonymous'
					preload='auto'
					className='w-full h-full aspect-video'
				>
					<source src={`${BASE_URL}/videos/${source}`} type='video/mp4' />
					{/* <source src={source} type='video/mp4' /> */}
					<track
						label='English'
						kind='subtitles'
						srcLang='en'
						src='captions/vtt/sintel-en.vtt'
						default
					/>
					<track
						label='Deutsch'
						kind='subtitles'
						srcLang='de'
						src='captions/vtt/sintel-de.vtt'
					/>
					<track
						label='Español'
						kind='subtitles'
						srcLang='es'
						src='captions/vtt/sintel-es.vtt'
					/>
				</video>
			</div>
			{show && (
				<ul className={`absolute py-1 bg-black/75 rounded-xl top-[${points.y}px] z-50 left-[${points.x}px]`}>
					<li>
						<button
							className='text-white px-3 py-2 w-full flex gap-8 items-center justify-between hover:bg-black/50'
							onClick={() =>
								// handleSettings((prev) => ({
								// 	...prev,
								// 	visibleWindow: 'playback',
								// }))
								console.log('')
							}
						>
							<span className='flex items-center gap-2'>
								<span className='text-md text-gray-300'>Playback Speed</span>
							</span>
							<span className='flex items-center text-xs'>
								<span className='underline text-gray-300'>
									{settings?.playback === 1 ? 'Normal' : settings?.playback}
								</span>
								<FiChevronRight className='w-5 h-5 stroke-1 text-gray-300' />
							</span>
						</button>
					</li>
					<li>
						<button
							type='button'
							className='text-white px-3 py-2 w-full flex gap-8 items-center justify-between hover:bg-black/50'
							onClick={() =>
								// handleSettings((prev) => ({
								// 	...prev,
								// 	visibleWindow: 'subtitle',
								// }))
								console.log('')
							}
						>
							<span className='flex items-center gap-2'>
								<span className='text-md text-gray-300'>Subtitle</span>
							</span>
							<span className='flex items-center text-xs'>
								<span className='underline text-gray-300'>
									{settings?.subtitle || 'Off'}
								</span>
								<FiChevronRight className='w-5 h-5 stroke-1 text-gray-300' />
							</span>
						</button>
					</li>
					<li>
						<button
							type='button'
							className='text-white px-3 py-2  w-full flex gap-8 items-center justify-between hover:bg-black/50'
							onClick={() =>
								// handleSettings((prev) => ({
								// 	...prev,
								// 	visibleWindow: 'quality',
								// }))
								console.log('')
							}
						>
							<span className='flex items-center gap-2'>
								<span className='text-md text-gray-300'>Quality</span>
							</span>
							<span className='flex items-center text-xs'>
								<span className='underline text-gray-300'>
									{settings?.quality || 'Auto'}
								</span>
								<FiChevronRight className='w-5 h-5 stroke-1 text-gray-300' />
							</span>
						</button>
					</li>
				</ul>
			)}

		</>
	);
};

export default VideoPlayer;
