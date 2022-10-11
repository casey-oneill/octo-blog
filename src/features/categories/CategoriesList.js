import React, { useEffect } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectAllCategories } from './categoriesSlice';
import { Status } from '../../util/constants';
import { buildRelativeCategoryLink, formatName } from '../../util/util';

const CategoriesList = () => {
	const dispatch = useDispatch();
	const categories = useSelector(selectAllCategories);
	const categoriesStatus = useSelector((state) => state.categories.status);

	useEffect(() => {
		if (categoriesStatus === Status.Idle) {
			dispatch(fetchCategories());
		}
	}, [categoriesStatus, dispatch]);

	const categoryItems = categories.map((category) => {
		const relLink = buildRelativeCategoryLink(category.name);
		const name = formatName(category.name);
		return (
			<ListGroup.Item key={category.sha} action as={Link} to={relLink}>
				{name}
			</ListGroup.Item>
		);
	});

	if ([Status.Idle, Status.Loading].includes(categoriesStatus)) {
		return (
			<Loader />
		);
	}

	return (
		<Card className="bg-light">
			<Card.Header>Categories</Card.Header>
			<ListGroup variant="flush" className="text-capitalize">
				{categoryItems}
			</ListGroup>
		</Card>
	);
};

export default CategoriesList;
