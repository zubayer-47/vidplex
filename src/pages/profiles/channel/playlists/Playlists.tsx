import { FC } from 'react';
import { MdSort } from 'react-icons/md';
import ChannelNavLayout from '../../../../components/Layouts/ChannelNavLayout';
import PlaylistThumbnail from './partials/PlaylistThumbnail';

interface PlaylistsProps { }

const Playlists: FC<PlaylistsProps> = () => {
    return <ChannelNavLayout>
        <div className="flex justify-between items-center mb-5">
            <h1 className='font-medium text-gray-800'>Created Playlists</h1>
            <button className='flex gap-0.5 items-center'>
                <MdSort className="w-6 h-6 fill-gray-600" />
                <span className='font-medium text-gray-800'>Sort by</span>
            </button>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {new Array(20).fill(false).map(() => (
                <PlaylistThumbnail />
            ))}
        </div>
    </ChannelNavLayout>
}

export default Playlists;