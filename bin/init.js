#!/usr/bin/env node

const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const ora = require('ora');

const git = simpleGit();
const repoUrl = 'https://github.com/tefanhhh/nestjs-starter.git';

async function init() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'nestjs-starter',
    }
  ]);

  const targetDir = path.join(process.cwd(), answers.projectName);
  const spinner = ora('Cloning repository...').start();

  git.clone(repoUrl, targetDir)
    .then(() => {
      spinner.succeed('Repository cloned successfully.');

      // Clean up unnecessary files (e.g., .git folder)
      fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });

      console.log(`Project initialized successfully in ${targetDir}.`);
    })
    .catch((err) => {
      spinner.fail('Failed to clone repository.');
      console.error(err);
    });
}

init();
