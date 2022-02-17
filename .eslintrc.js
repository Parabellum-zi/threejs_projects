module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["vue"],
  parser: "vue-eslint-parser",
  rules: {
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "space-before-function-paren": "off",
    // "comma-dangle": [2, "never"], // 要求或禁止末尾逗号
    // "comma-style": [2, "last"], // 强制使用一致的逗号风格
    "no-cond-assign": 2, //条件语句的条件中不允许出现赋值运算符
    "no-const-assign": 2, //禁止修改const声明的变量
    "no-dupe-keys": 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-dupe-args": 2, //函数参数不能重复
    "no-duplicate-case": 2, //switch中的case标签不能重复
    "no-func-assign": 2, //禁止重复的函数声明
    // semi: [2, "never"], // 要求或禁止使用分号
    // 'no-extra-parens': 2, //禁止非必要的括号
    // "no-extra-semi": 2, //禁止多余的冒号
    "no-irregular-whitespace": 2, //不能有不规则的空格
    "no-multiple-empty-lines": [2, { max: 1 }], // 禁止出现多行空行
    /* ES6
     ---------------------------------------------------------------- */
    // "arrow-parens": [2, "as-needed"], // 要求箭头函数的参数使用圆括号
    "arrow-spacing": [2, { before: true, after: true }], // 强制箭头函数的箭头前后使用一致的空格

    /* Vue - https://github.com/vuejs/eslint-plugin-vue
    ---------------------------------------------------------------- */
    "vue/attributes-order": "off",
    "vue/one-component-per-file": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/max-attributes-per-line": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/attribute-hyphenation": "off",
    "vue/require-default-prop": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "never",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
  },
};
