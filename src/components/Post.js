import { Component } from "react";
import { Card } from "react-bootstrap";

var Remarkable = require('react-remarkable');

class Post extends Component {

	render() {
		return (
			<div className="post">
				<Card>
					<Card.Body>
						<Card.Text as={Remarkable} source={this.props.content} />
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default Post;
