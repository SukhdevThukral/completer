type Commit  = {hash: string; msg: string; author: string; date: string; note: string | null};

export let commandOutput = $state<string | null>(null);
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
    getCommits: ()=> Commit[],
    setCommits: (c: Commit[])=> void,
    triggerFlicker: ()=> void
) {
    setInterval(() => {
        const commits = getCommits();
        const idx = commits.findIndex(c => c.author === 'unknown');
        if (idx>0){
            const next = [...commits];
            const [item] = next.splice(idx, 1);
            next.splice(idx-1, 0, item);
            setCommits(next);
            triggerFlicker();
        }
    }, 22000);
}

export function setCommandOutput(v: string | null){
    commandOutput = v;
}