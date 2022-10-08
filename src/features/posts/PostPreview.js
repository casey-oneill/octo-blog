import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';
import { selectPostByPath } from './postsSlice';
import { buildRelativePostLink, parseModifiedDate, parsePostPreview, parsePostTitle } from '../../util/util';
import { STATUS } from '../../util/constants';

const Remarkable = require('react-remarkable');

const PostPreview = (props) => {
	const { path } = props;
	const title = parsePostTitle(path);
	const relativeLink = buildRelativePostLink(path);

	const post = useSelector(state => selectPostByPath(state, path));
	const postsStatus = useSelector(state => state.posts.status);

	const preview = parsePostPreview(post.content);
	const updatedDate = parseModifiedDate(post.commits);

	if (postsStatus === STATUS.LOADING) {
		return <Loader />;
	}

	return (
		<div className="post-preview">
			<Card className="shadow">
				<Card.Header>{updatedDate}</Card.Header>
				<Card.Body>
					<Card.Title className="text-capitalize">{title}</Card.Title>
					<Card.Text className="post-preview-text" as={Remarkable} source={preview} />
				</Card.Body>
				<Card.Footer>
					<Button as={Link} variant="primary" to={relativeLink}>View</Button>
				</Card.Footer>
			</Card>
		</div>
	);
};

export default PostPreview;
