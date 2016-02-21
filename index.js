'use strict';
require('dotenv').config();
const getEnvVar = require('./utils/get-env-var');
const getNormalizedIssueNumber = require('./utils/get-normalized-issue-number');
const getNormalizedRepoName = require('./utils/get-normalized-repo-name');
const GitHubApi = require("github");
const program = require('commander');
const chalk = require('chalk');
const projectVersion = require('./package.json').version;

program
  .version(projectVersion)
  .option('-t, --token', 'Github token')
  .option('-i, --user', 'Github user name or organization')
  .option('-r, --repo', 'Github repo name')
  .option('-u, --issue', 'Github issue number')
  .parse(process.argv);

var github = new GitHubApi({
  version: "3.0.0"
});

github.authenticate({
  type: "oauth",
  token: getEnvVar('GITHUB_TOKEN', program.token)
});

let issueNumber = getEnvVar('GITHUB_ISSUE_NUMBER', program.issue);
issueNumber = getNormalizedIssueNumber(issueNumber);

let githubUser = getEnvVar('GITHUB_USER_OR_ORGANIZATION', program.user);
let githubRepo = getEnvVar('GITHUB_REPO', program.repo);
githubRepo = getNormalizedRepoName(githubRepo);

console.log(chalk.green(`Removing all labels from ${githubUser}/${githubRepo} issue:${issueNumber}`));

github.issues.edit({
  user: githubUser,
  repo: githubRepo,
  number: issueNumber,
  labels: []
}, function(err) {
  if (err) {
    console.error(chalk.red(`Could not remove any labels from issue:${issueNumber} because ${err}`));
    process.exit(1);
    return;
  }

  console.log(chalk.green(`All labels removed from issue:${issueNumber}`));
  process.exit();
});
