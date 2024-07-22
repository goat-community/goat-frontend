module.exports = {
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:playwright/playwright-test",
    "next",
    "prettier",
    "turbo",
    "plugin:you-dont-need-lodash-underscore/compatible-warn",
  ],
  plugins: ["unused-imports"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
  },
  rules: {
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    "jsx-a11y/role-supports-aria-props": "off", // @see https://github.com/vercel/next.js/issues/27989#issuecomment-897638654
    "playwright/no-page-pause": "error",
    "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
    "react/self-closing-comp": ["error", { component: true, html: true }],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "unused-imports/no-unused-imports": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
            fixStyle: "separate-type-imports",
            disallowTypeAnnotations: false,
          },
        ],
      },
      overrides: [
        {
          files: ["**/playwright/**/*.{tsx,ts}"],
          rules: {
            "@typescript-eslint/no-unused-vars": "off",
            "no-undef": "off",
          },
        },
      ],
    },
    {
      files: ["**/playwright/**/*.{js,jsx}"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-undef": "off",
      },
    },
  ],
};
