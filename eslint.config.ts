import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },


  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  ...pluginOxlint.configs['flat/recommended'],

  // --- Custom Rule Overrides ---
  // Add your custom rules object here, AFTER the base configs
  {
    name: 'app/custom-rule-overrides',
    rules: {
      // Disable specific TypeScript rules
      '@typescript-eslint/no-unused-vars': 'off', // Or 'warn' if you prefer a warning
      '@typescript-eslint/ban-ts-comment': 'off',

      // Disable specific Vue rule
      'vue/multi-word-component-names': 'off',

      // You can add any other rule overrides here
      // 'example-rule': 'warn',
    }
  }
)
