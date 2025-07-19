class SharedWindow extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "shared-window",
      title: "Shared Window",
      template: "modules/shared-window/templates/window.hbs",
      popOut: true,
      resizable: true,
      width: 400,
      height: 300
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    // 투명도 슬라이더
    html.find("#opacity").on("input", event => {
      const value = event.target.value;
      html.find(".window-content").css("opacity", value);
    });

    // 내용 공유
    html.find("#shared-text").on("change", event => {
      const content = event.target.value;
      game.socket.emit("module.shared-window", { content });
    });

    // 더블 클릭으로 열고 닫기
    html.find(".window-header").on("dblclick", () => {
      this.element.toggleClass("collapsed");
    });
  }

  setContent(content) {
    this.element.find("#shared-text").val(content);
  }
}

Hooks.once("ready", () => {
  const win = new SharedWindow();
  win.render(true);

  game.socket.on("module.shared-window", data => {
    if (win.rendered) win.setContent(data.content);
  });
});