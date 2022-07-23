import { Component } from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { buildOctokit } from "../util/util";
import PostPreview from "./PostPreview";

class Posts extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			posts: [],
		}
	}

	componentDidMount() {
		this.fetchPosts();
	}

	fetchPosts = async () => {
		const octokit = await buildOctokit();
		const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
		});

		this.setState({
			isLoading: false,
			posts: content.data,
		});
	}

	renderPosts(posts) {
		var postPreviews = [];
		posts.forEach((post) => {
			postPreviews.push(
				<Col xs={12} className="m-3">
					<PostPreview url={post.download_url} path={post.path} />
				</Col>
			);
		});

		return postPreviews;
	}

	render() {
		const { isLoading, posts } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		return (
			<div className="posts">
				<Row className="justify-content-around">
					{this.renderPosts(posts)}
				</Row>
			</div>
		);
	}
}

export default Posts;
