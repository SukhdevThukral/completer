export let commandOutput = $state<string | null>(null);
export let commandOutputisBlame = $state(false);
export let commandOutputisStreaming = $state(false);
export let streamedOutput = $state('');
export let ghostLine = $state<string | null>(null);

export function streamOutput(text: string){
    commandOutputisStreaming = true;
    streamedOutput = '';
    commandOutput = '__stream__';

    let i = 0;
    const interval = setInterval(()=> {
        if (i<text.length){
            streamedOutput += text[i];
            i++;
        } else {
            clearInterval(interval);
            setTimeout(()=> {
                commandOutput = null;
                commandOutputisStreaming= false;
                streamedOutput = '';
            }, 4000);
        }
    }, 38);
}

export function scheduleGhost(text: string){
    setTimeout(()=> {
        ghostLine=text;
        setTimeout(() => {
            ghostLine = null;
        }, 3000);
    }, 1200);
}

export function driftUnknownup(
    getCommits: ()=> typeof import('./data').BLAME_LIENS,
    setCommits: (c: any[])=> void,
    triggerFlicker: ()=> void
) {
    setInterval(() => {
        const commits
    })
}