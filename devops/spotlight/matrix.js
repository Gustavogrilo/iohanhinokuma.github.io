(function matrixRain() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '9999',
    pointerEvents: 'none',
    opacity:       '0.18',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Mix of katakana + hex + terminal/DevOps symbols
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFabcdef<>{}[]|/\\=+-*$#@!~:;_';
  const FS    = 13;   // font size px
  const FPS   = 20;   // target frames per second

  let cols, drops, speeds;
  let last = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const next = Math.floor(canvas.width / FS);

    if (!drops) {
      // First init: spread drops randomly across the full height
      drops  = Array.from({ length: next }, () => Math.random() * (canvas.height / FS));
      speeds = Array.from({ length: next }, () => 0.3 + Math.random() * 0.7);
    } else if (next > cols) {
      // Screen got wider: add new columns
      for (let i = cols; i < next; i++) {
        drops.push(Math.random() * (canvas.height / FS));
        speeds.push(0.3 + Math.random() * 0.7);
      }
    } else {
      drops.length  = next;
      speeds.length = next;
    }
    cols = next;
  }

  function tick(ts) {
    requestAnimationFrame(tick);
    if (ts - last < 1000 / FPS) return;
    last = ts;

    // Fade trail by painting semi-transparent black over the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font      = `${FS}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';

    for (let i = 0; i < cols; i++) {
      const x    = i * FS + FS / 2;
      const y    = drops[i] * FS;
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      // Head: bright near-white green
      ctx.fillStyle = '#ccffcc';
      ctx.fillText(char, x, y);

      // One step behind: full green
      ctx.fillStyle = '#00ff41';
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - FS);

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += speeds[i];
    }
  }

  document.fonts.ready.then(() => {
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
  });
})();
