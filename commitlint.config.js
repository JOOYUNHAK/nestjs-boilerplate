module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // ---- 타입(type) 설정 -----------
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'ci', 'chore'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    // --- 스코프 설정 ---------------
    'scope-enum': [2, 'always', ['commitlint']],
    'scope-case': [2, 'always', 'lower-case'],
  },
};
