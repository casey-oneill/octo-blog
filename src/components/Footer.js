import { Component } from "react";

class Footer extends Component {

	render() {
		return (
			<footer className="footer bg-light py-3 mt-auto">
				<div className="text-center text-muted">
					Powered by <a href="https://github.com/casey-oneill/octo-blog">OctoBlog</a>.
				</div>
			</footer>
		);
	}
}

export default Footer;
