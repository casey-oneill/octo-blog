import { Component } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

class Layout extends Component {

	render() {
		return (
			<div className="d-flex flex-column min-vh-100">
				<Header />
				<Outlet />
				<Footer />
			</div>
		);
	}
}

export default Layout;
