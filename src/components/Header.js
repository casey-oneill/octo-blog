import React from "react";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import { selectAllCategories } from "../features/categories/categoriesSlice";

const Header = () => {
	const categories = useSelector(selectAllCategories);
	const categoriesStatus = useSelector((state) => state.categories.status);

	var categoryItems = [];
	categories.forEach((category, i) => {
		categoryItems.push(<NavDropdown.Item key={i} as={Link} to={`/categories/${category.dirname}`} className="text-capitalize">{category.name}</NavDropdown.Item>)
	});

	if (categoriesStatus === 'loading') {
		return <Loader />
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
