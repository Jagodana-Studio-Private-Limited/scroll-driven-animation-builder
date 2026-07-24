"use client";

import { useState, useEffect, useRef, useId, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ToolEvents } from "@/lib/analytics";

// ---------- Types ----------

type AnimationProperty =
  | "opacity"
  | "scale"
  | "translateY"
  | "translateX"
  | "rotate"
  | "blur";

type RangeKeyword = "cover" | "contain" | "entry" | "exit" | "normal";

type EasingFn =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "cubic-bezier(0.42, 0, 1, 1)"
  | "cubic-bezier(0, 0, 0.58, 1)";

interface AnimConfig {
  property: AnimationProperty;
  fromValue: string;
  toValue: string;
  rangeStartKeyword: RangeKeyword;
  rangeStartPercent: number;
  rangeEndKeyword: RangeKeyword;
  rangeEndPercent: number;
  easing: EasingFn;
  animationName: string;
  axis: "y" | "x" | "block" | "inline";
}

// ---------- Constants ----------

const PROPERTY_OPTIONS: { value: AnimationProperty; label: string; unit: string; defaultFrom: string; defaultTo: string }[] = [
  { value: "opacity", label: "Opacity", unit: "", defaultFrom: "0", defaultTo: "1" },
  { value: "scale", label: "Scale (transform)", unit: "", defaultFrom: "0.5", defaultTo: "1" },
  { value: "translateY", label: "Translate Y (transform)", unit: "px", defaultFrom: "80", defaultTo: "0" },
  { value: "translateX", label: "Translate X (transform)", unit: "px", defaultFrom: "-80", defaultTo: "0" },
  { value: "rotate", label: "Rotate (transform)", unit: "deg", defaultFrom: "0", defaultTo: "360" },
  { value: "blur", label: "Blur (filter)", unit: "px", defaultFrom: "20", defaultTo: "0" },
];

const RANGE_KEYWORDS: RangeKeyword[] = ["cover", "contain", "entry", "exit", "normal"];

const EASING_OPTIONS: { value: EasingFn; label: string }[] = [
  { value: "linear", label: "linear" },
  { value: "ease-in", label: "ease-in" },
  { value: "ease-out", label: "ease-out" },
  { value: "ease-in-out", label: "ease-in-out" },
  { value: "cubic-bezier(0.42, 0, 1, 1)", label: "custom ease-in" },
  { value: "cubic-bezier(0, 0, 0.58, 1)", label: "custom ease-out" },
];

const AXIS_OPTIONS = [
  { value: "y" as const, label: "Y (vertical)" },
  { value: "x" as const, label: "X (horizontal)" },
  { value: "block" as const, label: "block" },
  { value: "inline" as const, label: "inline" },
];

// ---------- CSS generation ----------

function buildCSSValue(property: AnimationProperty, rawValue: string): string {
  const n = rawValue.trim();
  switch (property) {
    case "opacity": return n;
    case "scale": return `scale(${n})`;
    case "translateY": return `translateY(${n}px)`;
    case "translateX": return `translateX(${n}px)`;
    case "rotate": return `rotate(${n}deg)`;
    case "blur": return `blur(${n}px)`;
  }
}

function getCSSProp(property: AnimationProperty): string {
  if (property === "opacity") return "opacity";
  if (property === "blur") return "filter";
  return "transform";
}

function generateKeyframes(cfg: AnimConfig, kfName: string): string {
  const prop = getCSSProp(cfg.property);
  const from = buildCSSValue(cfg.property, cfg.fromValue);
  const to = buildCSSValue(cfg.property, cfg.toValue);
  return `@keyframes ${kfName} {
  from { ${prop}: ${from}; }
  to   { ${prop}: ${to}; }
}`;
}

function generateAnimationRule(cfg: AnimConfig, kfName: string, selector: string): string {
  const rangeStart =
    cfg.rangeStartKeyword === "normal"
      ? "normal"
      : `${cfg.rangeStartKeyword} ${cfg.rangeStartPercent}%`;
  const rangeEnd =
    cfg.rangeEndKeyword === "normal"
      ? "normal"
      : `${cfg.rangeEndKeyword} ${cfg.rangeEndPercent}%`;

  return `${selector} {
  animation: ${kfName} ${cfg.easing} both;
  animation-timeline: scroll(${cfg.axis});
  animation-range: ${rangeStart} ${rangeEnd};
}`;
}

