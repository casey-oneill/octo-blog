import { Component } from "react";
import Posts from "../components/Posts";

class HomePage extends Component {

	render() {
		return (
			<div className="home">
				<Posts />
			</div>
		);
	}
}

export default HomePage;
