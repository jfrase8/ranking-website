//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      // Your custom rules here
      '@typescript-eslint/array-type': 'array',
    },
  },
]
