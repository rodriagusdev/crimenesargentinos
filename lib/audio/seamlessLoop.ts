/**
 * Genera un buffer de lluvia 100% libre de saltos o pausas mediante equal-power crossfading.
 * La cola del audio se funde con la cabeza, eliminando cualquier discontinuidad al loopear.
 * Devuelve el mismo buffer si es demasiado corto para el crossfade.
 */
export function createSeamlessLoopBuffer(ctx: AudioContext, src: AudioBuffer): AudioBuffer {
  const numChannels = src.numberOfChannels;
  const channelData = Array.from({ length: numChannels }, (_, c) => src.getChannelData(c));
  const len = src.length;

  let start = 0;
  while (start < len - 1 && channelData.every((d) => Math.abs(d[start]) < 0.0005)) {
    start++;
  }

  let end = len;
  while (end > start + 1 && channelData.every((d) => Math.abs(d[end - 1]) < 0.0005)) {
    end--;
  }

  const activeLen = end - start;
  const crossfadeLen = Math.min(Math.floor(src.sampleRate * 0.5), Math.floor(activeLen * 0.25));

  if (crossfadeLen <= 0 || activeLen <= crossfadeLen * 2) {
    return src;
  }

  const loopLen = activeLen - crossfadeLen;
  const out = ctx.createBuffer(numChannels, loopLen, src.sampleRate);

  for (let c = 0; c < numChannels; c++) {
    const srcData = channelData[c];
    const outData = out.getChannelData(c);

    // Funde la cola con el inicio para continuidad matemática perfecta
    for (let i = 0; i < crossfadeLen; i++) {
      const t = i / crossfadeLen;
      const fadeIn = Math.sin(t * Math.PI * 0.5);
      const fadeOut = Math.cos(t * Math.PI * 0.5);

      const headSample = srcData[start + i];
      const tailSample = srcData[start + loopLen + i];

      outData[i] = headSample * fadeIn + tailSample * fadeOut;
    }

    // Cuerpo del audio
    for (let i = crossfadeLen; i < loopLen; i++) {
      outData[i] = srcData[start + i];
    }
  }

  return out;
}
