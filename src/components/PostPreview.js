import { Octokit } from "octokit";
import { Component } from "react";
import { Button, Card } from "react-bootstrap";

var Remarkable = require('react-remarkable');

class PostPreview extends Component {
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
		const content = await this.state.octokit.request(`GET ${this.props.url}`);

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

		console.log(content);

		return (
			<div className="post-preview">
				<Card className="post-preview-card shadow" style={{ width: "18rem" }}>
					<Card.Body>
						<Card.Text as={Remarkable} source={content.data} />
						<Button variant="primary">View</Button>
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default PostPreview;
