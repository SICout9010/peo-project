<script lang="ts">
    import { fade, fly } from 'svelte/transition';
  
    export let x: number;
    export let y: number;
  </script>
  
  <div
    class="absolute w-16 h-16 rounded-full select-none"
    style="left: {x}px; top: {y}px;"
    in:fade={{ duration: 300 }}
    out:fly={{ y: -20, duration: 300 }}
  >
    <div class="w-full h-full animate-pulse rounded-full">
        <img 
        src="https://media.tenor.com/9rTu7vcH9SEAAAAi/peo-yukinoshita-peo.gif" 
        alt="Peo patpat">
    </div>
  </div>  