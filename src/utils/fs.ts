import { glob } from "glob";
import type BaseModule from "../base/BaseModule";

export async function loadFiles<T>(mod: string, dir: string): Promise<T[]> {
	const files = glob.sync(`./src/mods/${mod}/${dir}/**/*.ts`);
	const _files: T[] = [];
	for (let file of files) {
		let {default: f} = await import(file.replaceAll("\\", "/").replace("src", ".."));
		_files.push(new f());
	}

	return _files;
}

export async function loadMods() {
	const files = glob.sync(`./src/mods/**/index.ts`);
	const _files: BaseModule[] = [];
	for (let file of files) {
		let {default: f} = await import(file.replaceAll("\\", "/").replace("src", ".."));
		_files.push(new f());
	}

	return _files;
}