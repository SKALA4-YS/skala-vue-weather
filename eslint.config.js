import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  // 빌드 산출물은 검사 대상이 아니다
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      // window, document, localStorage, navigator 같은 브라우저 객체를 전역으로 인정한다
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    name: 'app/custom-rules',
    rules: {
      'no-unused-vars': 'warn', // 선언 후 안 쓴 변수는 경고까지만
      'no-console': 'off', // 실습 로그를 남겨 두려고 허용
      'eqeqeq': ['error', 'always'], // == 대신 === 강제
      'vue/multi-word-component-names': 'off', // App.vue 같은 단일 단어 이름 허용
    },
  },

  // 줄바꿈·따옴표·들여쓰기 같은 시각적 규칙은 Prettier에 맡긴다
  skipFormatting,
])
