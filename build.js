require('dotenv').config()
const esbuild = require('esbuild')

const {
    EXPRESS_PORT,
    MONGO_DB_URL,
    MAIL_SERVICE, MAIL_USER, MAIL_PASS,
    TENANT_ID, CLIENT_ID, CLIENT_SECRET,
    ADMINISTRATORS_TEAM, TEACHERS_TEAM,
    REFRESH_SECRET, ACCESS_SECRET, LONG_PERIOD
} = process.env

const define = {
    'process.env.EXPRESS_PORT': EXPRESS_PORT,
    'process.env.MONGO_DB_URL': JSON.stringify(MONGO_DB_URL),
    'process.env.MAIL_SERVICE': JSON.stringify(MAIL_SERVICE),
    'process.env.MAIL_USER': JSON.stringify(MAIL_USER),
    'process.env.MAIL_PASS': JSON.stringify(MAIL_PASS),
    'process.env.TENANT_ID': JSON.stringify(TENANT_ID),
    'process.env.CLIENT_ID': JSON.stringify(CLIENT_ID),
    'process.env.CLIENT_SECRET': JSON.stringify(CLIENT_SECRET),
    'process.env.ADMINISTRATORS_TEAM': JSON.stringify(ADMINISTRATORS_TEAM),
    'process.env.TEACHERS_TEAM': JSON.stringify(TEACHERS_TEAM),
    'process.env.REFRESH_SECRET': JSON.stringify(REFRESH_SECRET),
    'process.env.ACCESS_SECRET': JSON.stringify(ACCESS_SECRET),
    'process.env.LONG_PERIOD': JSON.stringify(LONG_PERIOD),
}


esbuild.build({
    entryPoints: ['index.ts'],
    bundle: true,
    minify: true,
    platform: 'node',
    outfile: 'dist/eszut-api.js',
    define,
}).catch(() => process.exit(1))
