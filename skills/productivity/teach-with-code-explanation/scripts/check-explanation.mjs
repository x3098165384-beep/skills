#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const help = '用法：node check-explanation.mjs --root 代码项目 --extension-root 插件工程 [--workspace-stdin] 讲解.md [...]\n只读明确指定的 Markdown。默认当前源码来自磁盘；--workspace-stdin 从标准输入读取 {项目相对路径: 完整当前文本}，不连接编辑器、不写文件。';
const missing = error => error.code === 'ENOENT' || error.code === 'ENOTDIR';
const key = value => process.platform === 'win32' ? value.toLowerCase() : value;
const within = (root, full) => { const relative = path.relative(root, full); return relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative); };
const utf8 = bytes => new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);

function argumentsFor(args) {
  const result = { files: [], workspaceStdin: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg === '--root' || arg === '--extension-root') {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${arg} 后需要目录。`);
      const name = arg === '--root' ? 'root' : 'extensionRoot';
      if (result[name]) throw new Error(`${arg} 不能重复。`);
      result[name] = path.resolve(args[++i]);
    } else if (arg === '--workspace-stdin') result.workspaceStdin = true;
    else if (arg.startsWith('-')) throw new Error(`不支持的参数：${arg}`);
    else result.files.push(arg);
  }
  if (!result.root || !result.extensionRoot || !result.files.length) throw new Error(help);
  return result;
}

function verifiedPath(root, physicalRoot, relative) {
  const full = path.resolve(root, relative);
  if (!within(root, full) || key(full) === key(root)) throw new Error(`代码路径 ${relative} 超出了所选项目。`);
  let ancestor = full;
  while (true) {
    try {
      if (!within(physicalRoot, fs.realpathSync(ancestor))) throw new Error(`代码路径 ${relative} 通过符号链接指向项目外，不能读取。`);
      return full;
    } catch (error) {
      if (!missing(error)) throw error;
      try { if (fs.lstatSync(ancestor).isSymbolicLink()) throw new Error(`代码路径 ${relative} 的符号链接目标无法读取。`); }
      catch (entryError) { if (!missing(entryError)) throw entryError; }
      const parent = path.dirname(ancestor);
      if (parent === ancestor || !within(root, parent)) throw new Error(`无法确认代码路径 ${relative} 位于项目内。`);
      ancestor = parent;
    }
  }
}

const gitEnv = { ...process.env, GIT_OPTIONAL_LOCKS: '0' };
for (const name of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_PREFIX']) delete gitEnv[name];
function git(directory, ...args) {
  try {
    return utf8(execFileSync('git', ['--no-optional-locks', '-c', 'core.fsmonitor=false', '-C', directory, ...args],
      { env: gitEnv, windowsHide: true, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }));
  } catch (error) { throw new Error(`Git 读取失败：${error.stderr?.toString('utf8').trim() || error.message}`); }
}
function repositoryFile(full) {
  let directory = path.dirname(full);
  while (true) {
    try { if (fs.statSync(directory).isDirectory()) break; }
    catch (error) { if (!missing(error)) throw error; }
    const parent = path.dirname(directory);
    if (parent === directory) throw new Error(`找不到 ${full} 所属的 Git 仓库。`);
    directory = parent;
  }
  const physicalDirectory = fs.realpathSync(directory);
  const repository = fs.realpathSync(git(directory, 'rev-parse', '--show-toplevel').trim());
  const physicalFile = path.resolve(physicalDirectory, path.relative(directory, full));
  if (!within(repository, physicalFile)) throw new Error(`代码 ${full} 不在 Git 返回的仓库内。`);
  return { repository, relative: path.relative(repository, physicalFile).split(path.sep).join('/') };
}

function inspect(filename, root, workspace, api) {
  const explanation = api.parseExplanation(utf8(fs.readFileSync(filename)));
  const physicalRoot = fs.realpathSync(root), sources = new Map(), positions = new Map();
  const read = id => {
    if (sources.has(id)) return sources.get(id);
    const source = explanation.sources[id], full = verifiedPath(root, physicalRoot, source.path);
    let text, repository;
    if (source.kind === 'workspace') {
      if (Object.hasOwn(workspace, source.path)) {
        if (!source.exists) throw new Error(`当前文本包含 ${source.path}，不能显示为空白侧。`);
        text = workspace[source.path];
      } else {
        let exists;
        try { const stat = fs.statSync(full); if (!stat.isFile()) throw new Error(`代码路径 ${source.path} 不是文件。`); exists = true; }
        catch (error) { if (!missing(error)) throw error; exists = false; }
        if (exists !== source.exists) throw new Error(`磁盘文件 ${source.path} 的实际存在状态与讲解不符。`);
        text = exists ? utf8(fs.readFileSync(full)) : '';
      }
    } else {
      const location = repositoryFile(full); repository = location.repository;
      if (git(repository, 'cat-file', '-t', source.commit).trim() !== 'commit') throw new Error(`Git 对象 ${source.commit} 不是提交。`);
      const entry = git(repository, 'ls-tree', '-z', '--full-tree', source.commit, '--', `:(literal)${location.relative}`)
        .split('\0').find(value => value.slice(value.indexOf('\t') + 1) === location.relative);
      if (!!entry !== source.exists) throw new Error(`Git 提交 ${source.commit} 中 ${source.path} 的实际存在状态与讲解不符。`);
      if (entry && !/^\d+ blob [0-9a-f]+\t/.test(entry)) throw new Error(`Git 中 ${source.path} 不是文件内容。`);
      text = entry ? git(repository, 'cat-file', 'blob', `${source.commit}:${location.relative}`) : '';
      if (source.exists && api.sha256(api.normalizeText(text)) !== source.sha256) throw new Error(`Git 文件 ${source.path} 的整文件摘要与讲解不符。`);
    }
    const value = { source, text, repository }; sources.set(id, value); return value;
  };
  const warnings = [], errors = [];
  for (const [index, step] of explanation.steps.entries()) {
    try {
      const targets = [];
      if (step.kind === 'file') targets.push([step.source, step.target]);
      else {
        const left = read(step.left), right = read(step.right);
        const leftRepository = left.repository ?? repositoryFile(verifiedPath(root, physicalRoot, left.source.path)).repository;
        const rightRepository = right.repository ?? repositoryFile(verifiedPath(root, physicalRoot, right.source.path)).repository;
        if (key(leftRepository) !== key(rightRepository)) throw new Error('diff 两侧不属于同一个 Git 仓库。');
        if (step.comparison === 'working-tree' && git(leftRepository, 'rev-parse', '--verify', 'HEAD').trim().toLowerCase() !== left.source.commit.toLowerCase()) {
          throw new Error('未提交比较的 HEAD 基准已变化，请重新核对并更新讲解。');
        }
        if (step.targets.left) targets.push([step.left, step.targets.left]);
        if (step.targets.right) targets.push([step.right, step.targets.right]);
      }
      for (const [id, target] of targets) {
        const { source, text } = read(id), match = api.checkTarget(source, text, target);
        if (match.notice) warnings.push(`第 ${index + 1} 步：${match.notice}`);
        const position = JSON.stringify([source.kind, source.commit, source.path, match.startLine, match.endLine]);
        const previous = positions.get(position);
        if (previous !== undefined && previous !== index) warnings.push(`第 ${index + 1} 步和第 ${previous + 1} 步对应同一版本的同一范围，请复读是否需要合并。`);
        positions.set(position, index);
      }
    } catch (error) { errors.push(`第 ${index + 1} 步“${step.title}”：${error.message}`); }
  }
  return { count: explanation.steps.length, warnings, errors };
}

function main() {
  const args = argumentsFor(process.argv.slice(2));
  if (args.help) { console.log(help); return; }
  if (!fs.statSync(args.root).isDirectory()) throw new Error('--root 必须是代码项目目录。');
  let api;
  try { api = createRequire(import.meta.url)(path.join(args.extensionRoot, 'dist/explanation.js')); }
  catch (error) { throw new Error(`无法加载插件的解析和定位实现，请确认 --extension-root 和插件构建结果：${error.message}`); }
  const workspace = args.workspaceStdin ? JSON.parse(utf8(fs.readFileSync(0)).replace(/^\uFEFF/, '')) : {};
  if (!workspace || typeof workspace !== 'object' || Array.isArray(workspace) || Object.values(workspace).some(value => typeof value !== 'string')) {
    throw new Error('标准输入必须是项目相对路径到完整当前文本的 JSON 对象，值必须是字符串。');
  }
  let failed = false;
  for (const input of args.files) {
    const filename = path.resolve(args.root, input);
    try {
      if (path.extname(filename).toLowerCase() !== '.md') throw new Error('只检查独立 Markdown 讲解文件。');
      const result = inspect(filename, args.root, workspace, api);
      for (const warning of result.warnings) console.log(`提醒：${filename}：${warning}`);
      if (result.errors.length) throw new Error(result.errors.join('\n'));
      console.log(`通过：${filename}（${result.count} 步，结构、版本与目标检查通过）`);
    } catch (error) { failed = true; console.error(`错误：${filename}：${error.message}`); }
  }
  console.log(args.workspaceStdin ? '当前源码按标准输入提供的文本或磁盘检查；未连接 VS Code，不能确认输入来源或界面效果。' : '当前源码仅按磁盘检查，未读取编辑器未保存内容；Git 引用按实际提交检查，未验证界面效果。');
  if (failed) process.exitCode = 1;
}

try { main(); } catch (error) { console.error(`错误：${error.message}`); process.exitCode = 1; }
