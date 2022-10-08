import React, { useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, selectAllCategories } from "./categoriesSlice";
import { STATUS } from "../../util/constants";

const CategoriesList = () => {
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
		categoryItems.push(
			<ListGroup.Item key={i} action as={Link} to={`/categories/${category.dirname}`}>
				{category.name}
			</ListGroup.Item>
		);
	});

	if ([STATUS.IDLE, STATUS.LOADING].includes(categoriesStatus)) {
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
