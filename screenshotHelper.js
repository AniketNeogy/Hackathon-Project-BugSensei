(() => {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  overlay.style.zIndex = "9999";
  overlay.style.cursor = "crosshair";

  console.log("Screenshot helper script injected!");

  document.body.appendChild(overlay);

  let startX, startY, endX, endY, selectionBox;

  overlay.addEventListener("mousedown", (e) => {
    startX = e.pageX;
    startY = e.pageY;

    selectionBox = document.createElement("div");
    selectionBox.style.position = "absolute";
    selectionBox.style.border = "2px dashed white";
    selectionBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    selectionBox.style.zIndex = "10000";
    selectionBox.style.pointerEvents = "none";

    document.body.appendChild(selectionBox);
  });

  overlay.addEventListener("mousemove", (e) => {
    if (!selectionBox) return;

    endX = e.pageX;
    endY = e.pageY;

    selectionBox.style.left = `${Math.min(startX, endX)}px`;
    selectionBox.style.top = `${Math.min(startY, endY)}px`;
    selectionBox.style.width = `${Math.abs(endX - startX)}px`;
    selectionBox.style.height = `${Math.abs(endY - startY)}px`;
  });

  overlay.addEventListener("mouseup", () => {
    const rect = {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };

    overlay.remove();
    if (selectionBox) selectionBox.remove();

    chrome.runtime.sendMessage({ action: "captureArea", rect });
  });
})();
