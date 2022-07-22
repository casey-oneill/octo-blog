import { Octokit } from "octokit";
import { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

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

	formatPostPath(path) {
		return path.replace("blog/", "").replace(".md", "");
	}

	render() {
		const { isLoading, content } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		const textPreview = content.data.split('\n')[2];
		var cardBody = (
			<Card.Body>
				<Card.Text as={Remarkable} source={textPreview} />
			</Card.Body>
		);

		if (textPreview.length > 175) {
			cardBody = (
				<Card.Body>
					<Card.Text as={Remarkable} source={textPreview.substring(0, 175).trim() + "..."} />
				</Card.Body>
			);
		}

		return (
			<div className="post-preview">
				<Card className="post-preview-card shadow">
					<Card.Title className="p-4 mb-0">
						{content.data.split('\n')[0].replace("# ", "")}
					</Card.Title>
					{cardBody}
					<Card.Footer>
						<Button as={Link} variant="primary" to={`/posts/${this.formatPostPath(this.props.path)}`}>View</Button>
					</Card.Footer>
				</Card>
			</div>
		);
	}
}

export default PostPreview;
