import { MarkGithubIcon } from "@primer/octicons-react";
import { Component } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { buildOctokit } from "../util/util";

class Header extends Component {

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

	dropdownItems = () => {
		const { categories } = this.state;
		var items = [];

		categories.forEach((category, i) => {
			items.push(<NavDropdown.Item as={Link} to={`/categories/${category.dirname}`} className="text-capitalize">{category.name}</NavDropdown.Item>)
		});

		return items;
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

	render() {
		const { isLoading } = this.state;

		if (isLoading) {
			// TODO: Create custom loader
			return <p>Loading...</p>
		}

		return (
			<div className="header">
				<Navbar className="shadow-sm" bg="light" expand="lg">
					<Container>
						<Navbar.Brand as={Link} to="/">{process.env.REACT_APP_NAME}</Navbar.Brand>
						<Navbar.Toggle aria-controls="navbar-nav" />
						<Navbar.Collapse id="navbar-nav" className="justify-content-end">
							<Nav>
								<NavDropdown title="Categories" id="categories-dropdown">
									{this.dropdownItems()}
								</NavDropdown>
								<Nav.Link as={Link} to="/about">About</Nav.Link>
								<Nav.Link href={process.env.REACT_APP_GH_REPO_URL}><MarkGithubIcon size={16} /></Nav.Link>
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}

export default Header;
