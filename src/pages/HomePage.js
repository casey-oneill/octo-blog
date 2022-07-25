import { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Categories from "../components/Categories";
import Posts from "../components/Posts";

class HomePage extends Component {

	render() {
		return (
			<Container className="home py-5">
				<h1 className="text-center mb-5">Blog Posts</h1>
				<Row>
					<Col xs={12} lg={3}>
						<Categories />
					</Col>
					<Col xs={12} lg={9}>
						<Posts />
					</Col>
				</Row>
			</Container>
		);
	}
}

export default HomePage;
