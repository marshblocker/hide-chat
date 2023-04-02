chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local
		.set({ names: [] })
		.then(() => console.log("Initialize names to []."))
		.catch((err) => console.log(err));
});
