const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const npm_argv = JSON.parse(process.env.npm_config_argv || '{}');

if (!(npm_argv && npm_argv.original instanceof Array)) {
    throw TypeError('Build Fail! npm argv Error.');
}

// Get source code version info with GIT
const currentPath = 'cd ' + process.cwd() + '\n';

const commands = {
  commit_date: 'git --no-pager log --format="%ai" -n1 HEAD',
  commit_branch: 'git name-rev --name-only HEAD',
  commit_id: 'git rev-parse HEAD',
};

function execGitCommand(cmd) {
  let result;

  try{
    result = childProcess.execSync(currentPath + commands[cmd]);
    result = result.toString('utf8').trim();
  } catch(e){
    console.error('ERROR! Failed to execute command: ' + cmd);
    console.error(e);
  }

  return result;
};

function filterValid(responseObject, value) {
  if (!commands[value]) {
    if (!responseObject.errors) {
      responseObject.errors = [];
    }
    responseObject.errors.push(value);
  }
  return !!commands[value];
}

function gitInfo(cmdData) {
  if(!cmdData){
    return;
  }

  if (!Array.isArray(cmdData)) {
    cmdData = [cmdData];
  }

  let responseObject = {};

  let cmdList = cmdData.filter(filterValid.bind(null, responseObject));

  if (responseObject.errors) {
    console.log('ERROR! No valid definitions for ' + JSON.stringify(responseObject.errors));
    return;
  } 

  cmdList.forEach(function(cmd){
    responseObject[cmd] = execGitCommand(cmd);
  });

  return responseObject;
};

function saveVersion(){
  const gitData = gitInfo(['commit_branch', 'commit_id', 'commit_date']) || {};
  gitData["build_date"] = new Date().toString();

  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
  const publicFolderPath = resolveApp('public');

  fs.writeFileSync(publicFolderPath + '/version.json', JSON.stringify(gitData));
}

try{
  saveVersion();
  console.log("version.json file generation completed!")
} catch(e){
  console.log(e)
  console.log("version.json file generation failed!")
}