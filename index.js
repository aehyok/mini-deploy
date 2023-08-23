const ci = require('miniprogram-ci');
const { spawn } = require('child_process');


// package.json 配置获取
const packageObject = require('./package.json');
const version =packageObject.version;
const lastVersion = packageObject.lastVersion;

const compilePath = `e:\\work\\git-refactor\\mini-program`
const command = 'pnpm.cmd';
const args = ['xe'];

const child = spawn(command, args, { cwd: compilePath });
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  // compile();
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
    appid: "wx636b10db5fe7f274",
    type: "miniProgram",
    projectPath: `${compilePath}\\apps\\digital-village\\dist\\build\\mp-weixin`,
    privateKeyPath: "private.wx636b10db5fe7f274.key",
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




