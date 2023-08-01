module.exports = {
  env: { node: true, 'vue/setup-compiler-macros': true },
  globals: { uni: true, wx: true, my: true, swan: true, AnyObject: true, AnyArray: true },
  parser: 'vue-eslint-parser',
  parserOptions: { parser: '@typescript-eslint/parser', sourceType: 'module' },
  extends: [
    // 扩展使用 vue3 检查规则和eslint推荐规则
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    // typescript-eslint推荐规则,
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 关闭名称校验
    'vue/multi-word-component-names': 0,
    // 禁止使用 var
    'no-var': 'error',
    // 禁止any类型,报错关闭
    '@typescript-eslint/no-explicit-any': 'off',
    // 需要导出函数和类的公共类方法的显式返回和参数类型,报错关闭
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 禁止某些类型如String、Number,报错关闭
    '@typescript-eslint/ban-types': 'off',
    // 禁止在单行内非缩进情况出现多个空格
    'no-multi-spaces': 'error',
    // 禁止行尾空格
    'no-trailing-spaces': 'error',
    // 禁止未使用的变量,报错关闭
    "no-irregular-whitespace": 0,
    "@typescript-eslint/no-this-alias": 'off',
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    // vue首行缩进两字符
    'vue/html-indent': [
      'error',
      2,
      {
        // 属性缩进的乘数。默认为1。
        attribute: 1,
        // 顶级语句的缩进倍数。默认为1。
        baseIndent: 1,
        // 右括号缩进的乘数。默认为0。
        closeBracket: 0,
        // 属性是否应垂直对齐到多行情况下的第一个属性的条件。默认为true
        alignAttributesVertically: false,
        // 忽略节点的选择器。默认是[]
        ignores: ['text']
      }
    ],
    // 修改标签属性的 eslint 规则 允许标签属性换行
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'beside',
        multiline: 'below'
      }
    ],
    // 箭头函数的箭头前后都有空格
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    // 控制逗号前后的空格
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    // 修改 右标签 > 的 eslint 规则  无需单独一行
    'vue/html-closing-bracket-newline': 0,
    "vue/singleline-html-element-content-newline": ["error", {
      "ignoreWhenNoAttributes": true,
      "ignoreWhenEmpty": true,
      "ignores": ['text']
    }],
    "vue/multiline-html-element-content-newline": ["error", {
      "ignoreWhenEmpty": true,
      "ignores": ["text"],
      "allowEmptyLines": false
    }],
    // 强制每行的最大属性数
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 5 },
      multiline: { max: 2 }
    }],
    // 强制使用驼峰命名
    // 'vue/component-name-in-template-casing': [
    //   'error',
    //   'PascalCase',
    //   {
    //     // 如果true，则仅检查已注册的组件（在 PascalCase 中）。如果false，检查所有。默认true
    //     registeredComponentsOnly: false,
    //     ignores: [],
    //   },
    // ],
  }
};
