"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import type { Area } from "react-easy-crop";
import { Link2, Upload, ZoomIn, ZoomOut, RotateCw, Check, X, ImageIcon } from "lucide-react";

type Mode = "url" | "upload";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

/* ── crop helper — no crossOrigin so blob URLs work ───────────────────────── */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    // Do NOT set crossOrigin for blob URLs — it breaks local file loading
    if (!url.startsWith("blob:")) img.crossOrigin = "anonymous";
    img.src = url;
  });
}

const MAX_OUTPUT_WIDTH = 1200; // max output px — keeps files small regardless of source size

async function cropToBlob(src: string, crop: Area, rotation: number, quality = 0.88): Promise<Blob> {
  const image = await createImage(src);
  const rad   = (rotation * Math.PI) / 180;
  const sin   = Math.abs(Math.sin(rad));
  const cos   = Math.abs(Math.cos(rad));
  const bw    = image.width  * cos + image.height * sin;
  const bh    = image.width  * sin + image.height * cos;

  // Rotate full image onto a temp canvas
  const rotCanvas = document.createElement("canvas");
  rotCanvas.width  = bw;
  rotCanvas.height = bh;
  const rctx = rotCanvas.getContext("2d")!;
  rctx.translate(bw / 2, bh / 2);
  rctx.rotate(rad);
  rctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Scale crop to rotated canvas coordinates
  const scaleX   = bw / image.width;
  const scaleY   = bh / image.height;
  const srcW     = crop.width  * scaleX;
  const srcH     = crop.height * scaleY;

  // Limit output resolution so iPhone photos don't produce huge files
  const outW = Math.min(crop.width, MAX_OUTPUT_WIDTH);
  const outH = Math.round(outW * (srcH / srcW));

  const canvas = document.createElement("canvas");
  canvas.width  = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(rotCanvas, crop.x * scaleX, crop.y * scaleY, srcW, srcH, 0, 0, outW, outH);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("canvas empty")), "image/jpeg", quality)
  );
}

/* ── component ────────────────────────────────────────────────────────────── */
export default function ImageUploader({ value, onChange }: Props) {
  const [mode,        setMode]        = useState<Mode>(value ? "url" : "upload");
  const [urlInput,    setUrlInput]    = useState(value ?? "");
  const [rawSrc,      setRawSrc]      = useState<string | null>(null);
  const [crop,        setCrop]        = useState({ x: 0, y: 0 });
  const [zoom,        setZoom]        = useState(1);
  const [rotation,    setRotation]    = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [quality,     setQuality]     = useState(0.88);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedArea(pixels), []);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    const url = URL.createObjectURL(file);
    setRawSrc(url);
    setZoom(1); setRotation(0); setCrop({ x: 0, y: 0 });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    setUploadError("");
    setRawSrc(URL.createObjectURL(file));
  }

  async function confirmCrop() {
    if (!rawSrc || !croppedArea) return;
    setUploading(true);
    setUploadError("");
    try {
      const blob     = await cropToBlob(rawSrc, croppedArea, rotation, quality);
      const fd       = new FormData();
      fd.append("file", new File([blob], "menu.jpg", { type: "image/jpeg" }));
      const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `שגיאת שרת ${res.status}`);
      onChange(data.url);
      setRawSrc(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "שגיאה בהעלאה");
    } finally {
      setUploading(false);
    }
  }

  function cancelCrop() {
    setRawSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["url", "upload"] as Mode[]).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              mode === m ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
            }`}
          >
            {m === "url" ? <Link2 size={14} /> : <Upload size={14} />}
            {m === "url" ? "קישור URL" : "העלאה ממכשיר"}
          </button>
        ))}
      </div>

      {/* URL mode */}
      {mode === "url" && (
        <input type="url" value={urlInput} dir="ltr"
          onChange={(e) => { setUrlInput(e.target.value); onChange(e.target.value); }}
          placeholder="https://images.unsplash.com/..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      )}

      {/* Upload — drop zone */}
      {mode === "upload" && !rawSrc && (
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <ImageIcon size={32} className="mx-auto text-gray-300 group-hover:text-amber-400 mb-3 transition-colors" />
          <p className="text-sm font-semibold text-gray-600">גרור תמונה לכאן או לחץ לבחירה</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP עד 5MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
        </div>
      )}

      {/* Upload — crop UI */}
      {mode === "upload" && rawSrc && (
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          {/* Cropper */}
          <div style={{ position: "relative", height: "288px", background: "#111" }}>
            <Cropper
              image={rawSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 3}
              minZoom={0.1}
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { position: "absolute", inset: 0 },
                mediaStyle:     { maxHeight: "none" },
              }}
            />
          </div>

          {/* Controls */}
          <div className="bg-gray-800 px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <ZoomOut size={15} className="text-gray-400 flex-shrink-0" />
              <input type="range" min={0.1} max={3} step={0.05} value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-amber-400" />
              <ZoomIn size={15} className="text-gray-400 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-3">
              <RotateCw size={15} className="text-gray-400 flex-shrink-0" />
              <input type="range" min={-180} max={180} step={1} value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="flex-1 accent-amber-400" />
              <span className="text-gray-400 text-xs w-10 text-left flex-shrink-0">{rotation}°</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs flex-shrink-0">איכות</span>
              <input type="range" min={0.4} max={1} step={0.05} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="flex-1 accent-amber-400" />
              <span className="text-gray-400 text-xs w-10 text-left flex-shrink-0">{Math.round(quality * 100)}%</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={confirmCrop} disabled={uploading}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Check size={16} /> {uploading ? "מעלה..." : "אשר וקבע תמונה"}
              </button>
              <button type="button" onClick={cancelCrop}
                className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                <X size={16} /> ביטול
              </button>
            </div>
            {uploadError && <p className="text-red-400 text-xs text-center">{uploadError}</p>}
          </div>
        </div>
      )}

      {/* Success state */}
      {mode === "upload" && !rawSrc && value && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <img src={value} alt="" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-green-700">תמונה הועלתה בהצלחה</p>
            <p className="text-[10px] text-green-500 truncate" dir="ltr">{value}</p>
          </div>
          <button type="button" onClick={() => { onChange(""); if (fileRef.current) fileRef.current.value = ""; }}
            className="text-green-500 hover:text-red-500 transition-colors"
          ><X size={14} /></button>
        </div>
      )}
    </div>
  );
}
