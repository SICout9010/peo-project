<script lang="ts">
    import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
    import { enhance } from '$app/forms';
    import PocketBase from 'pocketbase';
    import * as Dialog from "$lib/components/ui/dialog/index"
    import { Button } from "$lib/components/ui/button";
	import { onDestroy, onMount } from "svelte";
	import Box from "$lib/components/Box.svelte";
    
    // Pocketbase SSE
    const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

    let likes = $state(0);
    let boxes: { id: number; x: number; y: number }[] = $state([]);
    let nextId = $state(0);
    let isTermsOpen = $state(false);
    let isReadytoBless = $state(false);

    async function getLikes() {
        const likes_collection = await pb.collection('likes').getOne('m92t9a16esiv7ml');
        console.log(likes_collection.likes);
        return likes_collection.likes;
    }

    pb.collection('likes').subscribe('m92t9a16esiv7ml', async (event) => {
        console.log(event.action);
        console.log(event.record);
        likes = event.record.likes;
    })

    // Life cycles
    onMount(async () => {
        isTermsOpen = true;
        likes = await getLikes();
    });

    onDestroy(() => {
        pb.collection('likes').unsubscribe('m92t9a16esiv7ml');
    })

    function handleClick(event: MouseEvent) {
        const { clientX, clientY } = event;
        const newBox = { id: nextId++, x: clientX, y: clientY };
        boxes = [...boxes, newBox];

        setTimeout(() => {
            boxes = boxes.filter(box => box.id !== newBox.id);
        }, 150);

        if (boxes.length > 10) {
            boxes = boxes.slice(1);
        }
    }

    function closeTerms() {
        isTermsOpen = false;
        document.startViewTransition().finished.then(() => {
            document.querySelector('.block-view')?.classList.add('opacity-0');
            document.querySelector('.block-view')?.classList.add('hidden');
        })
    }
</script>

<main class="flex flex-col items-center justify-center h-screen">
    <div class="block-view absolute w-screen h-screen bg-black transition-opacity duration-500"></div>
    <div class="flex flex-col items-center justify-center h-full space-y-4">
        <img src="/logo.avif" alt="Yukinoshita_logo" class="w-[50vw] h-40"/>
        <h1 class="text-4xl font-bold font-aristotelica">Yukinoshita Blessing site</h1>
        <!-- Pop section -->
        <div class={isReadytoBless ? "flex flex-col items-center justify-center space-y-4" : "hidden"}>
            {#each boxes as box (box.id)}
                <Box x={box.x} y={box.y} />
            {/each}
            <form action="?/addLike" method="post" use:enhance>            
                <button type="submit" onclick={handleClick}>
                    <img 
                    draggable="false"
                    src="https://media.discordapp.net/attachments/915498091350728704/1043254984994734100/peopray.png?ex=677799ab&is=6776482b&hm=67499352282d1c405636e0f11a9bdd99ab0064faacbe5ccd11fd8d79633fd593&=&format=webp&quality=lossless" 
                    alt="Peo blessing"
                    class="w-96 h-96 cursor-pointer shadow-lg rounded-lg select-none"
                    >
                </button>
            </form>
            <Button variant="secondary" class="rounded-full">{likes}</Button>
        </div>
        <div class={isReadytoBless ? "hidden" : "flex flex-col items-center justify-center space-y-4"}>
            <img src="https://media.tenor.com/9rTu7vcH9SEAAAAi/peo-yukinoshita-peo.gif" alt="">
            <Button class="font-bold font-aristotelica" onclick={() => isReadytoBless = true}>Bless her!</Button>
        </div>
    </div>
</main>

{#if isTermsOpen}
    <Dialog.Root open={isTermsOpen} onOpenChange={closeTerms}>
        <Dialog.Content>
        <Dialog.Header>
            <Dialog.Description>
                <div>
                    <img src="/logo.avif" alt="Yukinoshita_logo" class="w-full h-20"/>
                    <h1 class="text-2xl font-bold font-aristotelica text-center">Yukinoshita Fan site</h1>
                    <p class="mt-2 text-sm">This site is a fan club site made by fans and is not affiliated with Yukinoshita Peo. However, this website has her blessing.</p>
                </div>
            </Dialog.Description>
        </Dialog.Header>
        </Dialog.Content>
    </Dialog.Root>
{/if}

<style>
    ::view-transition-group(root) {
    pointer-events: none;
    animation-timing-function: var(--expo-in);
    }

    ::view-transition-new(root) {
    mask: url('https://media.discordapp.net/attachments/1043209903650656267/1322263703126802492/Peo_shikanoko_final.gif?ex=67782689&is=6776d509&hm=d72bdfa0ca4755766d416b0fc87efbafd7be6be764e0db83255166d2c8fca58c&=&width=527&height=620') center / 0 no-repeat;
    animation: scale 1s;
    }

    ::view-transition-old(root)
    .block-view::view-transition-old(root) {
    animation: scale 1s;
    }

    @keyframes scale {
    0% {
        mask-size: 0;
    }
    10% {
        mask-size: 50vmax;
    }
    90% {
        mask-size: 50vmax;
    }
    100% {
        mask-size: 2000vmax;
    }
    }
</style>