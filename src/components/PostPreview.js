import { format } from "date-fns";
import { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { buildOctokit } from "../util/util";

var Remarkable = require('react-remarkable');

class PostPreview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			date: null,
			content: null,
		}
	}

	componentDidMount() {
		this.fetchPostContent();
	}

	fetchPostContent = async () => {
		const octokit = await buildOctokit();
		const metadata = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: this.props.path,
		});

		const content = atob(metadata.data.content); // FIXME: Deprecated method

		this.setState({
			isLoading: false,
			content: content,
		});

		const commits = await octokit.request("GET /repos/{owner}/{repo}/commits{?path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: this.props.path,
		});

		this.setState({
			date: commits.data.at(0).commit.committer.date,
		});
	}

	formattedPostPath(path) {
		return path.replace("blog/", "").replace(".md", "");
	}

	formattedDate = () => {
		return format(new Date(this.state.date), "MMMM dd, yyyy");
	}

	render() {
		const { isLoading, content } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		const textPreview = content.split('\n')[2];
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
						{content.split('\n')[0].replace("# ", "")}
					</Card.Title>
					{cardBody}
					<Card.Footer>
						<p className="mt-0 text-muted">{this.formattedDate()}</p>
						<Button as={Link} variant="primary" to={`/posts/${this.formattedPostPath(this.props.path)}`}>View</Button>
					</Card.Footer>
				</Card>
			</div>
		);
	}
}

export default PostPreview;
