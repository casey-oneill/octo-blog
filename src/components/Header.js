import { MarkGithubIcon } from "@primer/octicons-react";
import { Component } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

class Header extends Component {

	render() {
		return (
			<div className="header">
				<Navbar className="shadow-sm" bg="light" expand="lg">
					<Container>
						<Navbar.Brand as={Link} to="/">{process.env.REACT_APP_NAME}</Navbar.Brand>
						<Navbar.Toggle aria-controls="navbar-nav" />
						<Navbar.Collapse id="navbar-nav" className="justify-content-end">
							<Nav>
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
