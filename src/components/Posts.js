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
			categories: null,
			posts: null,
		}
	}

	componentDidMount() {
		this.fetchPosts();
	}

	fetchPosts = async () => {
		if (this.props.path !== undefined && this.props.path !== null) {
			const octokit = await buildOctokit();
			const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/{path}", {
				owner: process.env.REACT_APP_GH_OWNER,
				repo: process.env.REACT_APP_GH_REPO,
				path: this.props.path,
			});

			this.setState({
				isLoading: false,
				posts: content.data,
			});
		}
		else {
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

				console.log(content);
				posts = posts.concat(content.data);
			}

			this.setState({
				isLoading: false,
				posts: posts,
			});
		}
	}

	renderPosts(posts) {
		var postPreviews = [];
		posts.forEach((post, i) => {
			postPreviews.push(
				<Col xs={12} className={postPreviews.length === 0 ? "mb-3" : "my-3"} key={i}>
					<PostPreview path={post.path} />
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
			<Row className="posts">
				{this.renderPosts(posts)}
			</Row>
		);
	}
}

export default Posts;
