export const ssr = false;

export const actions = {
    addLike: async ({ locals, request }) => {
        const { likes } = await locals.pb.collection('likes').getOne('m92t9a16esiv7ml');
        
        await locals.pb.collection('likes').update('m92t9a16esiv7ml', { likes: likes + 1 });
    }
}