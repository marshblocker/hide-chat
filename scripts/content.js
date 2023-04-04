const MAX_INTERVAL_ROUNDS = 120;

const run = async () => {
	try {
		window.addEventListener(
			"load",
			async () => {
				let res = await chrome.storage.local.get(["names"]);
				let names = [...res.names];

				let round = 1;
				let initCheckTimer = setInterval(() => {
					let spans = document.getElementsByTagName("span");

					if (spans !== undefined && aNameInDOM(names, spans)) {
						clearInterval(initCheckTimer);
						spans = [...spans];

						for (let i = 0; i < names.length; i++) {
							toggleChatVisibility(names[i], spans, true);
						}
					}

					round++;
					// Maybe the list of names does not match any span in the DOM.
					if (round > MAX_INTERVAL_ROUNDS) {
						clearInterval(initCheckTimer);
					}
				}, 500);
			},
			false
		);

		chrome.storage.onChanged.addListener((changes, areaName) => {
			if (areaName === "local" && changes.names !== undefined) {
				const oldNames = changes.names.oldValue;
				const newNames = changes.names.newValue;

				const newNamesToHide = newNames.filter(
					(newName) => !oldNames.includes(newName)
				);
				const newNamesToShow = oldNames.filter(
					(oldName) => !newNames.includes(oldName)
				);

				let spans = document.getElementsByTagName("span");
				spans = [...spans];

				for (let i = 0; i < newNamesToHide.length; i++) {
					toggleChatVisibility(newNamesToHide[i], spans, true);
				}

				for (let i = 0; i < newNamesToShow.length; i++) {
					toggleChatVisibility(newNamesToShow[i], spans, false);
				}
			}
		});
	} catch (error) {
		console.log(error);
	}
};

// Only check if at least one of the name in names can be found in the spans array.
// This means the DOM have rendered the needed spans that contain the name of the
// chats to be hidden.
function aNameInDOM(names, spans) {
	let spansText = [...spans].map((span) => span.innerHTML);

	for (let i = 0; i < names.length; i++) {
		if (spansText.includes(names[i])) {
			return true;
		}
	}

	return false;
}

function toggleChatVisibility(name, spans, toHide) {
	for (let i = 0; i < spans.length; i++) {
		if (spans[i].innerHTML === name) {
			let parent =
				// This can break if Messenger UI changes (but can be easily fixed).
				spans[i].parentElement.parentElement.parentElement.parentElement
					.parentElement.parentElement.parentElement.parentElement
					.parentElement.parentElement.parentElement;
			parent.style.display = toHide ? "none" : "block";
		}
	}
}

(async () => {
	await run();
})();
