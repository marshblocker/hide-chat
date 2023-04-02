window.addEventListener(
	"load",
	() => {
		chrome.storage.local
			.get(["names"])
			.then((res) => {
				const names = [...res.names];

				let jsInitCheckTimer = setInterval(() => {
					let spans = document.getElementsByTagName("span");

					if (spans !== undefined && namesInDOM(names, spans)) {
						clearInterval(jsInitCheckTimer);
						spans = [...spans];
						for (let i = 0; i < spans.length; i++) {
							if (names.includes(spans[i].innerHTML)) {
								let parent =
									spans[i].parentElement.parentElement
										.parentElement.parentElement
										.parentElement.parentElement
										.parentElement.parentElement
										.parentElement.parentElement
										.parentElement;
                                parent.remove();
							}
						}
					}
				}, 100);
			})
			.catch((err) => console.log(err));
	},
	false
);

function namesInDOM(names, spans) {
	let spansText = [...spans].map((span) => span.innerHTML);

	for (let i = 0; i < names.length; i++) {
		if (!spansText.includes(names[i])) {
			return false;
		}
	}

	return true;
}
