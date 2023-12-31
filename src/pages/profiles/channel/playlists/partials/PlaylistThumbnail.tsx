import { FC } from 'react';
import { CgPlayList } from 'react-icons/cg';
import { FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import dummyImg from '../../../../../assets/demo.jpg';
import { PlaylistDataType } from '../Playlists';

const PlaylistThumbnail: FC<{ info: PlaylistDataType }> = ({
	info: { playlistId, title, thumbnail, totalVideos, videoId },
}) => {
	return (
		<Link to={`/watch?v=${videoId}&p=${playlistId}`}>
			<div className='relative rounded-lg overflow-hidden group/preview'>
				<div className='invisible group-hover/preview:visible h-36 w-full absolute top-0 right-0 left-0 bottom-0 bg-black/90'>
					<p className='h-full w-full flex place-items-center justify-center gap-2'>
						<FiPlay className='text-gray-100 w-5 h-5' />
						<span className='text-gray-100'>PLAY ALL</span>
					</p>
				</div>
				<img
					src={
						(thumbnail &&
							`${
								import.meta.env.VITE_API_URI
							}/static/thumbnails/${thumbnail}`) ||
						dummyImg
					}
					className='h-36 w-full object-cover'
					alt='playlist thumbnail'
					crossOrigin='anonymous'
				/>
				<div className='bg-gray-800/50 absolute bottom-0 left-0 right-0 flex justify-between items-center pr-1'>
					<CgPlayList className='text-gray-50 h-6 w-6' />

					<span className='text-gray-50 text-sm'>{totalVideos} videos</span>
				</div>
			</div>

			<h1 className='line-clamp-2 font-medium my-2 dark:text-slate-300'>
				{title}
			</h1>
			<p className='text-sm font-medium text-gray-600 dark:text-dark-text'>
				View full playlist
			</p>
		</Link>
	);
};

export default PlaylistThumbnail;
