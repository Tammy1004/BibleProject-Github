(function () {
  const groups = window.BIBLEPROJECT_VIDEOS || [];
  const library = document.querySelector("#video-library");
  const search = document.querySelector("#search");
  const player = document.querySelector("#main-player");
  const expandAll = document.querySelector("#expand-all");
  const collapseAll = document.querySelector("#collapse-all");
  const videoBase = window.VIDEO_BASE_URL || "";

  function videoSrc(path) {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    return videoBase ? `${videoBase}${encodedPath}` : encodedPath;
  }

  function makeVideoItem(video, index, groupTitle) {
    const item = document.createElement("div");
    item.className = "video-item";
    item.dataset.title = `${video.title} ${groupTitle}`.toLowerCase();

    const number = document.createElement("span");
    number.className = "number";
    number.textContent = String(index + 1).padStart(2, "0");

    const title = document.createElement("span");
    title.className = "video-title";
    title.textContent = video.title;

    const button = document.createElement("button");
    button.className = "play-button";
    button.type = "button";
    button.setAttribute("aria-label", video.available ? `播放：${video.title}` : `缺少文件：${video.title}`);
    button.title = video.available ? "播放" : "缺少文件";
    button.innerHTML = video.available
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>'
      : '<span aria-hidden="true">-</span>';
    button.disabled = !video.available;
    button.addEventListener("click", () => {
      player.src = videoSrc(video.path);
      player.load();
      player.play().catch(() => {});
      document.querySelector("#player").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    item.append(number, title, button);
    return item;
  }

  function render() {
    library.innerHTML = "";
    groups.forEach((group, groupIndex) => {
      const details = document.createElement("details");
      details.className = "group";
      details.open = groupIndex === 0;

      const summary = document.createElement("summary");
      const title = document.createElement("h3");
      title.className = "group-title";
      title.textContent = group.title;

      const count = document.createElement("span");
      count.className = "count";
      count.textContent = `${group.videos.length} 个视频`;

      const chevron = document.createElement("span");
      chevron.className = "chevron";
      chevron.textContent = "⌄";
      chevron.setAttribute("aria-hidden", "true");

      summary.append(title, count, chevron);

      const list = document.createElement("div");
      list.className = "video-list";
      group.videos.forEach((video, index) => {
        list.append(makeVideoItem(video, index, group.title));
      });

      details.append(summary, list);
      library.append(details);
    });
  }

  function applySearch() {
    const term = search.value.trim().toLowerCase();
    let visibleItems = 0;
    document.querySelectorAll(".group").forEach((group) => {
      let visibleInGroup = 0;
      group.querySelectorAll(".video-item").forEach((item) => {
        const match = !term || item.dataset.title.includes(term);
        item.classList.toggle("hidden", !match);
        if (match) visibleInGroup += 1;
      });
      group.classList.toggle("hidden", visibleInGroup === 0);
      if (term && visibleInGroup > 0) group.open = true;
      visibleItems += visibleInGroup;
    });

    let empty = document.querySelector(".empty");
    if (!empty) {
      empty = document.createElement("p");
      empty.className = "empty hidden";
      empty.textContent = "没有找到匹配的视频。";
      library.append(empty);
    }
    empty.classList.toggle("hidden", visibleItems !== 0);
  }

  render();
  search.addEventListener("input", applySearch);
  expandAll.addEventListener("click", () => {
    document.querySelectorAll(".group").forEach((group) => {
      group.open = true;
    });
  });
  collapseAll.addEventListener("click", () => {
    document.querySelectorAll(".group").forEach((group) => {
      group.open = false;
    });
  });
})();
