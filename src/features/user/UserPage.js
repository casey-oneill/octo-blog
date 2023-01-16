import React, { useEffect } from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { LocationIcon, MarkGithubIcon } from '@primer/octicons-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './userSlice';
import Loader from '../../components/Loader';
import { Status } from '../../util/constants';

const UserPage = () => {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	const userStatus = useSelector(state => state.user.status);

	useEffect(() => {
		if (userStatus === Status.Idle) {
			dispatch(fetchUser());
		}
	}, [userStatus, dispatch]);

	if ([Status.Idle, Status.Loading].includes(userStatus)) {
		return (
			<Container className="about-page my-5">
				<h1 className="text-center">About</h1>
				<Loader />
			</Container>
		);
	}

	if (userStatus === Status.Failed) {
		throw new Error("Failed to fetch user information.");
	}

	return (
		<Container className="about-page my-5">
			<h1 className="text-center mb-5">About</h1>
			<Row>
				<Col xs={12} sm={4} className>
					<Image src={user.avatar_url} className="rounded-circle mx-auto d-block" width={150} height={150} />
				</Col>
				<Col xs={12} sm={8}>
					<Card>
						<Card.Body>
							<Card.Title>{user.name}</Card.Title>
							<Card.Text>{user.bio}</Card.Text>
							{user.location === null ? null : <p><LocationIcon size={16} /> {user.location}</p>}
						</Card.Body>
						<Card.Footer>
							<a href={user.html_url}><MarkGithubIcon size={16} /></a>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default UserPage;
