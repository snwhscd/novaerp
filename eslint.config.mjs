import next from 'eslint-config-next'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  next,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
])
