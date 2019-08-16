/*
 * babelrc (babel core version: >7.0)
 *
 * presets: 本质上是为满足某目的的常用的预设插件(plugins)集, @babel/polyfill用于兼容IE, 一般不需
 * plugins: 按需补充插件，包括第三方为特殊目的的插件
 * @see: https://babeljs.io/docs/en/
 *
 * @notice: 此文件修改后需重新编译运行
 */

/* ------------------------------------------------------.
| presets 预设 @see: https://babeljs.io/docs/en/presets  |
`------------------------------------------------------*/
const presets = [
  /*
   * @babel/env 对es2015, es2016. es2017的支持
   * @see: https://babeljs.io/docs/en/babel-preset-env
   */
  [
    '@babel/preset-env',
    {
      // polyfill选项，必须配合设定corejs版本
      // yarn add core-js@3
      // 注：babel7下plugin-transform-runtime下的polyfill选项已移除
      // @see: https://babeljs.io/docs/en/babel-preset-env#usebuiltins
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true },

      // // 浏览器兼容选项，请勿设，走根目录下.browserslistrc设置
      // targets: {
      //   // 仅支持支持es模块的浏览器，千万不要用true，否则会导致很多node_modules包在低端浏览器出错
      //   esmodules: false
      // }

      // exclude: ['@babel/plugin-transform-regenerator'], //排除那些插件

      modules: 'commonjs', // 不可为false，否则import不会转，node环境会出错
    },
  ],

  /*
   * @babel/preset-react 对react/jsx支持
   * @see: https://babeljs.io/docs/en/babel-preset-react
   */
  [
    '@babel/preset-react',
    {
      development: process.env.BABEL_ENV === 'development',
    },
  ],
]

/* ------------------------------------------------------.
| plugins 插件 @see: https://babeljs.io/docs/en/plugins  |
`------------------------------------------------------*/
const plugins = [
  /*
   * 对pug模板的支持
   * @see: https://github.com/pugjs/babel-plugin-transform-react-pug
   */
  'transform-react-pug',

  /*
   * 对浏览器低版本的支持
   * @see: https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav
   */
  [
    '@babel/plugin-transform-runtime',
    {
      absoluteRuntime: false, // 没事别改true

      // polyfill相关
      // yarn add @babel/runtime
      // 与preset-env中的corejs有何关系？
      corejs: { version: 3, proposals: true },

      helpers: true,
      regenerator: true,
      useESModules: false, // 没事别改true
    },
  ],

  /*
   * import时默认相对于根目录
   * @see: https://github.com/tleunen/babel-plugin-module-resolver
   */
  [
    'module-resolver', // or: require.resolve('babel-plugin-module-resolver'),
    {
      root: ['.'],
      alias: {
        // add your alias
        // react: 'preact',
      },
    },
  ],

  /*
   * antd等UI组件按需引入
   * @see:https://ant.design/docs/react/getting-started-cn#按需加载
   */
  [
    'import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
      // style: true, //引入less文件, 貌似这样按需引入就失败，待查
    },
    'antd', // 这名字好像无所谓
  ],

  [
    'import',
    {
      libraryName: 'react-use',
      libraryDirectory: 'lib',
      camel2DashComponentName: false,
    },
    'react-use',
  ],

  // /*
  //  * styled-components支持
  //  * @see: https://github.com/styled-components/styled-components
  //  */
  // ['styled-components', { ssr: true }],

  
  //  * styled-jsx支持，及styled-jsx-stylus
  //  * @see: https://github.com/zeit/styled-jsx
  //  * @see: https://github.com/omardelarosa/styled-jsx-plugin-stylus
   
  // ['styled-jsx/babel', { plugins: ['styled-jsx-plugin-stylus'] }],

  /*
   * 用于import()惰性加载组件
   * @see: https://babeljs.io/docs/plugins/syntax-dynamic-import/
   */
  '@babel/plugin-syntax-dynamic-import',

  /*
   * 支持classProperties和对象解析语法(很多第三方的基于class的库会用到)
   * 可能跟预设/polyfill有重复，不管，多加点总不会错
   */
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  // '@babel/plugin-transform-object-assign',

  // 尝试解决打包时使用严格模式问题，貌似无效
  'transform-remove-strict-mode',

  /*
   * 按需加载lodash/ramda
   * @see: https://www.npmjs.com/package/babel-plugin-lodash
   * @see: https://github.com/megawac/babel-plugin-ramda
   *
   */
  'lodash',
  'ramda',
  // '@babel/plugin-transform-typescript',
]

module.exports = { presets, plugins }
