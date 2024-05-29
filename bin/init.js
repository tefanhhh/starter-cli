#!/usr/bin/env node

import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import ora from 'ora';

const git = simpleGit();
const repoUrl = 'https://github.com/tefanhhh/nestjs-starter.git';

async function init() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-project',
    }
  ]);

  const targetDir = path.join(process.cwd(), answers.projectName);
  const spinner = ora('Cloning repository...').start();

  git.clone(repoUrl, targetDir)
    .then(() => {
      spinner.succeed('Repository cloned successfully.');

      // Clean up unnecessary files (e.g., .git folder)
      fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });

       // Change package.json name
       const packageJsonPath = path.join(targetDir, 'package.json');
       const packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
       packageJsonData.name = answers.projectName;
       fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonData, null, 2));

      console.log(`Project initialized successfully in ${targetDir}.`);
    })
    .catch((err) => {
      spinner.fail('Failed to clone repository.');
      console.error(err);
    });
}

init();