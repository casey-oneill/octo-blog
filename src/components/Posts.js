import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { buildOctokit } from "../util/util";
import Loader from "./Loader";
import PostPreview from "./PostPreview";

function Posts(props) {
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			if (props.path !== undefined && props.path !== null) {
				const octokit = await buildOctokit();
				const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/{path}", {
					owner: process.env.REACT_APP_GH_OWNER,
					repo: process.env.REACT_APP_GH_REPO,
					path: props.path,
				});

				setPosts(content.data);
				setLoading(false);
			} else {
				const octokit = await buildOctokit();
				const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/", {
					owner: process.env.REACT_APP_GH_OWNER,
					repo: process.env.REACT_APP_GH_REPO,
				});

				var posts = [];
				var categories = [];

				content.data.forEach((c) => {
					if (c.download_url === null) {
						categories.push(c);
					} else {
						posts.push(c);
					}
				});

				for (var i = 0; i < categories.length; i++) {
					const content = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
						owner: process.env.REACT_APP_GH_OWNER,
						repo: process.env.REACT_APP_GH_REPO,
						path: categories[i].path,
					});

					posts = posts.concat(content.data);
				}

				setPosts(posts);
				setLoading(false);
			};
		};

		fetchPosts();
	});

	var postPreviews = [];
	posts.forEach((post, i) => {
		postPreviews.push(
			<Col xs={12} className={postPreviews.length === 0 ? "mb-3" : "my-3"} key={i}>
				<PostPreview path={post.path} />
			</Col>
		);
	});

	if (loading) {
		return <Loader />
	}

	return (
		<Row className="posts">
			{postPreviews}
		</Row>
	);
};

export default Posts;
