// scripts/publish-packages.js

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { execSync } = childProcess;

function getChangedPackages() {
  const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', {
    encoding: 'utf-8',
  });
  return changedFiles
    .split('\n')
    .filter(
      (file) => file.startsWith('packages/') && file.endsWith('package.json')
    );
}

function getPackageVersion(packageJsonPath) {
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(content);
  return packageJson.version;
}

function checkVersionChanges(changedPackages) {
  const versionChanges = [];
  for (const packageJsonPath of changedPackages) {
    const oldVersion = getPackageVersion(`HEAD~1:${packageJsonPath}`);
    const newVersion = getPackageVersion(packageJsonPath);
    if (oldVersion !== newVersion) {
      versionChanges.push(packageJsonPath);
    }
  }
  return versionChanges;
}

function getTagFromVersion(version) {
  const preReleaseMatch = version.match(/-([a-zA-Z0-9]+)/);
  if (preReleaseMatch) {
    return preReleaseMatch[1];
  }
  return 'latest';
}

function publishPackages(versionChanges) {
  for (const packageJsonPath of versionChanges) {
    const packageDir = path.dirname(packageJsonPath);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;
    const tag = getTagFromVersion(version);

    console.log(`Publishing package in ${packageDir} with tag ${tag}`);
    execSync(`cd ${packageDir} && npm publish --tag ${tag}`, {
      stdio: 'inherit',
    });
  }
}

function main() {
  const changedPackages = getChangedPackages();
  if (changedPackages.length === 0) {
    console.log('No package.json files changed.');
    return;
  }

  const versionChanges = checkVersionChanges(changedPackages);
  if (versionChanges.length === 0) {
    console.log('No version changes detected.');
    return;
  }

  publishPackages(versionChanges);
}

main();
