type Commit  = {hash: string; msg: string; author: string; date: string; note: string | null};

export const s = $state({
    commandOutput: null as string | null,
    commandOutputisStreaming: false,
    streamedOutput: '',
    ghostLine: null as string | null,
});


export function streamOutput(text: string){
    s.commandOutputisStreaming = true;
    s.streamedOutput = '';
    s.commandOutput = '__stream__';

    let i = 0;
    const interval = setInterval(()=> {
        if (i<text.length){
            s.streamedOutput += text[i];
            i++;
        } else {
            clearInterval(interval);
            setTimeout(()=> {
                s.commandOutput = null;
                s.commandOutputisStreaming= false;
                s.streamedOutput = '';
            }, 4000);
        }
    }, 38);
}

export function scheduleGhost(text: string){
    setTimeout(()=> {
        s.ghostLine=text;
        setTimeout(() => {
            s.ghostLine = null;
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
    s.commandOutput = v;
}