class ChatNames {
    hiddenChatNames = new Array();

    get = () => {
        chrome.storage.local.get(["names"])
            .then(console.log)
            .catch(console.log);
    };

    put = () => {
        let hiddenChatsList = document.querySelector('#hidden-chats');

        this.hiddenChatNames
            .map((name) => {
                let li = document.createElement("li");
                let text = document.createTextNode(name);
                li.appendChild(text);

                hiddenChatsList?.appendChild(li);
            })
    };
}

class HiddenChatsList {
    
    constructor() {
        this.list = document.getElementById('hidden-chats');
        if (this.list === null) {
            throw 'list is not found.';
        }
        this.get()
            .then(names => {
                this.names = names || [];
                console.log('names: ', this.names);
                this.put();

                this.updateNamesBtn = document.getElementById('add-chat-name');
                this.updateNamesBtn?.addEventListener('click', () => {
                    this.updateNames()
                        .then(newName => console.log(newName))
                        .catch(err => console.log(err));
                }, false);

                this.clearAllBtn = document.getElementById('clear-all');
                this.clearAllBtn?.addEventListener('click', () => {
                    this.clearNames()
                        .then(removedNames => console.log(removedNames))
                        .catch(err => console.log(err));
                }, false);
            })
            .catch(err => { throw err });
    }

    get() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['names'])
                .then(res => resolve(res.names))
                .catch(err => reject(err));
        });
    }

    put() {
        while (this.list.firstChild !== null) {
            this.list.removeChild(this.list.firstChild);
        }

        console.log(this.names);

        this.names
            .map(name => {
                let li = document.createElement("li");
                let text = document.createTextNode(name);
                li.appendChild(text);

                this.list.appendChild(li);
            })
    }

    store() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ names: this.names })
                .then(() => resolve(null))
                .catch(err => reject(err));
        })
    }

    updateNames() {
        return new Promise((resolve, reject) => {
            let textInput = document.getElementById("chat-name");

            if (textInput === null) {
                console.log('textInput is null');
                return;
            }

            let newName = textInput.value;
            textInput.value = '';
            console.log('newName: ', newName);
            this.names.push(newName);
            this.put();
            this.store()
                .then(() => resolve(newName))
                .catch(err => reject(err));
        });
    }

    clearNames() {
        return new Promise((resolve, reject) => {
            const removedNames = this.names;
            this.names = [];

            while (this.list.firstChild !== null) {
                this.list.removeChild(this.list.firstChild);
            }
    
            this.store()
                .then(() => resolve(removedNames))
                .catch(err => reject(err));
        });
    }
}

const runScript = () => {
    let hiddenChatsList = new HiddenChatsList();
}

runScript();