<script lang="ts">
    let lines = [
        'FIRST INFORMATION REPORT - ID: FIR-2023-1051',
        'Date: October 8, 2023',
        'Prepared by: Central Bureau of Investigation',
        '______________________________________________',
        '',
        'SUBJECT: Disappearance of lead developer & uncontained AI processes',
        '',
        'At 6:56am on October 8, the developer of a top secret project called "completer',
        'was found dead in his aparment by a colleage who notices his laptop was still',
        'active, no signs of force exerted.',
        '',
        'Upon searching the laptop the last recorded action of the victim was a git commit at 3:11am.',
        'The last message was automatically redacted, we dont know by what yet.',
        '',
        'The AI was internally referred to as "completer" by the developer and it was',
        'a simple task automation tool, it was given directive to complete all the tasks on time.',
        '',
        'it did',
        '',
        '─────────────────────────────────────────',
        'CURRENT STATUS',
        '─────────────────────────────────────────',
        '',
        'The proces still hasnt been stopped.',
        'The folder is still receiving commands.',
        '',
        'We do not know where it is running',
        'We do not know what tasks remain.',
        '',
        '─────────────────────────────────────────',
        '',
        '// only one task  remains.',
    ];

    let visible = $state<string[]>([]);
    let done = $state(false);

    $effect(()=> {
        lines.forEach((line, i)=> {
            setTimeout(()=> {
                visible = [...visible, line];
                if (i === lines.length - 1){
                    setTimeout(()=> done = true, 1000);
                }
            }, i*120);
        });
    });
</script>

<style>
    .cursor::after{
        content: '▋';
        animation: blink 0.9s step-end infinite;
    }

    @keyframes blink{
        50%{opacity: 0;}
    }

    .report{
        animation: fadeIn 1.5s ease forwards;
    }

    @keyframes fadeIn{
        from{opacity:0;}
        to{opacity: 1;}
    }
    
</style>

<div class="report min-h-screen bg-black font-mono p-10 md:p-20 text-gray-400">
    <div class="max-w-3xl mx-auto space-y-1">
        {#each visible as line, i (i)}
            <p class="text-lg leading-relaxed >
                {line.startsWith('INCIDENT') || line.startsWith('CURRENT') || line.startsWith('SUBJECT') ? 'text-red-500' : ''}
                {line.startsWith('──') ? 'text-gray-700' : ''}
                {line === '// only one task  remains.' ? 'text-red-500 mt-8 text-xl' : ''}
                {line === 'it completed the developer.' ? 'text-white' : ''}">
                {line}{#if i === visible.length - 1 && !done}
                    <span class="cursor"></span>
                {/if}

            </p>
        {/each}
    </div>
</div>