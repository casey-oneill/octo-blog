import { Component } from "react";
import { Container } from "react-bootstrap";
import { buildOctokit } from "../util/util";

class AboutPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			user: null,
		};
	}

	componentDidMount() {
		this.fetchUser();
	}

	fetchUser = async () => {
		const octokit = await buildOctokit();
		const user = await octokit.request("GET /user", {});

		this.setState({
			isLoading: false,
			user: user.data,
		});
	}

	render() {
		const { isLoading, user } = this.state;
		if (isLoading) {
			return (
				<Container className="about-page my-5">
					<h1 className="text-center">About</h1>

					{/* TODO: Create custom loader */}
					<p>Loading...</p>
				</Container>
			);
		}

		return (
			<Container className="about-page my-5">
				<h1 className="text-center">About</h1>
				<p>{user.name}</p>
				<p>{user.bio}</p>
			</Container>
		);
	}
}

export default AboutPage;
