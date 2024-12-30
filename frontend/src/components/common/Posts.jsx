import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeletons.jsx";

import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { useEffect, useState } from "react";
import toast from "react-hot-toast";




const Posts = ({ feedType,userName, userId }) => {

	
	const getPostEndpoint =  () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${userName}`;
			case "likes":
				return `/api/posts/liked/${userId}`;
			default:
				return "/api/posts/all";
		}
	}

	
	

	
	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts", feedType, userName, userId],
		queryFn: async () => {

			
			try {

				const res = await fetch(getPostEndpoint());

				if (!res.ok) {
					// Handle specific HTTP error statuses if needed
					if (res.status === 404) {
						throw new Error("Posts not found.");
					} else if (res.status === 500) {
						throw new Error(
							"Internal server error. Please try again later."
						);
					} else {
						const errorData = await res.json(); // Try to parse JSON error response
						throw new Error(errorData.error || "An unexpected error occurred.");
					}
				}

				const data = await res.json();
				
				
				return data;
			} catch (error) {
				

				// Display more specific error messages based on the error type
				if (error.message.includes("Unexpected token")) {
					toast.error(
						"Server returned an unexpected response. Please try again later or contact support."
					);
				} else {
					toast.error(error.message || "Failed to fetch posts. Please try again later.");
				}

				return []; // Return an empty array in case of an error
			}
		},
	});

	useEffect(() => {
		refetch()
	}, [feedType, refetch,userName,userId]);


	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;