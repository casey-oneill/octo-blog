import { Component } from "react";
import { Container, Image, Nav, Navbar, Spinner } from "react-bootstrap";
import PostPreview from "./components/PostPreview";
import { posts } from "./posts/posts";

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			userData: [],
			posts: [],
		}
	}

	importAll(r) {
		return r.keys().map(r);
	}

	componentDidMount() {
		fetch("https://api.github.com/users/casey-oneill")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						userData: result,
					})
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error,
					})
				}
			);

		posts.forEach((post) => {
			var posts = this.state.posts;
			posts.push(
				<PostPreview {...post} />
			);
			this.setState({
				posts: posts,
			})
		});
	}

	render() {
		const { error, isLoaded, userData, posts } = this.state;
		if (error) {
			return (<div>Error: {error.message}</div>);
		} else if (!isLoaded) {
			return (
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			);
		} else {
			return (
				<div className="dashboard">
					<Navbar className="shadow-sm" bg="light" expand="lg">
						<Container>
							<Navbar.Brand>OctoBlog</Navbar.Brand>
							<Navbar.Toggle aria-controls="navbar-nav" />
							<Navbar.Collapse id="navbar-nav" className="justify-content-end">
								<Nav>
									<Navbar.Text>
										<Image src={userData.avatar_url} roundedCircle thumbnail width={40} height={40} />
									</Navbar.Text>
									<Navbar.Text className="mx-2 my-auto">{userData.name}</Navbar.Text>
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>

					<Container>
						<div className="dashboard-content py-3">
							<b>Dashboard</b>
							<div className="dashboard-body">
								{posts}
							</div>
						</div>
					</Container>

					<footer className="bg-light py-3">
						<div className="text-center text-muted">
							Powered by <a href="https://github.com/casey-oneill/octo-blog">OctoBlog</a>.
						</div>
					</footer>
				</div>
			);
		}
	}
}

export default Dashboard;
