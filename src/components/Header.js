import React, { useState, useEffect } from "react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { buildOctokit } from "../util/util";

function Header() {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const parseCategory = (post) => {
			if (post.download_url === null) {
				const dirname = post.path.split("/")[1];
				return {
					dirname: dirname,
					name: dirname.split("-").join(" "),
				}
			}
			return null;
		};

		const fetchCategories = async () => {
			const octokit = await buildOctokit();
			const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/", {
				owner: process.env.REACT_APP_GH_OWNER,
				repo: process.env.REACT_APP_GH_REPO,
			});

			var categories = [];
			content.data.forEach((post) => {
				const category = parseCategory(post);
				if (category !== null && categories.indexOf(category) === -1) {
					categories.push(category);
				}
			});

			setCategories(categories);
			setLoading(false);
		};

		fetchCategories();
	});

	var categoryItems = [];
	categories.forEach((category, i) => {
		categoryItems.push(<NavDropdown.Item key={i} as={Link} to={`/categories/${category.dirname}`} className="text-capitalize">{category.name}</NavDropdown.Item>)
	});

	if (loading) {
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
								{categoryItems}
							</NavDropdown>
							<Nav.Link as={Link} to="/about">About</Nav.Link>
							<Nav.Link href={process.env.REACT_APP_GH_REPO_URL}><MarkGithubIcon size={16} /></Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};

export default Header;
