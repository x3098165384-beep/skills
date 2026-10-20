#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const help = "用法：node check-tour.mjs --root 项目根目录 [讲解文件 ...]\n未指定文件时，只检查项目 .tours 目录下的 .tour 文件。此工具只读文件。";

function parseArgs(args) {
  let root = process.cwd();
  const files = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") return { help: true };
    if (arg === "--root") {
      if (!args[i + 1] || args[i + 1].startsWith("--")) {
        throw new Error("--root 后需要项目根目录。");
      }
      root = path.resolve(args[++i]);
    } else if (arg.startsWith("-")) {
      throw new Error("不支持的参数：" + arg);
    } else {
      files.push(arg);
    }
  }
  return { root, files };
}

async function inspectTour(tourPath, root) {
  const errors = [];
  const warnings = [];
  const addError = (step, text) => errors.push("第" + step + "步：" + text);
  let tour;
  try {
    const raw = await readFile(tourPath, "utf8");
    tour = JSON.parse(raw.replace(/^\uFEFF/, ""));
  } catch (error) {
    return { errors: ["无法读取讲解 JSON：" + error.message], warnings, count: 0 };
  }
  if (!tour || typeof tour !== "object" || Array.isArray(tour)) {
    return { errors: ["讲解必须是 JSON 对象。"], warnings, count: 0 };
  }
  if (typeof tour.title !== "string" || !tour.title.trim()) errors.push("缺少讲解标题。");
  if (!Array.isArray(tour.steps) || tour.steps.length === 0) {
    return { errors: [...errors, "steps 必须包含至少一步。"], warnings, count: 0 };
  }

  const sources = new Map();
  const positions = new Map();
  for (const [index, step] of tour.steps.entries()) {
    const n = index + 1;
    if (!step || typeof step !== "object" || Array.isArray(step)) {
      addError(n, "步骤必须是对象。");
      continue;
    }
    if (typeof step.description !== "string" || !step.description.trim()) {
      addError(n, "缺少讲解正文。");
    } else {
      if (/(?:^|\n)[ \t]*(?:`{3,}|~{3,})/.test(step.description)) {
        warnings.push("第" + n + "步：围栏代码块可能提供插入代码操作，请确认这符合用户意图；只读讲解默认使用行内代码。");
      }
      if (/\]\(\s*command:/i.test(step.description)) {
        addError(n, "只读讲解包含可执行命令链接。");
      }
    }
    if (step.commands !== undefined) addError(n, "只读讲解不使用 commands。");
    if (typeof step.file !== "string" || !step.file.trim()) {
      addError(n, "此工具检查本地代码讲解，每一步需要 file。");
      continue;
    }
    if (path.isAbsolute(step.file) || path.win32.isAbsolute(step.file)) {
      addError(n, "file 应使用项目根目录相对路径。");
      continue;
    }
    const sourcePath = path.resolve(root, step.file);
    const relative = path.relative(root, sourcePath);
    if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) {
      addError(n, "file 位于指定项目根目录之外。");
      continue;
    }
    let source = sources.get(sourcePath);
    if (source === undefined) {
      try {
        source = (await readFile(sourcePath, "utf8")).replace(/^\uFEFF/, "");
        sources.set(sourcePath, source);
      } catch (error) {
        addError(n, "无法读取代码文件 " + step.file + "：" + error.message);
        continue;
      }
    }
    const lines = source.split(/\r?\n/);
    const validLine = line => Number.isInteger(line) && line >= 1 && line <= lines.length;
    let selectedLine;
    if (step.selection !== undefined) {
      const { start, end } = step.selection || {};
      const validPosition = pos => pos && validLine(pos.line) &&
        Number.isInteger(pos.character) && pos.character >= 1 &&
        pos.character <= lines[pos.line - 1].length + 1;
      if (!validPosition(start) || !validPosition(end) ||
          end.line < start.line || (end.line === start.line && end.character < start.character)) {
        addError(n, "selection 的行列范围无效。");
      } else {
        selectedLine = end.line;
      }
    }
    let targetLine;
    if (step.line !== undefined) {
      if (!validLine(step.line)) addError(n, "line 不是代码文件中有效的行号。");
      else targetLine = step.line;
      if (step.selection !== undefined) warnings.push("第" + n + "步：line 决定评论位置，selection 只选择文本。");
    } else if (step.selection !== undefined) {
      targetLine = selectedLine;
    } else if (typeof step.pattern === "string" && step.pattern) {
      try {
        const matches = [...source.matchAll(new RegExp(step.pattern, "gm"))];
        if (matches.length !== 1) {
          addError(n, "pattern 应唯一匹配，实际匹配" + matches.length + "处。");
        } else {
          targetLine = source.slice(0, matches[0].index).split("\n").length;
        }
      } catch (error) {
        addError(n, "pattern 不是有效的 JavaScript 正则：" + error.message);
      }
    } else {
      addError(n, "缺少有效的 pattern、line 或 selection。");
    }
    if (step.pattern !== undefined && (step.line !== undefined || step.selection !== undefined)) {
      warnings.push("第" + n + "步：显式位置优先，pattern 不用于确定当前评论位置。");
    }
    if (targetLine !== undefined) {
      const key = sourcePath + "\0" + targetLine;
      if (positions.has(key)) {
        warnings.push("第" + n + "步与第" + positions.get(key) +
          "步定位到同一行（" + step.file + ":" + targetLine + "），请确认是否应合并。");
      } else {
        positions.set(key, n);
      }
    }
  }
  return { errors, warnings, count: tour.steps.length };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(help);
    return 0;
  }
  const { root } = args;
  let files = args.files.map(file => path.resolve(root, file));
  if (files.length === 0) {
    const directory = path.join(root, ".tours");
    const entries = await readdir(directory, { withFileTypes: true });
    files = entries.filter(entry => entry.isFile() && entry.name.endsWith(".tour"))
      .map(entry => path.join(directory, entry.name)).sort();
  }
  if (files.length === 0) throw new Error("没有找到要检查的 .tour 文件。");
  let failed = false;
  for (const file of files) {
    const result = await inspectTour(file, root);
    for (const warning of result.warnings) console.log("提醒：" + file + "：" + warning);
    for (const error of result.errors) console.error("错误：" + file + "：" + error);
    if (result.errors.length) failed = true;
    else console.log("通过：" + file + "（" + result.count + "步）");
  }
  return failed ? 1 : 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error("错误：" + error.message);
  process.exitCode = 1;
}
