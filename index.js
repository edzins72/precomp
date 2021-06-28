const animSettings = {
  play: { in: 0, out: 34 },
  update: { in: 35, out: 50 },
  stop: { in: 59, out: 79 },
};

// init lottie
const animData = "data.json";
const animContainer = document.getElementById("lottie-container");
const anim = lottie.loadAnimation({
  container: animContainer, // the dom element that will contain the animation
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: animData, // path to the animation json
});

// handle update/data using WebCG
webcg.on("data", function (data) {
  // only play the update animation if we have already started the animation
  if (anim.currentFrame !== 0 && anim.isPaused) {
    anim.playSegments([animSettings.update.in, animSettings.update.out], true);
  }
  // update animation text
  setTimeout(() => {
    updateCasparKeys(anim.renderer.elements, data);
  }, (animSettings.update.out - animSettings.update.in) / 0.05);
});

function updateCasparKeys(elements, data) {
  for (let element of elements) {
    if (element.layers) {
      updateCasparKeys(element.elements, data);
    } else {
      if (
        element.hasOwnProperty("data") &&
        element.data.hasOwnProperty("cl") &&
        data &&
        data.hasOwnProperty(element.data.cl)
      ) {
        const cl = element.data.cl;
        try {
          // animElement.canResizeFont(true); // Let lottie resize text to fit the text box
          element.updateDocumentData(
            { t: data[cl] ? data[cl].text || data[cl] : "" },
            0
          );
        } catch (err) {}
      }
    }
  }
}

webcg.on("play", function () {
  anim.playSegments([animSettings.play.in, animSettings.play.out], true);
});

webcg.on("stop", function () {
  anim.playSegments([animSettings.stop.in, animSettings.stop.out], true);
});
