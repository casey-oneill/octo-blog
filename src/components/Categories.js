import { Component } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { buildOctokit } from "../util/util";
import { Link } from "react-router-dom";

class Categories extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			categories: null,
		};
	}

	componentDidMount() {
		this.fetchCategories();
	}

	fetchCategories = async () => {
		const octokit = await buildOctokit();
		const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
		});

		var categories = [];
		content.data.forEach((post) => {
			const category = this.parseCategory(post);
			if (category !== null && categories.indexOf(category) === -1) {
				categories.push(category);
			}
		});

		this.setState({
			isLoading: false,
			categories: categories,
		});
	}

	parseCategory(post) {
		if (post.download_url === null) {
			const dirname = post.path.split("/")[1];
			return {
				dirname: dirname,
				name: dirname.split("-").join(" "),
			}
		}

		return null;
	}

	categoryItems = (categories) => {
		var items = [];

		categories.forEach((category, i) => {
			items.push(
				<ListGroup.Item key={i} action as={Link} to={`/categories/${category.dirname}`}>
					{category.name}
				</ListGroup.Item>
			);
		});
		return items;
	}

	render() {
		const { isLoading, categories } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		return (
			<Card className="bg-light">
				<Card.Header>Categories</Card.Header>
				<ListGroup variant="flush" className="text-capitalize">
					{this.categoryItems(categories)}
				</ListGroup>
			</Card>
		)
	}
}

export default Categories;
