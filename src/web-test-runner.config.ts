import type {TestFramework, TestRunnerConfig} from '@web/test-runner';
import {puppeteerLauncher} from '@web/test-runner-puppeteer';

// https://modern-web.dev/docs/test-runner/cli-and-configuration/
export default {
  // rootDir: '../../',
  // files: ['./test/**/*_test.js'],
  port: 8001,
  nodeResolve: {
    exportConditions: ['development', 'browser'],
  },
  browsers: [puppeteerLauncher()],
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: 'tdd',
    },
  } as TestFramework,
} satisfies TestRunnerConfig;
