import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Loader from '../../components/Loader';
import PostPreview from './PostPreview';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectPostsByCategory } from './postsSlice';
import { STATUS } from '../../util/constants';

const PostsList = (props) => {
	const dispatch = useDispatch();
	const { category } = props;
	const posts = useSelector(state => selectPostsByCategory(state, category));
	const postsStatus = useSelector(state => state.posts.status);
		
	useEffect(() => {
		if (postsStatus === STATUS.IDLE) {
			dispatch(fetchPosts(category));
		}
	}, [postsStatus, dispatch]);

	var postPreviews = [];
	if (posts !== undefined) {
		posts.forEach((post, i) => {
			postPreviews.push(
				<Col xs={12} className={postPreviews.length === 0 ? "mb-3" : "my-3"} key={i}>
					<PostPreview path={post.path} />
				</Col>
			);
		});
	}

	if (postsStatus === STATUS.LOADING) {
		return <Loader />
	}

	return (
		<Row className="posts">
			{postPreviews}
		</Row>
	);
};

export default PostsList;
