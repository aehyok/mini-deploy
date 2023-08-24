const ci = require('miniprogram-ci');
const { spawn } = require('child_process');
const minimist = require('minimist');
const fs = require('fs-extra')
const hjson = require('hjson');

const wechat = {
  "dev": "wx858ddde80e1d69ec",
  "sit": "wx98011a7ed2295c2c",
  "xe": "wx636b10db5fe7f274",
}
console.log("args", "---------------------",process.argv);
const args = minimist(process.argv.slice(2));
console.log(args, "arguments")
const env = args.e;

// package.json 配置获取
const packageObject = require('./package.json');
const version =packageObject.version;
const lastVersion = packageObject.lastVersion;

const compilePath = `e:\\work\\git-refactor\\mini-program`
const command = 'pnpm.cmd';
const sArgs = [env];

// 修改manifest.json中的appid
const wechatPath = `${compilePath}\\apps\\digital-village\\src\\manifest.json`
const packageString = fs.readFileSync(`${wechatPath}`,"utf-8").toString();
let packageJson = hjson.parse(packageString)
packageJson["mp-weixin"]["appid"]= wechat[`${env}`],
fs.writeFileSync(`${wechatPath}`, JSON.stringify(packageJson, null, 2))

// 执行编译
const child = spawn(command, sArgs, { cwd: compilePath });
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  compile();
});

function getLength(s) {
  const match = s.match(/^(\d+)$/);
  return match ? match[0].length : null;
}

const getFullVersion = () => {
  const length = getLength(lastVersion)

  let strVersion = ""
  if(length === 2) {
    strVersion = `0${lastVersion}`
  }
  else if(length ===1) {
    strVersion = `00${lastVersion}`
  }
  return `${version}.${strVersion}`
}

const compile = () => {
  const project = new ci.Project({
    appid: wechat[`${env}`],
    type: "miniProgram",
    projectPath: `${compilePath}\\apps\\digital-village\\dist\\build\\mp-weixin`,
    privateKeyPath: `private.${env}.key`,
    ignores: ['node_modules/**/*'],
  });
  ci.upload(
  {
    project,
    version: getFullVersion(),
    desc: `自动化提交发布版本${getFullVersion()}`,
    setting: {
      es6: true,     // 对应小程序开发者工具的 "es6 转 es5"
      es7: true,     // 对应小程序开发者工具的 "增强编译"
      minify: true,  // 压缩所有代码，对应小程序开发者工具的 "压缩代码"
      ignoreUploadUnusedFiles: true,
    },
    onProgressUpdate: (info) => { console.log(info, "upload") },
  }).then(result => {
    console.log(result, "uploadResult");
  })
}




