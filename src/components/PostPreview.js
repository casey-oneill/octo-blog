import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { buildOctokit } from "../util/util";

var Remarkable = require('react-remarkable');

function PostPreview(props) {
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(null);
	const [content, setContent] = useState(null);

	const formattedPostPath = (path) => {
		return path.replace("blog/", "").replace(".md", "");
	};

	useEffect(() => {
		const fetchPostContent = async () => {
			const octokit = await buildOctokit();
			const metadata = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
				owner: process.env.REACT_APP_GH_OWNER,
				repo: process.env.REACT_APP_GH_REPO,
				path: props.path,
			});

			const content = atob(metadata.data.content); // FIXME: Deprecated method
			setContent(content);

			const commits = await octokit.request("GET /repos/{owner}/{repo}/commits{?path}", {
				owner: process.env.REACT_APP_GH_OWNER,
				repo: process.env.REACT_APP_GH_REPO,
				path: props.path,
			});

			setDate(commits.data.at(0).commit.committer.date);
			setLoading(false);
		};

		fetchPostContent();
	});

	const formattedDate = format(new Date(date), "MMMM dd, yyyy");

	if (loading) {
		// TODO: Create custom loader
		return <p>Loading...</p>
	}

	// FIXME: Find a better way to do this...
	const [title, x, preview] = content.split("\n").slice(0, 3);

	return (
		<div className="post-preview">
			<Card className="shadow">
				<Card.Header>{formattedDate}</Card.Header>
				<Card.Body>
					<Card.Title>{title.replace("# ", "")}</Card.Title>
					<Card.Text className="post-preview-text" as={Remarkable} source={preview} />
				</Card.Body>
				<Card.Footer>
					<Button as={Link} variant="primary" to={`/posts/${formattedPostPath(props.path)}`}>View</Button>
				</Card.Footer>
			</Card>
		</div>
	);
};

export default PostPreview;
