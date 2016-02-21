/* jshint node: true */
'use strict';

// This can occur when passed in a github username/repo combo which is what some CI environments have by
// default
module.exports = function(issueNumberString) {
  const lastSlash = issueNumberString.lastIndexOf('/');
  if (lastSlash === -1) {
    return issueNumberString;
  }

  let tokens = issueNumberString.split('/');
  return tokens[tokens.length - 1];
};
