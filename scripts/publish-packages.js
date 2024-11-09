// scripts/publish-packages.js

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { execSync } = childProcess;

function getPackageVersion(packageJsonPath) {
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(content);
  return packageJson.version;
}

function getPackageName(packageJsonPath) {
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(content);
  return packageJson.name;
}

function checkVersionExistsOnNpm(packageName, version) {
  try {
    const result = execSync(`npm view ${packageName}@${version} version`, {
      encoding: 'utf-8',
    }).trim();
    return result === version;
  } catch (error) {
    // If the command fails, it means the version does not exist
    return false;
  }
}

function publishPackages() {
  const packagesDir = 'packages';
  const packageDirs = fs
    .readdirSync(packagesDir)
    .filter((dir) => fs.statSync(`${packagesDir}/${dir}`).isDirectory());

  for (const packageDir of packageDirs) {
    const packageJsonPath = `${packagesDir}/${packageDir}/package.json`;
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`Skipping ${packageDir} as package.json does not exist.`);
      continue;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version;
    const packageName = packageJson.name;
    const tag = getTagFromVersion(version);

    if (checkVersionExistsOnNpm(packageName, version)) {
      console.log(
        `Version ${version} of package ${packageName} already exists on npm. Skipping.`
      );
    } else {
      console.log(
        `Publishing package ${packageName} in ${packageDir} with tag ${tag}`
      );
      execSync(`cd ${packagesDir}/${packageDir} && pnpm publish --tag ${tag}`, {
        stdio: 'inherit',
      });
    }
  }
}

function getTagFromVersion(version) {
  const preReleaseMatch = version.match(/-([a-zA-Z0-9]+)/);
  if (preReleaseMatch) {
    return preReleaseMatch[1];
  }
  return 'latest';
}

function main() {
  publishPackages();
}

main();
