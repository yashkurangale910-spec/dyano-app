let roadmaps = [];

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'INDEX') {
        roadmaps = payload;
        /* eslint-disable-next-line no-restricted-globals */
        self.postMessage({ type: 'INDEX_COMPLETE' });
    }

    if (type === 'SEARCH') {
        const query = (payload || '').toLowerCase();
        const results = roadmaps.filter(rm => {
            const title = (rm.title || '').toLowerCase();
            const desc = (rm.description || '').toLowerCase();
            const category = (rm.category || '').toLowerCase();
            return title.includes(query) || desc.includes(query) || category.includes(query);
        });

        /* eslint-disable-next-line no-restricted-globals */
        self.postMessage({ type: 'SEARCH_COMPLETE', payload: results });
    }
};
