import React from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import PostPreview from "./PostPreview";
import { useSelector } from "react-redux";
import { selectPostsByCategory } from "./postsSlice";
import { STATUS } from "../../util/constants";

const PostsList = (props) => {
	const { path } = props;
	const posts = useSelector(state => selectPostsByCategory(state, path));
	const postsStatus = useSelector(state => state.posts.status);

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
