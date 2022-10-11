import React, { useEffect } from 'react';
import { Breadcrumb, BreadcrumbItem, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Post from './Post';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost, selectPostByName } from './postsSlice';
import { buildPostPath, buildRelativeCategoryLink, buildRelativePostLink, formatName, parseCreatedDate, parseModifiedDate } from '../../util/util';
import { Status } from '../../util/constants';

const PostPage = (props) => {
	const dispatch = useDispatch();
	const path = props.match.params.path;
	const title = formatName(path);
	const category = props.match.params.category?.split('-').join(' ');

	const post = useSelector(state => selectPostByName(state, path.concat('.md')));
	const postsStatus = useSelector(state => state.posts.status);
	const postPath = buildPostPath(props.match.params.category, path);

	useEffect(() => {
		if (postsStatus === Status.Idle) {
			dispatch(fetchPost(postPath));
		}
	}, [postsStatus, postPath, dispatch]);

	if ([Status.Idle, Status.Loading].includes(postsStatus)) {
		return <Loader />
	}

	const categoryRelLink = buildRelativeCategoryLink(props.match.params.category);
	const postRelLink = buildRelativePostLink(post.path)

	const createdDate = parseCreatedDate(post.commits);
	const modifiedDate = parseModifiedDate(post.commits);

	return (
		<Container className="post-page my-5">
			<Breadcrumb>
				<BreadcrumbItem linkAs={Link} linkProps={{ to: "/" }}>Home</BreadcrumbItem>
				{categoryRelLink !== undefined && <BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: categoryRelLink }}>{category}</BreadcrumbItem>}
				<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: postRelLink }}>{title}</BreadcrumbItem>
			</Breadcrumb>
			<Card className="bg-light mb-5">
				<Card.Body>
					<p className="my-0 text-muted">Created {createdDate}</p>
					{createdDate !== modifiedDate && <p className="my-0 text-muted">Updated {modifiedDate}</p>}
				</Card.Body>
			</Card>
			<Post content={post.content} />
		</Container>
	);
};

export default PostPage;
