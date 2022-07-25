import { format } from "date-fns";
import { Component } from "react";
import { Breadcrumb, BreadcrumbItem, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import { buildOctokit } from "../util/util";

const readingTime = require("reading-time");

class PostPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			path: this.props.match.params.path,
			name: this.props.match.params.path.split("-").join(" "),
			dirname: this.props.match.params.category,
			category: null,
			createdDate: null,
			modifiedDate: null,
			content: null,
		}
	}

	componentDidMount() {
		if (this.state.dirname !== undefined && this.state.dirname !== null) {
			this.fetchPostContent(this.state.dirname + "/" + this.props.match.params.path + ".md");
			this.setState({
				category: this.state.dirname.split("-").join(" "),
			});
		} else {
			this.fetchPostContent(this.props.match.params.path + ".md");
		}
	}

	fetchPostContent = async (path) => {
		const octokit = await buildOctokit();
		const metadata = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/{path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: path,
		});

		const content = atob(metadata.data.content); // FIXME: Deprecated method

		this.setState({
			isLoading: false,
			content: content,
		});

		const commits = await octokit.request("GET /repos/{owner}/{repo}/commits{?path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: "blog/" + path,
		});

		this.setState({
			createdDate: commits.data.at(-1).commit.committer.date,
		});

		if (commits.data.length > 1) {
			this.setState({
				modifiedDate: commits.data.at(0).commit.committer.date,
			});
		}
	}

	breadcrumbItems = () => {
		const { path, name, dirname, category } = this.state;
		var items = [];
		items.push(<BreadcrumbItem linkAs={Link} linkProps={{ to: "/" }}>Home</BreadcrumbItem>);

		if (dirname !== undefined && dirname !== null) {
			items.push(<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/categories/${dirname}` }}>{category}</BreadcrumbItem>);
			items.push(<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/posts/${dirname}/${path}` }}>{name}</BreadcrumbItem>);
		} else {
			items.push(<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/posts/${path}` }}>{name}</BreadcrumbItem>);
		}

		return items;
	}

	formattedDate = () => {
		const { createdDate, modifiedDate } = this.state;
		if (modifiedDate !== null) {
			return "Updated " + format(new Date(modifiedDate), "MMMM dd, yyyy");
		}

		return "Published " + format(new Date(createdDate), "MMMM dd, yyyy");
	}

	readingTime = () => {
		const stats = readingTime(this.state.content);
		return stats.text;
	}

	render() {
		const { isLoading, content } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		return (
			<Container className="post-page my-5">
				<Breadcrumb>
					{this.breadcrumbItems()}
				</Breadcrumb>
				<Card className="bg-light mb-5">
					<Card.Body>
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
