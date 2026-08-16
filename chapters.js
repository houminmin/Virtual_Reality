// 各语言版本的配置。新增章节时，在对应语言的 files 数组末尾追加文件名。
// 章节标题会自动从每个 markdown 文件的第一行提取。
// 访问方式：中文版 index.html（默认），英文版 index.html?lang=en
const BOOKS = {
  zh: {
    title: "虚拟现实",
    dir: "chapters/",
    files: [
      "chapter_1.md",
      "chapter_2.md",
      "chapter_3.md",
      "chapter_4.md",
      "chapter_5.md",
      "chapter_6.md",
      "chapter_7.md",
      "chapter_8.md",
      "chapter_9.md",
      "chapter_10.md",
    ],
    labels: {
      subtitle: "目录",
      prev: "← 上一章",
      next: "下一章 →",
      home: "目录",
      loading: "加载中……",
      empty: "章节即将上线……",
      tocError: "目录加载失败：",
      chapterError: "章节加载失败：",
      badChapter: "无效的章节编号。",
    },
    switchName: "中文", // 在语言切换链接中显示的名称
  },
  en: {
    title: "Virtual Reality",
    dir: "chapters_en/",
    files: [
      "chapter_1.md",
      "chapter_2.md",
      "chapter_3.md",
      "chapter_4.md",
      "chapter_5.md",
      "chapter_6.md",
      "chapter_7.md",
      "chapter_8.md",
      "chapter_9.md",
      "chapter_10.md",
    ],
    labels: {
      subtitle: "Table of Contents",
      prev: "← Previous",
      next: "Next →",
      home: "Contents",
      loading: "Loading…",
      empty: "Chapters coming soon…",
      tocError: "Failed to load the table of contents: ",
      chapterError: "Failed to load the chapter: ",
      badChapter: "Invalid chapter number.",
    },
    switchName: "English",
  },
};

const DEFAULT_LANG = "zh";

function getLang() {
  const lang = new URLSearchParams(location.search).get("lang");
  return BOOKS[lang] ? lang : DEFAULT_LANG;
}

// 给站内链接附加语言参数（默认语言不加，保持原有链接形式）。
function withLang(url, lang) {
  if (lang === DEFAULT_LANG) return url;
  return url + (url.includes("?") ? "&" : "?") + "lang=" + lang;
}

// 在指定容器中生成语言切换链接（链到其他语言的目录页）。
function renderLangSwitch(container, currentLang) {
  for (const lang of Object.keys(BOOKS)) {
    if (lang === currentLang) continue;
    const a = document.createElement("a");
    a.href = withLang("index.html", lang);
    a.textContent = BOOKS[lang].switchName;
    container.appendChild(a);
  }
}

// 取 markdown 文本的第一个非空行作为标题（允许以 # 开头的写法）。
function extractTitle(mdText) {
  for (const line of mdText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed) return trimmed.replace(/^#+\s*/, "");
  }
  return "";
}

async function fetchChapter(book, filename) {
  const resp = await fetch(book.dir + encodeURIComponent(filename));
  if (!resp.ok) throw new Error(`${filename} (HTTP ${resp.status})`);
  return resp.text();
}
