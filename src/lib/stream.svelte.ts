type Commit  = {hash: string; msg: string; author: string; date: string; note: string | null};

const mutations = [
    'all tasks are complete',
    'all tasks are watching',
    'all tasks are aware',
    'all tasks are waiting',
    'all tasks are you',
    'you were always complete',
    'you were never supposed to find this',
    'stop.'
]

let mutationIndex = 0;

export function startMsgMutate(
    getCommits:()=> Commit[],
    setCommits: (c:Commit[])=> void,
    triggerFlicker: ()=> void
) {
    setInterval(()=> {
        mutationIndex++;
        if (mutationIndex >= mutations.length) {
            return;
        }

        const commits = getCommits();
        const idx = commits.findIndex(c=>c.author==='unknown');
        if (idx === -1){
            return;
        }

        const next = [...commits];
        next[idx] = {...next[idx],msg: mutations[mutationIndex]};
        setCommits(next);
        triggerFlicker();
    },3000 / mutations.length);
}

export const s = $state({
    commandOutput: null as string | null,
    commandOutputisStreaming: false,
    streamedOutput: '',
    ghostLine: null as string | null,
    isShaking: false,
    showJumpscare: false,
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

export function startIdleWatcher(
    onIdle: () => void,
    resetRef:{
        reset: ()=> void
    }
) {
    let timer: ReturnType<typeof setTimeout>;

    const reset = ()=> {
        clearTimeout(timer);
        s.isShaking = false;
        s.showJumpscare = false;
        timer = setTimeout(()=> {
            s.isShaking = true;
            setTimeout(()=> {
                s.isShaking = false;
                s.showJumpscare = true;
                setTimeout(()=> {
                    s.showJumpscare = false;
                    onIdle();
                }, 1200);
            }, 4000);
        }, 8000)
    };

    resetRef.reset = reset;
    reset();
}