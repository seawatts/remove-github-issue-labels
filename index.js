#!/usr/bin/env node
'use strict';
require('dotenv').config();
const getEnvVar = require('./utils/get-env-var');
const getNormalizedIssueNumber = require('./utils/get-normalized-issue-number');
const getNormalizedRepoName = require('./utils/get-normalized-repo-name');
const GitHubApi = require("github");
const program = require('commander');
const chalk = require('chalk');
const projectVersion = require('./package.json').version;
const Q = require('q');
const _ = require('lodash');

let labelsToRemove = [];

program
  .version(projectVersion)
  .arguments('<labels>')
  .action(function(labels) {
    labelsToRemove = labels.split(',');
  })
  .usage('[options] <labels ...>')
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

console.log(chalk.green(`Removing labels "${labelsToRemove.toString()}" from ${githubUser}/${githubRepo} issue:${issueNumber}`));

const getIssue = Q.denodeify(github.issues.getRepoIssue);
const editIssue = Q.denodeify(github.issues.edit);

Q.spawn(function*() {
  let issue = yield getIssue({
    user: githubUser,
    repo: githubRepo,
    number: issueNumber
  });

  let labelsToKeep = _.reject(issue.labels, (label) => {
    return _.indexOf(labelsToRemove, label.name) > -1;
  });

  labelsToKeep = _.map(labelsToKeep, (label) => label.name);

  try {
    yield editIssue({
      user: githubUser,
      repo: githubRepo,
      number: issueNumber,
      labels: labelsToKeep
    });
  } catch (ex) {
    console.error(chalk.red(`Could not remove any labels from issue:${issueNumber} because ${err}`));
    process.exit(1);
  }

  console.log(chalk.green(`Labels removed from issue:${issueNumber}`));
  process.exit();
});
