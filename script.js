const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarksList = [];

//Show modal and focus on first input
const showModal = () => {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

//Build bookmarks to DOM
const buildBookmarks = () => {
    //Remove all bookmarks
    bookmarksContainer.textContent = '';

    bookmarksList.forEach((bookmark) => {
        const { name, url } = bookmark;
        //Item
        const item = document.createElement('div');
        item.classList.add('item');
        //Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        //append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

const fetchBookmarks = () => {
    if (localStorage.getItem('bookmarks')) {
        bookmarksList = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarksList = [
            {
                name: 'Google',
                url: 'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarksList));
    }
    buildBookmarks();
}

//Validate form

const validateForm = (nameValue, urlValue) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!nameValue || !urlValue) {
        alert('Please Fill Both Fields!');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please Provide Valid Email Adress!');
        return false;
    }
    return true;
}

//Delete item

const deleteBookmark = url => {
    bookmarksList.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarksList.splice(i, 1);
        }
    });
    //update bookmarks array in storage and re populate dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksList));
    fetchBookmarks();
}

const storeBookmarkForm = e => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
        urlValue = `https://${urlValue}`;
    }
    if (!validateForm(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue
    };

    bookmarksList.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarksList));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

bookmarkForm.addEventListener('submit', storeBookmarkForm);
fetchBookmarks();