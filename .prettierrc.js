module.exports = {
  printWidth: 120,
  tabWidth: 2,
  tabs: false,
  quoteProps: 'as-needed',
  tailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  // 行位不需要分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  //末尾逗号
  trailingComma: 'none',
  // 让函数(名)和后面的括号之间加个空格
  'javascript.format.insertSpaceBeforeFunctionParenthesis': true,
  // 让vue中的js按编辑器自带的ts格式进行格式化
  'vetur.format.defaultFormatter.js': 'vscode-typescript',
  // 让prettier使用eslint的代码格式进行校验
  eslintIntegration: true,
  // 指定 HTML 文件的全局空白区域敏感度, "ignore" - 空格被认为是不敏感的
  htmlWhitespaceSensitivity: 'ignore',
  endOfLine: 'auto',
};
