import { Octokit } from "octokit";
import { Component } from "react";
import { Card, Container } from "react-bootstrap";

var Remarkable = require('react-remarkable');

class PostPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			octokit: new Octokit({ auth: process.env.GH_TOKEN }),
			isLoading: true,
			content: null,
		}
	}

	componentDidMount() {
		this.fetchPostContent();
	}

	fetchPostContent = async () => {
		const metadata = await this.state.octokit.request("GET /repos/{owner}/{repo}/contents/blog/{path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: this.props.match.params.path + ".md",
		});

		const content = await this.state.octokit.request(`GET ${metadata.data.download_url}`);

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
