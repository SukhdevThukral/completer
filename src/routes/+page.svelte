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

    let visible = $state<number[]>([]);
    let glitching = $state(false);
    let flickering = $state(false);

    let audioCtx: AudioContext | null = null;

    function playStaticMusic(){
        if (!audioCtx){
            audioCtx = new AudioContext();
        }

        const ctx = audioCtx;
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);

        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++){
            data[i] = (Math.random() * 2 - 1 ) * 0.15;
        }

        const src = ctx.createBufferSource();
        const gain = ctx.createGain();

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        src.buffer = buf;
        src.connect(gain);
        src.connect(ctx.destination);
        src.start();
    }

    function triggerGlitch() {
        glitching = true;
        playStaticMusic();
        setTimeout(() => {
            (glitching = false);
        }, 800);
    }

    function triggerFlicker() {
        flickering = true;
        setTimeout(() => {
            (flickering = false)
        }, 150);
    }

    function isglitchCommit(msg: string){
        return msg === '' || msg.includes('DO NOT MERGE') || msg === 'please';
    }

    onMount(() => {
        commits.forEach((_, i) => {
            setTimeout(() => {
                visible = [...visible, i];
            }, i* 120);
        });

        setInterval(() => {
            if (Math.random() < 0.15) {
                triggerFlicker();
            }
        },  3000);

        const titles = [
            'completer',
            'completer.',
            'completer..',
            'completer...',
            'it knows..',
            'completer',
        ];

        let t = 0;

        setInterval(() => {
            document.title = titles[t % titles.length];
            t++;
        }, 2000);
    })
</script>


<main class="crt min-h-screen bg-black text-green-400 font-mono p-10 {glitching ? 'glitch' : ''} {flickering ? 'flicker' : ''}">
    <div class="max-w-5xl mx-auto">

        <div class="mb-10">
            <p class="text-gray-600 text-lg">~/projects/completer</p>
            <p class="text-gray-500 text-xl mt-1">$ git log --oneline</p>
        </div>

        <div class="space-y-1">
            {#each commits as commit, i (i)}
                {#if visible.includes(i)}
                    <div 
                        role="presentation"
                        onmouseenter={() => commit.author === 'unknown' && triggerGlitch()}
                        class="w-full text-left flex gap-6 items-start py-3 px-4 rounded
                            {commit.author === 'unknown' ? 'text-red-400' : ''}
                            {isglitchCommit(commit.msg) ? 'opacity-60 hover:opacity-100' : ''}"
                    >
                        <span class="text-yellow-600 text-xl shrink-0 w-24">{commit.hash}</span>
                        <span class="flex-1 text-2xl {commit.msg === '' ? 'opacity-20' : ''}">
                            {commit.msg || '...'}
                        </span>
                        <span class="text-gray-600 text-base shrink-0 pt-1">{commit.author}, {commit.date}</span>
                    </div>
                {/if}
            {/each}
        </div>

        <div class="mt-8 flex items-center gap-2">
            <span class="text-gray-600 text-xl">$</span>
            <span class="w-3 h-6 bg-green-400 inline-block animate-pulse"></span>
        </div>
        
    </div>
</main>
