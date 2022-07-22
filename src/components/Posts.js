import { Octokit } from "octokit";
import { Component } from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import PostPreview from "./PostPreview";

class Posts extends Component {

	constructor(props) {
		super(props);
		this.state = {
			octokit: new Octokit({ auth: process.env.GH_TOKEN }),
			isLoading: true,
			posts: [],
		}
	}

	componentDidMount() {
		this.fetchPosts();
	}

	fetchPosts = async () => {
		const content = await this.state.octokit.request("GET /repos/{owner}/{repo}/contents/blog/", {
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
				<Col md={12} lg={3} className="m-3">
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
		)
	}
}

export default Posts;
