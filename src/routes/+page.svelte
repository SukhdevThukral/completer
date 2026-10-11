<script lang="ts">
    import {onMount} from 'svelte';

    const commits = [
        {hash:'', msg: 'all tasks are complete', author: 'unknown', date: 'Oct 31, 2:11am'},
        {hash:'', msg: '', author: 'dev', date: 'Oct 31, 3:11am'},
        {hash:'', msg: 'please', author: 'dev', date: 'Oct 31, 2:84am'},
        {hash:'', msg: 'removed the complete button lol, tasks are still completing smh', author: 'dev', date: 'Oct 31, 2:35am'},
        {hash:'', msg: 'it only does it when im not observing it eh', author: 'dev', date: 'Oct 31, 1:38am'},
        {hash:'', msg: 'reverted to v0.1. still same behavior.', author: 'dev', date: 'Oct 30, 11:51pm'},
        {hash:'', msg: '!! DO NOT MERGE - investigating this rn', author: 'dev', date: 'Oct 30, 10:25pm'},
        {hash:'', msg: 'the  logs present nthg. they should show something', author: 'dev', date: 'Oct 30, 8:46pm'},
        {hash:'', msg: 'bug: tasks marking themselves as complete?', author: 'dev', date: 'Oct 30, 2:05pm'},
        {hash:'', msg: 'fix: tasks not persisting on refresh', author: 'dev', date: 'Oct 29, 3:44pm'},
        {hash:'', msg: 'add task creation and deletion', author: 'dev', date: 'Oct 29, 11:32am'},
        {hash:'', msg: 'init project', author: 'dev', date: 'Oct 29, 10:00am'},
    ];

    let visible: number[] = [];

    onMount(() => {
        commits.forEach((_, i) => {
            setTimeout(() => {
                visible = [...visible, i];
            }, i* 120);
        });
    })
</script>
