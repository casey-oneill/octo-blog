import React from "react";
import { Breadcrumb, BreadcrumbItem, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import PostsList from "../posts/PostsList";

const CategoryPage = (props) => {
	const path = props.match.params.path;
	const name = props.match.params.path.split("-").join(" ");

	return (
		<Container className="about-page my-5">
			<Breadcrumb>
				<BreadcrumbItem linkAs={Link} linkProps={{ to: "/" }}>Home</BreadcrumbItem>
				<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/categories/${path}` }}>{name}</BreadcrumbItem>
			</Breadcrumb>
			<h1 className="text-center text-capitalize mb-5">{name}</h1>
			<PostsList path={path} />
		</Container>
	);
};

export default CategoryPage;
