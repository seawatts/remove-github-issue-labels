# Remove Github Issue Labels

> A small library that will allow you to remove all the github labels on a specific github issue or PR. 

## Quick Start

To get up and running quickly, do the following:

- Install this package

```bash
$ npm install remove-github-issue-labels 
```

- Run the script

```bash
$ remove-github-issue-labels
```

## Command line arguments

```bash
$ remove-github-issue-labels -h
```

## Config

### github token 

- Get a github api [token](https://github.com/settings/tokens) make sure the `repo` and or `repo:public_repo` scope is 
selected
- Set the token as an env var *(recommended)*
  - Env var: `GITHUB_TOKEN=123abc` 
- You can pass in the token as a command line argument.

### user name

- Set the user name as an env var
  - Env var: `GITHUB_USER_OR_ORGANIZATION=12`
- You can pass in the user name as a command line argument

### repo name

- Set the repo name as an env var
  - Env var: `GITHUB_REPO=12`
- You can pass in the repo name as a command line argument


### issue number

- Set the token as an env var *(recommended)*
  - Env var: `GITHUB_ISSUE_NUMBER=12`
- You can pass in the issue number as a command line argument

