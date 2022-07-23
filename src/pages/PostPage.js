import { Component } from "react";
import { Container } from "react-bootstrap";
import Post from "../components/Post";
import { buildOctokit } from "../util/util";

class PostPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			content: null,
		}
	}

	componentDidMount() {
		this.fetchPostContent();
	}

	fetchPostContent = async () => {
		const octokit = await buildOctokit();
		const metadata = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/{path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: this.props.match.params.path + ".md",
		});

		const content = atob(metadata.data.content); // FIXME: Deprecated method

		this.setState({
			isLoading: false,
			content: content,
		});
	}

	render() {
		const { isLoading, content } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		return (
			<Container className="post-page my-5">
				<Post content={content} />
			</Container>
		);
	}
}

export default PostPage;
