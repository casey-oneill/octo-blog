import React, { useState, useEffect } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { buildOctokit } from "../util/util";
import { LocationIcon, MarkGithubIcon } from "@primer/octicons-react";

function AboutPage() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Fetch user data from GitHub API
		const fetchUser = async () => {
			const octokit = await buildOctokit();
			const user = await octokit.request("GET /user", {});

			setLoading(false);
			setUser(user.data);
		};

		fetchUser();
	});

	if (loading) {
		return (
			<Container className="about-page my-5">
				<h1 className="text-center">About</h1>

				{/* TODO: Create custom loader */}
				<p>Loading...</p>
			</Container>
		);
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

export default AboutPage;
