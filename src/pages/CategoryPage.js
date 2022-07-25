import { Component } from "react";
import { Breadcrumb, BreadcrumbItem, Container } from "react-bootstrap";
import Posts from "../components/Posts";
import { Link } from "react-router-dom";

class CategoryPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			path: this.props.match.params.path,
			name: this.props.match.params.path.split("-").join(" "),
		};
	}

	render() {
		const { path, name } = this.state;

		return (
			<Container className="about-page my-5">
				<Breadcrumb>
					<BreadcrumbItem linkAs={Link} linkProps={{ to: "/" }}>Home</BreadcrumbItem>
					<BreadcrumbItem className="text-capitalize" linkAs={Link} linkProps={{ to: `/categories/${path}` }}>{name}</BreadcrumbItem>
				</Breadcrumb>
				<h1 className="text-center text-capitalize mb-5">{name}</h1>
				<Posts path={path} />
			</Container>
		);
	}
}

export default CategoryPage;
