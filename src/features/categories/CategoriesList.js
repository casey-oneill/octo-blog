import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { selectAllCategories } from "./categoriesSlice";

const CategoriesList = () => {
	const categories = useSelector(selectAllCategories);
	const categoriesStatus = useSelector((state) => state.categories.status);

	var categoryItems = [];
	categories.forEach((category, i) => {
		categoryItems.push(
			<ListGroup.Item key={i} action as={Link} to={`/categories/${category.dirname}`}>
				{category.name}
			</ListGroup.Item>
		);
	});

	if (categoriesStatus === 'loading') {
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
