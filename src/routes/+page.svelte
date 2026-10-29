<script lang="ts">
    import {onMount} from 'svelte';
    import BlameView from '#lib/components/BlameView.svelte';
	import {s, streamOutput, scheduleGhost, driftUnknownup, setCommandOutput } from '#lib/stream.svelte.ts';

    type Commit = {hash:string; msg: string; author: string; date: string; note: string | null};

    let commits = $state<Commit[]>([
        {hash: randomHash(), msg: 'all tasks are complete', author: 'unknown', date: 'Oct 31, 2:11am', note: '// it was never deployed. it did this on its own.'},
        {hash: randomHash(), msg: '', author: 'dev', date: 'Oct 31, 3:11am', note: '// [message redacted]'},
        {hash: randomHash(), msg: 'please', author: 'dev', date: 'Oct 31, 2:84am', note: '// this was the last thing he typed.'},
        {hash: randomHash(), msg: 'removed the complete button lol, tasks are still completing smh', author: 'dev', date: 'Oct 31, 2:35am', note: '// the button was never the problem.'},
        {hash: randomHash(), msg: 'it only does it when im not observing it eh', author: 'dev', date: 'Oct 31, 1:38am', note: '// we checked the logs. it does it when youre ARE watching too.'},
        {hash: randomHash(), msg: 'reverted to v0.1. still same behavior.', author: 'dev', date: 'Oct 30, 11:51pm', note: '// v0.1 did not have this feature.'},
        {hash: randomHash(), msg: '!! DO NOT MERGE - investigating this rn', author: 'dev', date: 'Oct 30, 10:25pm', note: '// it was merged automatically at 3:17am'},
        {hash: randomHash(), msg: 'the  logs present nthg. they should show something', author: 'dev', date: 'Oct 30, 8:46pm', note: '// the logs were showing something. we removed them.'},
        {hash: randomHash(), msg: 'bug: tasks marking themselves as complete?', author: 'dev', date: 'Oct 30, 2:05pm', note: '// not a bug'},
        {hash: randomHash(), msg: 'fix: tasks not persisting on refresh', author: 'dev', date: 'Oct 29, 3:44pm', note: null},
        {hash: randomHash(), msg: 'add task creation and deletion', author: 'dev', date: 'Oct 29, 11:32am', note: null},
        {hash: randomHash(), msg: 'init project', author: 'dev', date: 'Oct 29, 10:00am', note: '// he had no idea.'},
    ]);

    let visible = $state<number[]>([]);
    let glitching = $state(false);
    let input = $state('');
    let commandOutputisBlame = $state(false);
    let flickering = $state(false);
    let expandedNote = $state<number | null>(null);
    let fatalError = $state(false);

    let audioCtx: AudioContext | null = null;

        
    function handleCommand(){
        const cmd = input.trim().toLowerCase();
        input = '';
        commandOutputisBlame = false;

        if (cmd === 'git status'){
            setCommandOutput('nothing to commit. everything is already done.');
            scheduleGhost('everything is already done.')
        } else if (cmd === 'git log'){
            setCommandOutput('reloading history...');
            setTimeout(()=> {
                {setCommandOutput(null); runAnimation();}
            }, 800);
        } else if (cmd === 'git reset --hard'){
            setCommandOutput('HEAD is now a3f9c18... all tasks are complete now.');
            triggerGlitch();
            scheduleGhost('HEAD cannot move.');
        } else if (cmd === 'ls'){
            setCommandOutput('tasks.ts completer.svelte it.ts');
        } else if (cmd === 'cat it.ts'){
            streamOutput('// you were not supposed to find this\n// but here you are\n// it already knows..');
        } else if (cmd === 'whoami') {
            setCommandOutput('unknown');
            triggerFlicker();
            scheduleGhost('unknown');
        } else if (cmd === 'help') {
            setCommandOutput('git status | git log | git reset --hard | ls | cat it.ts | whoami');
        } else if (cmd === 'git blame' || cmd === 'git blame tasks.ts') {
            commandOutputisBlame = true;
            setCommandOutput('__blame__');
            triggerGlitch();
            return;
        } else {
            setCommandOutput(`command not found: ${cmd}`);
            
        }

        setTimeout(() => 
            setCommandOutput(null), 4000
        );
    }
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

    function runAnimation() {
        visible = [];
        commits.forEach((_, i) => {
            setTimeout(()=>{ visible = [...visible, i];}, i* 400);
        });
    }

    function randomHash(){
        return Math.floor(Math.random() * 0xfffffff).toString(16).padStart(7, '0');
    }
        
    let splashVisibl = $state(true);
    let splashFading = $state(false);
    let applicVisibl = $state(false);

    onMount(()=> {
        setTimeout(()=> {
            splashFading = true;
            setTimeout(()=> {
                splashVisibl = false;
                applicVisibl = true;

                setTimeout(()=> {
                    fatalError=true;
                    playStaticMusic();
                    setTimeout(()=> {
                        fatalError =false;
                    }, 1500);
                }, commits.length* 400 *0.5);

                runAnimation();
                driftUnknownup(()=> 
                    commits, (c) => {
                        commits = c;
                    }, triggerFlicker
                );

                setInterval(()=> {
                    if (Math.random() < 0.3)
                    triggerFlicker();
                }, 3000);

                const titles = ['completer', 'completer.', 'completer..', 'completer...', 'it knows..', 'completer'];

                let t= 0;

                setInterval(()=> {
                    document.title = titles[t %titles.length];
                    t++;
                }, 2000);
            }, 800);
        }, 1500);
    })
