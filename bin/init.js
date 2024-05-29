#!/usr/bin/env node

import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import ora from 'ora';

const git = simpleGit();
const repoUrl = {
  'nestjs-starter': 'https://github.com/tefanhhh/nestjs-starter.git',
  'vite-react-starter': 'https://github.com/tefanhhh/vite-react-starter.git',
};

async function init() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'Choose Template',
      message: 'What template you want to use ?',
      choices: Object.keys(repoUrl),
    },
    {
      type: 'input',
      name: 'name',
      message: 'Project Name:',
      default: 'my-project',
    },
    {
      type: 'input',
      name: 'version',
      message: 'Project Version:',
      default: '1.0.0',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project Description:',
      default: 'My NestJS project.',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Project Author:',
      default: 'Tefan Haetami',
    },
  ]);

  const targetDir = path.join(process.cwd(), answers.name);
  const spinner = ora('Cloning repository...').start();

  git.clone(repoUrl, targetDir)
    .then(() => {
      spinner.succeed('Repository cloned successfully.');

      // Clean up unnecessary files (e.g., .git folder)
      fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });

       // Change package.json name, version, description, and author
       const packageJsonPath = path.join(targetDir, 'package.json');
       const packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
       packageJsonData.name = answers.name;
       packageJsonData.version = answers.version;
       packageJsonData.description = answers.description;
       packageJsonData.author = answers.author;
       packageJsonData.private = true;
       packageJsonData.license = 'MIT';
       fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonData, null, 2));

      console.log(`Project initialized successfully in ${targetDir}.`);
    })
    .catch((err) => {
      spinner.fail('Failed to clone repository.');
      console.error(err);
    });
}

init();