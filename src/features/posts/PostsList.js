import React, { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import Loader from "../../components/Loader";
import PostPreview from "./PostPreview";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, selectPostsByCategory } from "./postsSlice";
import { PAGE_SIZE, Status } from "../../util/constants";
import { withErrorBoundary } from "react-error-boundary";
import PostsListFallback from "./PostsListFallback";

const PostsList = (props) => {
	const { category } = props;
	const [pagination, setPagination] = useState(0);

	const dispatch = useDispatch();
	const posts = useSelector(state => selectPostsByCategory(state, category));
	const postsStatus = useSelector(state => state.posts.status);

	useEffect(() => {
		setPagination(1);
	}, [category]);

	useEffect(() => {
		if (postsStatus === Status.Idle) {
			dispatch(fetchPosts(category));
		}
	}, [postsStatus, dispatch]);

	if (postsStatus === Status.Loading) {
		return <Loader />;
	}

	if (postsStatus === Status.Failed) {
		throw new Error("Failed to fetch blog posts.");
	}

	const previewsList = posts.slice(0, pagination * PAGE_SIZE).map(post => {
		return post.content === undefined ? null : <PostPreview key={post.sha} path={post.path} />;
	});

	return (
		<Stack gap={5} className="posts">
			{previewsList}
			{pagination * PAGE_SIZE < posts.length && <Button variant="primary" onClick={() => setPagination(pagination + 1)}>See More</Button>}
		</Stack>
	);
};

export default withErrorBoundary(PostsList, { FallbackComponent: PostsListFallback });
