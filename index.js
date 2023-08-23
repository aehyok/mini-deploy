const ci = require('miniprogram-ci');

const packageObject = require('../package.json');
const version =packageObject.version;
const lastVersion = packageObject.lastVersion;
function getLength(s) {
  const match = s.match(/^(\d+)$/);
  return match ? match[0].length : null;
}


export const getFullVersion = () => {
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


const project = new ci.Project({
    appid: "wx636b10db5fe7f274",
    type: "miniProgram",
    projectPath: `e:\\work\\git-refactor\\mini-program\\apps\\digital-village\\dist\\build\\mp-weixin`,
    privateKeyPath: "private.wx636b10db5fe7f274.key",
    ignores: ['node_modules/**/*'],
});

ci.upload(
  {
    project,
    version: getFullVersion(),
    desc: "糖家三勺 在 2023年8月21日晚上7点52分 提交上传",
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

