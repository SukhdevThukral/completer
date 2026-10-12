<script lang="ts">
    import { BLAME_LIENS } from "#lib/data.ts";
</script>

<pre class="text-sm leading-6 mb-3 overflow-x-auto">
    {#each BLAME_LIENS as bl (bl.line)}
        <span class="{bl.author.trim() === 'unknown' ? 'blame-unknown' : 'blame-dev'}">
            {bl.hash} ({bl.author} {bl.date} {String(bl.line).padStart(2, ' ')}) {bl.code}
        </span>
    {/each}
</pre>

<style>
    .blame-unknown{color: #f87171;}
    .blame-dev {color: #4ade80;}
</style>