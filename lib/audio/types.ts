export type SfxType =
  | "typewriter"
  | "hint"
  | "click"
  | "plane"
  | "stamp"
  | "swoosh"
  | "defeat"
  | "losing"
  | "warning"
  | "opencasefile"
  | "arrest"
  | "winning"
  | "victory"
  | "slide"
  | "mechanickey"
  | "radio";

export interface SoundOptions {
  volume?: number;       // 0.0 to 1.0 multiplier for this play instance
  playbackRate?: number; // Pitch/speed variation (1.0 = normal)
  detune?: number;       // Detune in cents (-1200 to +1200)
}
