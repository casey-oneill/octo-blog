import React, { useState, useEffect } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { buildOctokit } from "../util/util";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Categories = () => {
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
		categoryItems.push(
			<ListGroup.Item key={i} action as={Link} to={`/categories/${category.dirname}`}>
				{category.name}
			</ListGroup.Item>
		);
	});

	if (loading) {
		return <Loader />
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

export default Categories;
