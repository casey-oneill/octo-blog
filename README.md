# OctoBlog

> A free and open source blog template using GitHub services.

OctoBlog is a free and open source blog template implemented using [React](https://reactjs.org/), designed to provide non-developers with the ability to host and maintain a blog using GitHub's free services.

[![License](https://img.shields.io/github/license/casey-oneill/octo-blog?style=flat-square)](license)

## Table of contents

<!-- toc -->

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Known Issues and Limitations](#known-issues-and-limitations)
- [Getting Help](#getting-help)
- [Contributing](#contributing)
- [License](#license)
- [Authors and History](#authors-and-history)
- [Acknowledgements](#acknowledgements)

<!-- tocstop -->

## Introduction

The OctoBlog template is designed to empower anyone with a GitHub account to make use of GitHub's free services to host their own blog. The template fetches blog posts from your repository using the GitHub API. This means that you will only need to deploy your blog website once, and then you'll be set to blog for life!

You write your blog posts in [Markdown](https://www.markdownguide.org/getting-started/), commit them to your blog's GitHub repository, and watch as they are added to your blog website.

### Features
- **Simple**: Deploy once, blog forever.
- **Complete**: Comes with functionality expected of a standard personal blog. Organize your posts into categories. Tell the world about yourself with the _About_ section.
- **Responsive**: Your blog will look good on all devices, no matter the screen size.
- **Customizable**: Easily customize your blog's look with [Bootswatch](https://bootswatch.com/) themes or dig in and modify the project's React components to your taste.
- **Extendable**: Something missing? Modify this free and open source [React](https://reactjs.org/) project to implement the features you need.

### Technology stack
OctoBlog is implemented using [React](https://reactjs.org/), [Bootstrap](https://getbootstrap.com/), and [octokit.js](https://github.com/octokit/octokit.js). It's also free and open source, making it a great jumping-off point for developers looking for a free, customizable blog template.

## Installation

### Step 1: Create a GitHub account

GitHub is a hosting service for software development. To host your blog using the OctoBlog template, you will need to [sign up](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home) for a free account.

### Step 2: Create a personal access token

The OctoBlog template will use this token let the GitHub services we are using that it is acting on your behalf. Without this token, GitHub will limit the number of time your blog may retrieve information to 60 times per hour. Yikes! By associating the blog with your account, this limit is increased to 5000 requests per hour. If you find that this is not enough to sustain for your blog, then unfortunately OctoBlog may not be the tool for you, as there are [few ways](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps) to further increase the request limit.

GitHub provides great documentation for [creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Pending further testing, the exact permissions required for the OctoBlog template to work correctly are unknown. To be safe, give OctoBlog full permissions.

### Step 3: Install Node.js

You will need this software to deploy your blog to [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages), a free website hosting service provided by GitHub. Download the [latest version](https://nodejs.dev/download/).

To verify your Node installation, run the following commands in your terminal:

```
node --version
npm --version
```

### Step 4: Install git

You will need this software to download the OctoBlog template. Download the [latest version](https://git-scm.com/downloads).

To verify your Node installation, run the following command in your terminal:

```
git --version
```

### Step 5: Download OctoBlog template

To download the OctoBlog template, run the following command in your terminal:

```
git clone https://github.com/casey-oneill/octo-blog.git
```

To verify your download, find the `octo-blog` project in your computer's files. It will have been downloaded to the folder in which you ran the above command.

### Step 4: Configure template

Configure the OctoBlog template by modifying the project's `.env` file. Using a lightweight code editing program such as [Visual Studio Code](https://code.visualstudio.com/) or [Atom](https://atom.io/) is not required, but recommended, as your computer may struggle to figure out how to open this kind of file. If you do not want to install a code editor, programs like Notepad (Windows) or vi (Unix) can be used.

Update the `.env` file for your blog. When you're done, it should look something like this:

```sh
# GitHub Settings
REACT_APP_GH_OWNER=github-user-123 # your GitHub username
REACT_APP_GH_REPO=octo-blog # name of the repository storing your blog
REACT_APP_GH_REPO_URL=https://github.com/github-user-123/octo-blog # full url to your blog's repository
REACT_APP_GH_TOKEN=ghp_IqIMN0ZH6z0wIEB4T9A2g4EHMy8Ji42q4HA5 # your personal access token

# App Settings
REACT_APP_NAME=Best Books Blog # name of your blog
```

Update the `package.json` file for your blog. Node will use this file when deploying your blog.

Change the following line:

```
"homepage": "https://casey-oneill.github.io/octo-blog"
```

to point to your blog, rather than the OctoBlog template's repository:

```
"homepage": "https://{your-github-username}.github.io/{your-blog-repository}"
```

### Step 5: Deploy your blog

Now that the OctoBlog template is configured, you can deploy it to GitHub Pages.

To deploy your blog, navigate to the `octo-blog` root folder and run the following command in your terminal:

```
npm run deploy -- -m "Deploy blog to GitHub Pages"
```

Congratulations! You're blog is now available at the following URL: [https://{your-github-username}.github.io/{your-blog-repository}](https://{your-github-username}.github.io/{your-blog-repository}). Note that it may take a few minutes for the deployment process to complete.

## Usage

OctoBlog is designed to be as simple as possible to use, making your blogging workflow smooth and easy. Blog posts are written in [Markdown](https://www.markdownguide.org/getting-started/), a lightweight language for formatting (i.e., marking down) text files. To learn how to format your Markdown posts, refer to any of the helpful guides available online, such as those provided by [markdownguide.org](https://www.markdownguide.org/). You may also benefit from using Markdown editing software such as [StackEdit](https://stackedit.io/), which will show you what your finished post will look like as you type and provide a helpful user interface.

### Creating a post

Using the GitHub website is the easiest way to create blog posts. Each post is stored as a new file in the project's `/blog` folder. To create a post of your own, navigate to your blog repository and select the `blog` folder. Then, select the `Add File > Create new file` menu item. Name the new file whatever you want - just be sure that its name ends with `.md` to indicate that it is a Markdown file. If you forget to do this, the OctoBlog template will not display your post correctly. Enter the content of your post using GitHub's online editor, then click `Commit` when you're ready to upload the post, making sure that the default `Commit directly to the main branch` option is selected. If your post isn't perfect, don't worry - GitHub allows you to edit Markdown files after they've been committed to a repository. Now your post will be visible on your website.

Make sure that your post follows the OctoBlog-expected format:

```
# Title of Post

Post content goes here. The first paragraph, no matter how long it is, will be used as the post's preview. It is recommended that you use this paragraph to provide a brief summary of post.

The rest of the post's content goes here...
```

If you do not follow this format, OctoBlog will not be able to display your post correctly. Post previews on the home page of your blog will not be shown correctly, if at all. At a minimum, the first paragraph _must_ contain only the title of the post and begin with a `# `.

### Organizing posts by category

The OctoBlog template allows you to organize your posts into categories. Each category is stored as a sub-folder in the project's `/blog` folder. To add categories to posts, simply save them to a category sub-folder, rather than to the main `/blog` folder.

Make sure that your category sub-folder follows the OctoBlog-expected format, where each individual word of the category is separated by a `-`. For example, if I want to create a category called `Action Movie Reviews`, I will name my sub-folder `action-movie-reviews`.

To create a new folder in GitHub, simply add the new file path to the name of your post's Markdown file. For example, if I want to move the post `thor-love-and-thunder-review.md` to the sub-folder (i.e., category) `action-movies`, I will edit the post and rename it: `action-movies/thor-love-and-thunder-review.md`.

Note that a blog post may belong to only one category and that sub-categories are not supported. This means that posts stored to sub-folders of category folders will not be displayed correctly, if at all.

## Known issues and limitations

OctoBlog uses the GitHub API and is thus restricted by the [rate limits for GitHub apps](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps). This means that the applciation is limited to 5000 requests per hour. This may be sufficient for supporting a small blog with low amounts of traffic, but will not be enough for hosting large-scale, popular blogs. Optimizing the number of API calls made by this application will help to prevent errors caused by exceeding the hourly rate limit. However, there are few options for increasing the rate limit beyong 5000 requests per hour. If you anticipate a high amount of traffic for your blog, then unfortunately OctoBlog may not be the tool for you.

## Getting help

To report a problem or to request a new feature, please use the [issues tracker](https://github.com/casey-oneill/octo-blog/issues/new) for this repository. Your patience and consideration when submitting a request is appreciated. Please do not contact the owner(s) of this project directly.

## Contributing

Want to help develop this project even further? Your help is always welcome. To contribute, clone the repository to your local machine and create a new branch off of the latest release branch (this may not always match the official release version) to contain your work. If no release branches (ex. `v1.2.1`) exist, you may branch off of the `main` branch.

Please note that all branches of this project are protected, meaning that any changes must undergo a review process before they can be integrated with the main codebase. When you're ready to submit your contribution, create a new pull request for your branch. An project administrator will review your changes. If they feel that your changes can be integrated with the main codebase, they will merge your branch. Alternatively, they may choose to leave constructive feedback on your pull request. To increase the chances of your pull request being merged, remember to include a clear, helpful description of your changes and to link the issue you are working on.

## License
[MIT](license)

## Authors and history

The original author of this project is [Casey O'Neill](https://github.com/casey-oneill). The project is currently pending an official (non-beta) release, and is undergoing a quality assurance process.

## Acknowledgements

This project is made possible by the following technologies and/or libraries:

- GitHub
- React
- React Bootstrap
- Bootswatch
- Octicons
- octokit
- date-fns
- react-remarkable
- reading-time
