const events = [];

function observer() {
  setInterval(() => {
    console.log('checking...')
    if (events.length > 0) {
      const event = events.shift();
      event();
    }
  }, 50);
}

const fn = () => {
  console.log('event callback');
}

setInterval(() => {
  events.push(fn);
}, 500);

observer();