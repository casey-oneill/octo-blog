import { format } from "date-fns";
import { Component } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Post from "../components/Post";
import { buildOctokit } from "../util/util";

const readingTime = require("reading-time");

class PostPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			author: null,
			createdDate: null,
			modifiedDate: null,
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

		const commits = await octokit.request("GET /repos/{owner}/{repo}/commits{?path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: "blog/" + this.props.match.params.path + ".md",
		});

		this.setState({
			author: commits.data.at(0).commit.author.name,
			createdDate: commits.data.at(-1).commit.committer.date,
		});

		if (commits.data.length > 1) {
			this.setState({
				modifiedDate: commits.data.at(0).commit.committer.date,
			});
		}
	}

	formattedDate = () => {
		const { createdDate, modifiedDate } = this.state;
		if (modifiedDate !== null) {
			return "Updated " + format(new Date(modifiedDate), "MMMM dd, yyyy");
		}

		return "Published " + format(new Date(createdDate), "MMMM dd, yyyy");
	}

	readingTime = () => {
		const { content } = this.state;
		const stats = readingTime(content);

		return stats.text;
	}

	render() {
		const { isLoading, author, content } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		return (
			<Container className="post-page my-5">
				<Card className="bg-light mb-5">
					<Card.Body>
						<p className="my-0">{author}</p>
						<p className="my-0 text-muted">{this.formattedDate()}</p>
						<p className="my-0 text-muted">{this.readingTime()}</p>
					</Card.Body>
				</Card>
				<Post content={content} />
			</Container>
		);
	}
}

export default PostPage;
