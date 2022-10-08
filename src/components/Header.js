import React, { useEffect } from 'react';
import { MarkGithubIcon } from '@primer/octicons-react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectAllCategories } from '../features/categories/categoriesSlice';
import { STATUS } from '../util/constants';

const Header = () => {
	const dispatch = useDispatch();
	const categories = useSelector(selectAllCategories);
	const categoriesStatus = useSelector((state) => state.categories.status);

	useEffect(() => {
		if (categoriesStatus === STATUS.IDLE) {
			dispatch(fetchCategories());
		}
	}, [categoriesStatus, dispatch]);

	var categoryItems = [];
	categories.forEach((category, i) => {
		categoryItems.push(<NavDropdown.Item key={i} as={Link} to={`/categories/${category.dirname}`} className="text-capitalize">{category.name}</NavDropdown.Item>)
	});

	if ([STATUS.IDLE, STATUS.LOADING].includes(categoriesStatus)) {
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
