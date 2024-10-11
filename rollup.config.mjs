import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      dir: 'dist/cjs',
      entryFileNames: '[name].[hash].js', // 指定输出文件命名规则
      chunkFileNames: '[name]-[hash].js', // 指定 chunk 文件命名规则
    },
    {
      format: 'es',
      dir: 'dist/esm',
      entryFileNames: '[name].[hash].js', // 指定输出文件命名规则
      chunkFileNames: '[name]-[hash].js', // 指定 chunk 文件命名规则
    },
  ],
  plugins: [
    del({
      targets: ['dist/*', 'build/*'],
    }),
    resolve(), // 使 rollup 可以找到 node_modules 目录下的模块
    commonjs(), // 转换 CommonJS 模块为 ES 模块
    typescript({
      // 使用 TypeScript 插件
      useTsconfig: true, // 使用 tsconfig.json 文件
      tsconfig: './tsconfig.json',
    }),
    json(), // 处理 JSON 文件
    postcss({
      plugins: [],
      minimize: true, // 生产环境下压缩 CSS
      extract: '[name].[hash].css', // 抽取 CSS 到单独的文件
      extensions: ['.css'], // 支持的文件扩展名
    }), // 处理 CSS 文件
  ],
};
