import { Octokit } from "octokit";
import { createTokenAuth } from "@octokit/auth-token";

export const buildOctokit = async () => {
	const { token } = await createTokenAuth(process.env.REACT_APP_GH_TOKEN).call();
	return new Octokit({ auth: token });
}
