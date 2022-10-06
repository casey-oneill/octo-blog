import React, { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, Card, Container } from "react-bootstrap";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import { buildOctokit } from "../util/util";
import Loader from "../components/Loader";

const readingTime = require("reading-time");

const PostPage = (props) => {
	const path = props.match.params.path;
	const name = props.match.params.path.split("-").join(" ");
	const dirname = props.match.params.category;

	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState(null);
	const [createdDate, setCreatedDate] = useState(null);
	const [modifiedDate, setModifiedDate] = useState(null);
	const [content, setContent] = useState(null);

	useEffect(() => {
		// Fetch post data from GitHub API
		const fetchPostContent = async (path) => {
			const octokit = await buildOctokit();
			const metadata = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/{path}", {
				owner: process.env.REACT_APP_GH_OWNER,
				repo: process.env.REACT_APP_GH_REPO,
				path: path,
			});

			const content = atob(metadata.data.content); // FIXME: Deprecated method
			setContent(content);

			const commits = await octokit.request("GET /repos/{owner}/{repo}/commits{?path}", {
				owner: process.env.REACT_APP_GH_OWNER,
				repo: process.env.REACT_APP_GH_REPO,
				path: "blog/" + path,
			});
			setCreatedDate(commits.data.at(-1).commit.committer.date);

			if (commits.data.length > 1) {
				setModifiedDate(commits.data.at(0).commit.committer.date);
			}

			setLoading(false);
		};

		if (dirname !== undefined && dirname !== null) {
			fetchPostContent(dirname + "/" + props.match.params.path + ".md");
			setCategory(dirname.split("-").join(" "));
		} else {
			fetchPostContent(props.match.params.path + ".md");
		}
	}, [dirname, props.match.params.path]);

	var breadCrumbItems = [];
	breadCrumbItems.push(<BreadcrumbItem linkAs={Link} linkProps={{ to: "/" }}>Home</BreadcrumbItem>);
	if (dirname !== undefined && dirname !== null) {
		breadCrumbItems.push(<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/categories/${dirname}` }}>{category}</BreadcrumbItem>);
		breadCrumbItems.push(<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/posts/${dirname}/${path}` }}>{name}</BreadcrumbItem>);
	} else {
		breadCrumbItems.push(<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/posts/${path}` }}>{name}</BreadcrumbItem>);
	}

	var formattedDate = "";
	if (modifiedDate !== null) {
		formattedDate = "Updated " + format(new Date(modifiedDate), "MMMM dd, yyyy");
	} else {
		formattedDate = "Published " + format(new Date(createdDate), "MMMM dd, yyyy");
	}

	const stats = readingTime(
		content);
	const readingTimeStats = stats.text;

	if (loading) {
		return <Loader />
	}

	return (
		<Container className="post-page my-5">
			<Breadcrumb>
				{breadCrumbItems}
			</Breadcrumb>
			<Card className="bg-light mb-5">
				<Card.Body>
					<p className="my-0 text-muted">{formattedDate}</p>
					<p className="my-0 text-muted">{readingTimeStats}</p>
				</Card.Body>
			</Card>
			<Post content={content} />
		</Container>
	);
};

export default PostPage;
