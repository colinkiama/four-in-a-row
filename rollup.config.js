import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/four-in-a-row.js',
            generatedCode: 'es2015'
        },
        {
            file: 'dist/four-in-a-row.min.js',
            generatedCode: 'es2015',
            plugins: [terser()]
        }
    ]
};

