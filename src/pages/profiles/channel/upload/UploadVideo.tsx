import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Buttons/Button';
import MaterialInput, {
	MaterialTagInput,
	MaterialTextArea,
	MaterialThumbnail,
} from '../../../../components/Inputs/MaterialInput';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import {
	InputType,
	SelectType,
	TextAreaHandler,
} from '../../../../types/custom';
import AudienceSetting from './partials/AudienceSetting';
import PlaylistSetting from './partials/PlaylistSetting';

type uploadType = {
	content: File | null;
	contentPreview: string;
	duration: number;
	thumbnail: File | null;
	thumbPreview: string;
	contentUploadPercent: number;
};

export type PlaylistMeta = { playlistId: string; title: string };

type MetaData = {
	videoId: string;
	title: string;
	description: string;
	tags: string;
	status: string;
	playlist: string;
	playlists: PlaylistMeta[];
	newPlaylist: string;
	isNewPlaylist: boolean;
	publishing: boolean;
};

const UploadVideo = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [uploadedContent, setUploadedContent] = useState<uploadType>({
		content: null,
		contentPreview: '',
		duration: 0,
		thumbnail: null,
		thumbPreview: '',
		contentUploadPercent: 0,
	});
	const [metadata, setMetadata] = useState<MetaData>({
		videoId: '',
		title: '',
		description: '',
		tags: 'how to become a nodejs developer, how to, tutorial, online course',
		status: 'PUBLIC',
		playlist: '',
		playlists: [],
		newPlaylist: '',
		isNewPlaylist: false,
		publishing: false,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		const controller = new AbortController();

		(async () => {
			try {
				const res = await axiosPrivate.get(`/channels/playlists`, {
					signal: controller.signal,
				});
				const resData = res?.data || [];
				setMetadata((prev) => ({
					...prev,
					playlists: resData,
				}));
			} catch (error) {
				if (isAxiosError(error)) {
					const message = error.response?.data?.message;
					console.log('message :', message);
				}
			}
		})();

		return () => {
			controller.abort();
		};
	}, [axiosPrivate]);

	const handleFile = async (e: InputType) => {
		if (e.target?.files) {
			const content = e.target?.files[0];
			const defaultTitle = content.name.replace('.mp4', '');
			setUploadedContent((prev) => ({
				...prev,
				content,
				contentPreview: URL.createObjectURL(content),
			}));
			setMetadata((prev) => ({
				...prev,
				title: defaultTitle,
				description: defaultTitle,
			}));

			const formData = new FormData();
			formData.append('content', content);
			//Math.round((100 * event.loaded) / event.total)
			const res = await axiosPrivate.post(`/videos/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress(evt) {
					const total = evt?.total || 0;
					setUploadedContent((prev) => ({
						...prev,
						contentUploadPercent: Math.round((100 * evt.loaded) / total),
					}));
				},
			});
			setMetadata((prev) => ({ ...prev, videoId: res.data?.videoId }));
		}
	};

	const handleThumbnail = (e: InputType) => {
		if (e.target?.files) {
			const thum = e.target?.files[0];
			setUploadedContent((prev) => ({
				...prev,
				thumbnail: thum,
				thumbPreview: URL.createObjectURL(thum),
			}));
		}
	};

	const handleInput = (e: InputType) => {
		const { name, value } = e.target;
		setMetadata((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSelect = (e: SelectType) => {
		const { name, value } = e.target;
		setMetadata((prev) => ({ ...prev, [name]: value?.toUpperCase() }));
	};

	const handleTextArea: TextAreaHandler = (e) => {
		const { name, value } = e.target;
		setMetadata((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePlaylist = (e: SelectType) => {
		const { name, value } = e.target;
		setMetadata((prev) => ({
			...prev,
			isNewPlaylist: false,
			newPlaylist: '',
			[name]: value,
		}));
	};

	const handleNewPlaylist = () =>
		setMetadata((prev) => ({
			...prev,
			isNewPlaylist: !prev.isNewPlaylist,
			newPlaylist: '',
			playlist: '',
		}));
	const handleValidate = () => {
		const err: Record<string, string> = {};
		const { videoId, title, description, tags, status } = metadata;
		const { thumbnail } = uploadedContent;

		if (!thumbnail) {
			err.thumbnail = 'Thumbnail is mission!';
		}

		if (!videoId) err.videoId = 'Your content file missing!';
		if (!title) err.title = 'Title is required!';
		if (!status) err.status = 'Status is required!';
		if (!description) err.description = 'Description is required!';
		if (!tags) err.tags = 'Tags is required!';

		if (!err?.title && title.length < 10)
			err.title = 'Title should be minimum 10 character!';
		if (!err?.description && description.length < 20)
			err.description = 'Description should be minimum 20 character!';
		// if (!err?.tags && tags?.split(',')) err.tags = 'Tags is required!'

		setErrors(err);
		return !Object.keys(err).length;
	};

	const handlePublish = async () => {
		if (!handleValidate()) return;

		const { videoId, title, description, tags, status, playlist, newPlaylist } =
			metadata;
		const { thumbnail } = uploadedContent;

		const form = new FormData();
		form.append('videoId', videoId);
		form.append('title', title);
		form.append('description', description);
		form.append('tags', tags);
		form.append('status', status);
		if (thumbnail) form.append('thumbnail', thumbnail);
		if (playlist) form.append('playlist', playlist);
		if (newPlaylist) form.append('newPlaylist', newPlaylist);

		try {
			setMetadata((prev) => ({ ...prev, publishing: true }));
			const res = await axiosPrivate.post(`/videos/publish`, form, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			const resData = res?.data;
			console.log('resData :', resData);
			navigate('/');
		} catch (error) {
			console.log('error :', error);
			setMetadata((prev) => ({ ...prev, publishing: false }));
		}
	};

	if (!uploadedContent.content) {
		return (
			<div className='flex-1 flex items-center justify-center overflow-y-auto'>
				<div className='w-full mx-5 md:mx-0 md:w-3/5 bg-white dark:bg-dark-overlay-100/30 rounded-lg p-5 shadow-lg'>
					<h1 className='mb-3 text-2xl text-center font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300'>
						you can upload a video
					</h1>
					<p className='text-sm text-center text-slate-400 dark:text-dark-text/60 font-medium tracking-wider'>
						Click on the button & select a video file to upload
					</p>

					<div className='my-7 grid place-content-center'>
						<label htmlFor='uploadVid'>
							<div className='inline-flex items-center bg-indigo-400 rounded-lg shadow-lg dark:shadow-sm shadow-indigo-300 cursor-pointer'>
								<FiArrowUp className='w-5 h-5 text-white stroke-white m-2' />
								<span className='text-white font-medium tracking-wide uppercase p-2 border-l border-indigo-300'>
									upload
								</span>
							</div>
							<input
								type='file'
								name=''
								id='uploadVid'
								className='hidden'
								onChange={handleFile}
								accept='video/mp4,video/x-m4v,video/*'
							/>
						</label>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='flex-1 overflow-y-scroll p-3 md:p-10'>
			<div className='w-full bg-white dark:bg-dark-overlay-100/30 rounded-lg'>
				{/* upload process info */}
				<div className='flex items-stretch gap-3 p-5 border-b border-slate-300 dark:border-dark-text/50'>
					<div className='w-32 h-32 border border-indigo-300 dark:border-none rounded-lg'>
						<video
							width={'100%'}
							height={'100%'}
							crossOrigin='anonymous'
							preload='auto'
							className='w-full h-full object-cover'
							controls={true}
						>
							<source src={uploadedContent?.contentPreview} type='video/mp4' />
						</video>
					</div>
					<div className='flex-1 flex flex-col gap-5'>
						<div className='flex justify-end'>
							<Button
								title='Publish'
								type='button'
								handler={handlePublish}
								isLoading={!metadata?.videoId || metadata.publishing}
							/>
						</div>
						<div>
							<div className='flex items-center justify-between'>
								{uploadedContent.contentUploadPercent === 100 ? (
									<div className='text-xs tracking-wide text-slate-700 dark:text-dark-text'>
										<span className='text-indigo-500 font-semibold'>
											Complete!
										</span>{' '}
										Now you can PUBLISH your content if you fill the
										requirements
									</div>
								) : (
									<p className='font-light text-sm tracking-wide text-slate-500 dark:text-slate-300'>
										Your video is uploading...
									</p>
								)}
								<p className='font-semibold text-slate-400 dark:text-dark-text text-xs'>
									{uploadedContent.contentUploadPercent}%
								</p>
							</div>
							<div className='w-full mt-3 h-1 bg-indigo-200 rounded-full'>
								<div
									className='h-full bg-indigo-500 rounded-full transition-transform'
									style={{ width: `${uploadedContent.contentUploadPercent}%` }}
								></div>
							</div>
						</div>
					</div>
				</div>
				{/* upload metadata info */}
				<div className='flex items-stretch gap-3'>
					{/* video metadata form */}
					<div className='flex-1 flex flex-col gap-3 px-5 py-3'>
						<h2 className='font-bold text-base tracking-wide text-slate-500 dark:text-slate-300'>
							Title & Informations
						</h2>
						<MaterialInput
							title='Title'
							name='title'
							handler={handleInput}
							value={metadata.title}
							hint='Video title...'
							isLoading={metadata.publishing}
							error={errors?.title}
							isRequired
						/>
						<MaterialTextArea
							title='Description'
							name='description'
							handler={handleTextArea}
							value={metadata.description}
							hint='Video description...'
							isLoading={metadata.publishing}
							error={errors?.description}
							isRequired
						/>
						<MaterialThumbnail
							preview={uploadedContent?.thumbPreview}
							handler={handleThumbnail}
							isLoading={metadata.publishing}
							error={errors?.thumbnail}
						/>
						<MaterialTagInput
							title='Tags'
							name='tags'
							handler={handleTextArea}
							value={metadata.tags}
							hint='Video tags... E.g. hello, world'
							isLoading={metadata.publishing}
							error={errors?.tags}
						/>
					</div>
					{/* video metadata aside */}
					<div className='w-48 md:w-52 lg:w-64 p-3 sm:border-l sm:border-slate-300 dark:sm:border-dark-text/50 flex flex-col gap-1'>
						<h2 className='font-bold text-base tracking-wide text-slate-500 dark:text-slate-300 mb-5'>
							More Settings
						</h2>
						<AudienceSetting status={metadata.status} handle={handleSelect} />
						<PlaylistSetting
							playlists={metadata.playlists}
							active={metadata.playlist}
							handle={handlePlaylist}
						/>
						<div className='border-t border-b border-slate-200 dark:border-dark-text/50 py-2 flex flex-col items-end gap-2'>
							<button
								type='button'
								className={`m-0 outline-none px-1 py-0.5 rounded-sm tracking-wide text-xs font-medium ${
									!metadata.isNewPlaylist
										? 'bg-slate-200 text-slate-800'
										: 'bg-red-200 text-red-600'
								}`}
								onClick={handleNewPlaylist}
							>
								{!metadata.isNewPlaylist
									? 'Create new playlist'
									: 'Cancel playlist'}
							</button>
							{metadata.isNewPlaylist && (
								<MaterialInput
									name='newPlaylist'
									handler={handleInput}
									value={metadata.newPlaylist}
									hint='Playlist title...'
									isLoading={metadata.publishing}
									error={errors?.newPlaylist}
									isRequired
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UploadVideo;
