import { Component } from "react";
import { Container } from "react-bootstrap";
import Posts from "../components/Posts";

class HomePage extends Component {

	render() {
		return (
			<Container className="home py-5">
				<h1 className="text-center mb-3">Blog Posts</h1>
				<Posts />
			</Container>
		);
	}
}

export default HomePage;