function generateFullCSS(cfg: AnimConfig): string {
  const kfName = cfg.animationName || "scroll-anim";
  const kf = generateKeyframes(cfg, kfName);
  const rule = generateAnimationRule(cfg, kfName, ".animated-element");
  return [kf, "", rule].join("\n");
}

// ---------- Default state ----------

const DEFAULT_CONFIG: AnimConfig = {
  property: "opacity",
  fromValue: "0",
  toValue: "1",
  rangeStartKeyword: "cover",
  rangeStartPercent: 20,
  rangeEndKeyword: "cover",
  rangeEndPercent: 80,
  easing: "linear",
  animationName: "scroll-anim",
  axis: "y",
};

// ---------- Component ----------

export function ScrollDrivenAnimationBuilderTool() {
  const [config, setConfig] = useState<AnimConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const uid = useId().replace(/:/g, "");
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const animClass = `sda-el-${uid}`;
  const scrollerClass = `sda-scroll-${uid}`;

  // Inject or update the <style> tag whenever config changes
  useEffect(() => {
    const kfName = `${config.animationName || "scroll-anim"}-${uid}`;

    const rangeStart =
      config.rangeStartKeyword === "normal"
        ? "normal"
        : `${config.rangeStartKeyword} ${config.rangeStartPercent}%`;
    const rangeEnd =
      config.rangeEndKeyword === "normal"
        ? "normal"
        : `${config.rangeEndKeyword} ${config.rangeEndPercent}%`;

    const prop = getCSSProp(config.property);
    const from = buildCSSValue(config.property, config.fromValue);
    const to = buildCSSValue(config.property, config.toValue);

    const css = `
@keyframes ${kfName} {
  from { ${prop}: ${from}; }
  to   { ${prop}: ${to}; }
}
.${animClass} {
  animation: ${kfName} ${config.easing} both;
  animation-timeline: scroll(${config.axis} nearest);
  animation-range: ${rangeStart} ${rangeEnd};
}
.${scrollerClass} {
  overflow-y: scroll;
  scroll-timeline-name: --scroll-${uid};
}
    `.trim();

    if (!styleRef.current) {
      const el = document.createElement("style");
      el.setAttribute("data-sda-uid", uid);
      document.head.appendChild(el);
      styleRef.current = el;
    }
    styleRef.current.textContent = css;

    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, uid, animClass, scrollerClass]);

  const update = useCallback(<K extends keyof AnimConfig>(key: K, value: AnimConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    ToolEvents.toolUsed("config-change");
  }, []);

  const handlePropertyChange = useCallback((prop: AnimationProperty) => {
    const opt = PROPERTY_OPTIONS.find((o) => o.value === prop)!;
    setConfig((prev) => ({
      ...prev,
      property: prop,
      fromValue: opt.defaultFrom,
      toValue: opt.defaultTo,
    }));
  }, []);

  const handleCopy = useCallback(async () => {
    const css = generateFullCSS(config);
    await navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success("CSS copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [config]);

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    toast.success("Reset to defaults");
  }, []);

  const propertyOption = PROPERTY_OPTIONS.find((o) => o.value === config.property)!;
  const generatedCSS = generateFullCSS(config);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ---- Controls Panel ---- */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Animation Settings</h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Reset to defaults"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Animation Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Animation name</label>
            <input
              type="text"
              value={config.animationName}
              onChange={(e) => update("animationName", e.target.value.replace(/\s+/g, "-") || "scroll-anim")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="scroll-anim"
              aria-label="Animation name"
            />
          </div>

          {/* Animated Property */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Animated property</label>
            <select
              value={config.property}
              onChange={(e) => handlePropertyChange(e.target.value as AnimationProperty)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              aria-label="Animated property"
            >
              {PROPERTY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* From / To Values */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                from{propertyOption.unit ? ` (${propertyOption.unit})` : ""}
              </label>
              <input
                type="text"
                value={config.fromValue}
                onChange={(e) => update("fromValue", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/40"
                aria-label="From value"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                to{propertyOption.unit ? ` (${propertyOption.unit})` : ""}
              </label>
              <input
                type="text"
                value={config.toValue}
                onChange={(e) => update("toValue", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/40"
                aria-label="To value"
              />
            </div>
          </div>

          {/* animation-range start */}
          <div className="space-y-2">
            <label className="text-sm font-medium">animation-range start</label>
            <div className="flex gap-2">
              <select
                value={config.rangeStartKeyword}
                onChange={(e) => update("rangeStartKeyword", e.target.value as RangeKeyword)}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                aria-label="Range start keyword"
              >
                {RANGE_KEYWORDS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              {config.rangeStartKeyword !== "normal" && (
                <div className="flex items-center gap-1.5 min-w-[90px]">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={config.rangeStartPercent}
                    onChange={(e) => update("rangeStartPercent", Number(e.target.value))}
                    className="w-full accent-brand"
                    aria-label="Range start percent"
                  />
                  <span className="text-sm font-mono w-8 text-right shrink-0">{config.rangeStartPercent}%</span>
                </div>
              )}
            </div>
          </div>

          {/* animation-range end */}
          <div className="space-y-2">
            <label className="text-sm font-medium">animation-range end</label>
            <div className="flex gap-2">
              <select
                value={config.rangeEndKeyword}
                onChange={(e) => update("rangeEndKeyword", e.target.value as RangeKeyword)}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                aria-label="Range end keyword"
              >
                {RANGE_KEYWORDS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              {config.rangeEndKeyword !== "normal" && (
                <div className="flex items-center gap-1.5 min-w-[90px]">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={config.rangeEndPercent}
                    onChange={(e) => update("rangeEndPercent", Number(e.target.value))}
                    className="w-full accent-brand"
                    aria-label="Range end percent"
                  />
                  <span className="text-sm font-mono w-8 text-right shrink-0">{config.rangeEndPercent}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Easing */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Easing function</label>
            <select
              value={config.easing}
              onChange={(e) => update("easing", e.target.value as EasingFn)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/40"
              aria-label="Easing function"
            >
              {EASING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label} — {o.value}</option>
              ))}
            </select>
          </div>

          {/* Scroll axis */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scroll axis</label>
            <div className="flex gap-2 flex-wrap">
              {AXIS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update("axis", opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    config.axis === opt.value
                      ? "bg-brand text-white border-brand"
                      : "border-border text-muted-foreground hover:border-brand/50"
                  }`}
                  aria-label={`Scroll axis ${opt.label}`}
                  aria-pressed={config.axis === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Preview + Code Panel ---- */}
        <div className="space-y-4">
          {/* Preview Box */}
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Scroll inside the box ↓
              </span>
            </div>

            {/* Scrollable container */}
            <div
              ref={scrollerRef}
              className={`${scrollerClass} relative rounded-xl bg-muted/30 border border-dashed border-border`}
              style={{ height: 320, overflowY: "scroll" }}
            >
              {/* Top spacer with instruction */}
              <div className="h-32 flex items-end justify-center pb-3">
                <p className="text-xs text-muted-foreground select-none">↓ scroll to see animation ↓</p>
              </div>

              {/* Animated element */}
              <div className="flex items-center justify-center py-6">
                <div
                  className={`${animClass} rounded-xl px-8 py-5 text-center font-semibold text-white shadow-lg`}
                  style={{ background: "linear-gradient(135deg, var(--brand), var(--brand-accent))", minWidth: 180 }}
                >
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-sm">Animated Element</div>
                </div>
              </div>

              {/* Bottom spacer */}
              <div className="h-32 flex items-start justify-center pt-3">
                <p className="text-xs text-muted-foreground select-none">↑ scroll up to reverse ↑</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              Requires Chrome 115+ / Edge 115+ for scroll-driven animations
            </p>
          </div>

          {/* Generated CSS */}
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Generated CSS</h2>
              <Button
                size="sm"
                onClick={handleCopy}
                variant="outline"
                className="gap-1.5 h-8 text-xs"
                aria-label="Copy CSS to clipboard"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy CSS"}
              </Button>
            </div>
            <pre className="rounded-xl bg-muted/50 p-4 text-xs font-mono overflow-x-auto leading-relaxed text-foreground/80 whitespace-pre-wrap break-all">
              {generatedCSS}
            </pre>
          </div>

          {/* Tip box */}
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-brand">Tip:</span> Add{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-brand-accent text-[11px]">will-change: transform</code>{" "}
              or{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-brand-accent text-[11px]">will-change: opacity</code>{" "}
              on the animated element for smoother performance on composited layers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
