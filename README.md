# TSSC E2E Testing Framework and Tests

## Overview

This project is an end-to-end automation testing framework designed to validate the functionality of the [Red Hat Trusted Software Supply Chain CLI ](https://github.com/redhat-appstudio/rhtap-cli) (tssc). Built with Playwright and TypeScript, this framework simulates real-world user interactions and backend processes to ensure the reliability and correctness of tssc's core features.

## Prerequisites

Before using this testing framework, ensure you have:

* An OpenShift cluster with tssc installed and properly configured(Enable `debug/ci=true`)

* Node.js (v23+)

* ArgoCD CLI installed

## Getting Started

1. Install Dependencies
```
# Install dependencies
npm install
```

2. Configure the Test Plan

Copy the testplan.json template from the templates directory to the root directory of the project:

```
cp templates/testplan.json .
```

Modify the testplan.json file to match your testing requirements. Below are the valid values for each field:
```
"templates": ["go", "python", "nodejs", "dotnet-basic", "java-quarkus", "java-springboot"],
"git": ["github", "gitlab", "bitbucket"],
"ci": ["tekton", "jenkins", "gitlabci", "githubactions"],
"registry": ["quay", "quay.io", "artifactory", "nexus"],
"acs": ["local", "remote"],
"tpa": ["local", "remote"]
```

3. Export Environment Variables

Copy the template file from `templates/.env` to the root directory of the project:

```bash
cp templates/.env .env
```

Edit the `.env` file to set required environment variables for running automation tests. Ater that, you can source the file before running tests:

```bash
source .env
```

4. (Optional) Skip TLS verification globally

For testing environments with self-signed certificates or invalid SSL certificates, you can disable TLS verification globally. This is useful in testing environments but should not be used in production:

```bash
# Option 1: Set environment variable before running tests
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Option 2: Add to your .env file
echo "NODE_TLS_REJECT_UNAUTHORIZED=0" >> .env
```

Running Tests

Run All Tests

```
npm run test:tssc
```

Run a Specific Test File

```
npm test -- tests/tssc/full_workflow.test.ts
```

View Test Report

```
npm run test:report
```



## Development Guide
High Level Digram
![image info](./docs/images/Hight_level_Arch.jpg)

Debug Test

Project Structure

Development Commands

```
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run check-types

# Run all validation steps
npm run validate
```