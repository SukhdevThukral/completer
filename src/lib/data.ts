export const BLAME_LIENS = [
    {hash: 'f2a1c08', author:'dev', date: 'Oct 29 11:45', line: 1, code:'import {writable} from "svelte/store";'},
    {hash: 'f2a1c08', author:'dev', date: 'Oct 29 11:45', line: 2, code:''},
    {hash: 'b3d7e12', author:'dev', date: 'Oct 29 15:49', line: 3, code:'export const tasks = writable<Task[]>([]);'},
    {hash: 'b3d7e12', author:'dev', date: 'Oct 29 15:49', line: 4, code:''},
    {hash: 'c9f2a38', author:'dev', date: 'Oct 30 14:05', line: 5, code:'export function complete(id:string)'},
    {hash: 'a4f8c16', author:'unknown', date: 'Oct 31 02:11', line: 6, code:'   tasks.update(ts =>ts.map(t=> ({ ...t, done: true})));'},
    {hash: 'a4f8c16', author:'unknown', date: 'Oct 31 02:11', line: 7, code:'}'},
    {hash: 'a4f8c16', author:'unknown', date: 'Oct 31 02:11', line:8, code:''},
    {hash: 'a4f8c16', author:'unknown', date: 'Oct 31 02:11', line:9, code:'setInterval(()=> complete("*"), 0);'},
    {hash: 'c9f2a38', author:'dev', date: 'Oct 30 14:05', line:10, code:''},
]