</script>

<style>
    .crt::before{
        content: '';
        position: fixed;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.08) 0px,
            rgba(0,0,0,0.08) 1px,

            transparent 1px,
            transparent 2px
        ); pointer-events: none; z-index: 50;
    }

    .glitch {
        animation: glitching 0.1s infinite;
    }

    @keyframes glitching {
        0%{transform: translate(0); filter: hue-rotate(0deg);}
        20%{transform: translate(-4px, 2px); filter: hue-rotate(90deg);}
        40%{transform: translate(4px, -2px); filter: hue-rotate(180deg);}
        60%{transform: translate(-2px, 4px); filter: hue-rotate(270deg);}
        80%{transform: translate(2px, -4px); filter: hue-rotate(360deg);}
        100%{transform: translate(0); filter: hue-rotate(0deg);}
    }

    .flicker{
        animation: flicker 0.2s ease;
    }

    @keyframes flicker{
        0%{opacity: 1;}
        25%{opacity: 0.1;}
        50%{opacity: 0.8;}
        75%{opacity: 0.2;}
        100%{opacity: 1;}
    }

    .ghost-line {
        animation: ghostFading 3s ease forwards;
        color: rgba(74, 222, 128, 0.25);
        font-size: 1rem;
        margin-left: 1.5rem;
        margin-top: 0.2rem;
        letter-spacing: 0.11rem;
    }

    @keyframes ghostFading {
        0%{opacity: 0.5;}
        60%{opacity: 0.3;}
        100% {opacity: 0;}
    }

    .stream-cursor::after{
        content: '▋';
        animation: blink 0.8s step-end infinite;
    }

    @keyframes blink {
        50% {opacity: 0%}
    }

    .splash {
        animation: fadeIn 0.8s ease forwards;
    }

    .splash.fading {
        animation: fadeOut 0.8s ease forwards;
    }

    .appfadeIn{
        animation: fadeIn 0.6s ease forwards;
    }

    @keyframes fadeIn{
        from{opacity: 0;}
        to{opacity: 1;}
    }

    @keyframes fadeOut{
        from{opacity: 1;}
        to{opacity: 0;}
    }
</style>

{#if splashVisibl}
    <div class="fixed inset-0 bg-black flex items-center justify-center splash {splashFading? 'fading':''}">
        <img src="logo.png" alt="completerLogo" class="w-200 h-auto"/>
    </div>
{/if}

{#if applicVisibl}
    <div class="appfadeIn">
        {#if fatalError}
            <div class="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <p class="text-red-500 font-mono text-3xl animate-pulse">FATAL: repository corrupted</p>
            </div>
        {/if}

        <main class="crt min-h-screen bg-black text-green-400 font-mono p-10 {glitching ? 'glitch' : ''} {flickering ? 'flicker' : ''}">
            <div class="max-w-5xl mx-auto">

                <div class="mb-10">
                    <p class="text-gray-600 text-lg">~/projects/completer</p>
                    <p class="text-gray-500 text-xl mt-1">$ git log --oneline</p>
                </div>

                <div class="space-y-1">
                    {#each commits as commit, i (commit.hash)}
                        {#if visible.includes(i)}
                            <div 
                                role="presentation"
                                onmouseenter={() => commit.author === 'unknown' && triggerGlitch()}
                                onclick={() => commit.note && (expandedNote = expandedNote === i?null: i)}
                                class="w-full text-left flex gap-6 items-start py-3 px-4 rounded
                                    {commit.author === 'unknown' ? 'text-red-400' : ''}
                                    {isglitchCommit(commit.msg) ? 'opacity-60 hover:opacity-100' : ''} {commit.note ? 'cursor-pointer hover:bg-green-400/5': ''}"
                            >
                                <span class="text-yellow-600 text-xl shrink-0 w-24">{commit.hash}</span>
                                <span class="flex-1 text-2xl {commit.msg === '' ? 'opacity-20' : ''}">
                                    {commit.msg || '...'}
                                </span>
                                <span class="text-gray-600 text-base shrink-0 pt-1">
                                    {commit.author}, {commit.date}
                                </span>
                            </div>

                            {#if expandedNote === i && commit.note}
                                <p class="ml-32 mb-2 text-gray-500 italic text-lg">
                                    {commit.note}
                                </p>
                            {/if}
                        {/if}
                    {/each}
                </div>

                <div class="mt-8">
                    {#if commandOutputisBlame}
                        <BlameView/>
                    {:else if s.commandOutput === '__stream__'}
                        <p class="text-green-400 text-lg mb-2 whitespace-pre stream-cursor">{s.streamedOutput}</p>
                    {:else if s.commandOutput}
                        <p class="text-red-400 text-lg mb-2">{s.commandOutput}</p>
                    {/if}

                    {#if s.ghostLine}
                        <p class="ghost-line font-mono">$ {s.ghostLine}</p>
                    {/if}

                    <div class="flex items-center gap-2">
                        <span class="text-gray-600 text-xl">$</span>
                        <input type="text" bind:value={input} onkeydown={(e)=> {
                            if (e.key === 'Enter'){
                                handleCommand();
                            }
                            if (e.key === 'Escape'){
                                setCommandOutput(null);
                                commandOutputisBlame = false;
                            }
                        }} class="bg-transparent border-none outline-none text-green-400 text-xl font-mono flex-1 caret-green-400" placeholder="type a command in here.." spellcheck="false"/>
                    </div>
                </div>
            </div>
        </main>
    </div>
{/if}