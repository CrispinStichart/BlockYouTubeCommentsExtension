"use strict";

let comments_div;

// The comments section div isn't loaded immeditely, it's only loaded when the user
// scrolls down far enough. Thus, the observer.
let observer = new MutationObserver(check_for_comment_section);

// When the comments first load, the commens div will initially be hidden, and then
// set to visible. This observer waits for that, and immediately hides it again.
// It only happens once per comment section, so we can disconnect right away.
let commentObserver = new MutationObserver((e) => {
  if (comments_div.hidden === false) {
    comments_div.hidden = true;
    commentObserver.disconnect();
  }
});

function check_for_comment_section() {
  comments_div = document.getElementById("comments");

  if (comments_div) {
    comments_div.hidden = true;
    observer.disconnect();

    // After loading, the comments div visiblity gets toggled, so we need
    // to watch for that.
    commentObserver.observe(comments_div, { attributes: true });

    // The button! All hail the button!
    const button_id = "lose_braincells_button";
    let lose_braincells_button = document.getElementById(button_id);

    // Not all the DOM elements are created fresh when naviagating to a new page.
    // If we didn't check for the existance of the button before adding, we'd see
    // the old ones.
    if (!lose_braincells_button) {
      lose_braincells_button = document.createElement("button");
      lose_braincells_button.id = button_id;
      lose_braincells_button.textContent = "Lose Braincells";
      let parent = comments_div.parentNode;
      parent.insertBefore(lose_braincells_button, comments_div);
    }

    lose_braincells_button.onclick = () => {
      comments_div.hidden = false;
    };
  }
}

// This is triggered when the user navigates to a new video
function set_up_observer(event) {
  let dest_url = new URL(event.destination.url);
  // We want to make sure we only set
  if (dest_url.pathname.startsWith("/watch")) {
    observer.observe(document, { childList: true, subtree: true });
  } else {
    observer.disconnect();
  }
}

window.navigation.addEventListener("navigate", set_up_observer);

set_up_observer({ destination: { url: window.location.href } });
