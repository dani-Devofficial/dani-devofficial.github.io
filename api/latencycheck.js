<script>
(() => {
    const originalFetch = window.fetch;

    const info = {
        url: "-",
        latency: "-",
        status: "대기 중"
    };

    // 표시창
    const box = document.createElement("div");
    Object.assign(box.style, {
        position: "fixed",
        right: "10px",
        bottom: "10px",
        background: "rgba(0,0,0,.8)",
        color: "#0f0",
        padding: "8px 10px",
        borderRadius: "6px",
        font: "12px monospace",
        zIndex: 999999,
        whiteSpace: "pre"
    });
    document.body.appendChild(box);

    function updateBox() {
        box.textContent =
`최근 Fetch
URL : ${info.url}
Ping: ${info.latency}
상태: ${info.status}`;
    }

    setInterval(updateBox, 100);

    // fetch 후킹
    window.fetch = async function (...args) {
        const url = typeof args[0] === "string"
            ? args[0]
            : args[0].url;

        const start = performance.now();

        try {
            const response = await originalFetch.apply(this, args);

            info.url = url;
            info.latency = `${Math.round(performance.now() - start)} ms`;
            info.status = response.status;

            return response;
        } catch (e) {
            info.url = url;
            info.latency = `${Math.round(performance.now() - start)} ms`;
            info.status = "Error";
            throw e;
        }
    };
})();
</script>
