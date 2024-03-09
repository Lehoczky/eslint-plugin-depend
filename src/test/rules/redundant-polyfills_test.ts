import {rule} from '../../rules/redundant-polyfills.js';
import {RuleTester} from 'eslint';

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022
  }
});

const tseslintParser = require.resolve('@typescript-eslint/parser');

ruleTester.run('redundant-polyfills', rule, {
  valid: [
    'const foo = 303;',
    {
      code: `import foo = require('unknown-module');`,
      parser: tseslintParser
    },
    {
      code: `import foo from 'unknown-module';`,
      parser: tseslintParser
    },
    {
      code: `const foo = require('unknown-module');`,
      parser: tseslintParser
    },
    {
      code: `
        const moduleName = 'object' + '.entries';
        require(moduleName);
      `,
      parser: tseslintParser
    },
    {
      code: `
        const moduleName = 'object' + '.entries';
        await import(moduleName);
      `,
      parser: tseslintParser
    }
  ],

  invalid: [
    {
      code: `const entries = require('object.entries');`,
      errors: [
        {
          line: 1,
          column: 17,
          messageId: 'redundantWithMdnPath',
          data: {
            name: 'object.entries',
            replacement: 'Object.entries',
            mdnPath: 'Global_Objects/Object/entries'
          }
        }
      ]
    },
    {
      code: `import entries from 'object.entries';`,
      errors: [
        {
          line: 1,
          column: 1,
          messageId: 'redundantWithMdnPath',
          data: {
            name: 'object.entries',
            replacement: 'Object.entries',
            mdnPath: 'Global_Objects/Object/entries'
          }
        }
      ]
    },
    {
      code: `const entries = await import('object.entries');`,
      errors: [
        {
          line: 1,
          column: 23,
          messageId: 'redundantWithMdnPath',
          data: {
            name: 'object.entries',
            replacement: 'Object.entries',
            mdnPath: 'Global_Objects/Object/entries'
          }
        }
      ]
    },
    {
      code: `import entries = require('object.entries');`,
      parser: tseslintParser,
      errors: [
        {
          line: 1,
          column: 1,
          messageId: 'redundantWithMdnPath',
          data: {
            name: 'object.entries',
            replacement: 'Object.entries',
            mdnPath: 'Global_Objects/Object/entries'
          }
        }
      ]
    }
  ]
});