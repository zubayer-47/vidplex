import { FiSearch } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const ChannelNav = () => {
	return (
		<ul className='flex items-center gap-8'>
			<NavLink
				to={`featured`}
				className={({ isActive }) =>
					!isActive
						? 'text-gray-700/90 border-b-2 border-transparent px-5 py-2 font-medium'
						: 'text-gray-800 border-b-2 border-gray-700 bg-gray-700/10 font-medium px-5 py-2'
				}
			>
				HOME
			</NavLink>
			<NavLink
				to={`videos`}
				className={({ isActive }) =>
					!isActive
						? 'text-gray-700/90 border-b-2 border-transparent px-5 py-2 font-medium'
						: 'text-gray-800 border-b-2 border-gray-700 bg-gray-700/10 font-medium px-5 py-2'
				}
			>
				VIDEOS
			</NavLink>
			<NavLink
				to={`playlists`}
				className={({ isActive }) =>
					!isActive
						? 'text-gray-700/90 border-b-2 border-transparent px-5 py-2 font-medium'
						: 'text-gray-800 border-b-2 border-gray-700 bg-gray-700/10 font-medium px-5 py-2'
				}
			>
				PLAYLISTS
			</NavLink>
			{/* <NavLink to={`channels`} className={({ isActive }) => (
            !isActive ? "text-gray-700/90 border-b-2 border-transparent px-5 py-2 font-medium" : "text-gray-800 border-b-2 border-gray-700 bg-gray-700/10 font-medium px-5 py-2"
        )}>CHANNELS</NavLink> */}
			<NavLink
				to={`about`}
				className={({ isActive }) =>
					!isActive
						? 'text-gray-700/90 border-b-2 border-transparent px-5 py-2 font-medium'
						: 'text-gray-800 border-b-2 border-gray-700 bg-gray-700/10 font-medium px-5 py-2'
				}
			>
				ABOUT
			</NavLink>
			<NavLink
				to={`@stacklearner7`}
				className={({ isActive }) =>
					!isActive
						? 'text-gray-700/90 border-b-2 border-transparent px-5 py-2 font-medium'
						: 'text-gray-800 border-b-2 border-gray-700 bg-gray-700/10 font-medium px-5 py-2'
				}
			>
				<FiSearch />
			</NavLink>
		</ul>
	);
};

export default ChannelNav;
