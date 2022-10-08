import { Octokit } from 'octokit';
import { createTokenAuth } from '@octokit/auth-token';
import { format } from 'date-fns';

let octokit = null;
export const buildOctokit = async () => {
	if (octokit === null) {
		const { token } = await createTokenAuth(process.env.REACT_APP_GH_TOKEN).call();
		octokit = new Octokit({ auth: token });
	}
	return octokit;
};

// Given a post path, parse and return the title of the post
export const parsePostTitle = (path) => {
	return path.split('/').slice(-1)[0].replace('.md', '').split('-').join(' ');
};

// Given post content, parse and return a post preview (this is simply the content without the title and first blankline)
export const parsePostPreview = (content) => {
	return content.split("\n").at(2);
}

// Given post commit, parse and return the created date at which the post was created
export const parseCreatedDate = (commits) => {
	return formatDate(commits.at(-1).commit.committer.date);
}

// Given post commit, parse and return the formatted date at which the post was most recently created or updated
export const parseModifiedDate = (commits) => {
	return formatDate(commits.at(0).commit.committer.date);
}

// Given a date string, format and return it
export const formatDate = (date) => {
	return format(new Date(date), 'MMMM dd, yyyy');
}

// Given a category path, parse and return the relative link (to be attached to a <Link />) for that category
export const buildRelativeCategoryLink = (path) => {
	return (path === null || path === undefined) ? undefined : '/categories/'.concat(path);
}

// Given a post path, parse and return the relative link (to be attached to a <Link />) for that post
export const buildRelativePostLink = (path) => {
	const simplePath = path.replace('blog/', '').replace('.md', '');
	return '/posts/'.concat(simplePath);
}

// Given a category path, build and return the API path for that category
export const buildCategoryPath = (category) => {
	return category === undefined ? undefined : 'blog/'.concat(category);
}

// Given a category path and a post name, build and return the API path for that post
export const buildPostPath = (category, name) => {
	const filename = name.concat('.md');
	return category === undefined ? 'blog/'.concat(filename) : 'blog/'.concat(category).concat('/').concat(filename);
}
