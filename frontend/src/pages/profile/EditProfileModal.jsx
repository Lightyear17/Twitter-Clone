import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../components/hooks/useUpdateUserProfile";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({ authUser }) => {
	// console.log(authUser)
	const [formData, setFormData] = useState({
		fullName: "",
		userName: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
	const navigate = useNavigate();
	const handleInputChange = (e) => {
		// console.log("Input changed:", e.target.name, e.target.value);
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		// console.log(authUser.fullName, authUser.userName, authUser.email, authUser.bio, authUser.link);
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				userName: authUser.userName,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);
	useEffect(() => {
		// console.log("formData updated:", formData);
	}, [formData]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		const updatedUser = await updateProfile(formData);
		// console.log("Form submitted with data:", formData); // Log the form data
		if (updatedUser?.userName !== authUser.userName) {
			navigate(`/profile/${updatedUser.userName}`);
		}
		// Call the updateProfile function
		updateProfile(formData);
	};

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={handleSubmit}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.userName}
								name='userName'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;