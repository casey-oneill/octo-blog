import { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

var Remarkable = require('react-remarkable');

class PostPreview extends Component {
	render() {
		const { title, createdDate, modifiedDate, content } = this.props;

		var updatedDate = createdDate;
		if (modifiedDate !== null && modifiedDate !== undefined) {
			updatedDate = modifiedDate;
		}
		updatedDate = updatedDate.toLocaleString("en-CA", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});

		return (
			<div className="post-preview my-3">
				<Card className="post-preview-card shadow" style={{ width: "18rem" }}>
					<Card.Body>
						<Card.Title>{title}</Card.Title>

						<Card.Subtitle className="mb-2 text-muted">Updated: {updatedDate}</Card.Subtitle>
						<Card.Text>
							<Remarkable source={content} />
						</Card.Text>
						<Button as={Link} variant="primary" to="/edit/sample-post">Edit</Button>
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default PostPreview;
