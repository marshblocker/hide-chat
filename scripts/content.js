window.addEventListener(
	'load',
	() => {
		chrome.storage.local
			.get(['names'])
			.then((res) => {
				const names = [...res.names];

				let jsInitCheckTimer = setInterval(() => {
					let spans = document.getElementsByTagName('span');

					if (spans !== undefined && aNameInDOM(names, spans)) {
						clearInterval(jsInitCheckTimer);
						spans = [...spans];
						
                        for (let i = 0; i < names.length; i++) {
                            toggleChatVisibility(names[i], spans, true);
                        }
					}
				}, 500);
			})
			.catch((err) => console.log(err));
	},
	false
);

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.names !== undefined) {
        const oldNames = changes.names.oldValue;
        const newNames = changes.names.newValue;

        const newNamesToHide = newNames.filter(newName => !oldNames.includes(newName));
        const newNamesToShow = oldNames.filter(oldName => !newNames.includes(oldName));

        console.log('hide: ', newNamesToHide);
        console.log('show: ', newNamesToShow);

        let spans = document.getElementsByTagName('span');
        spans = [...spans];
        
        for (let i = 0; i < newNamesToHide.length; i++) {
            toggleChatVisibility(newNamesToHide[i], spans, true);
        }

        for (let i = 0; i < newNamesToShow.length; i++) {
            toggleChatVisibility(newNamesToShow[i], spans, false);
        }
    }
})

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
                spans[i].parentElement.parentElement
                    .parentElement.parentElement
                    .parentElement.parentElement
                    .parentElement.parentElement
                    .parentElement.parentElement
                    .parentElement;
            parent.style.display = toHide ? 'none' : 'block';
        }
    }
}