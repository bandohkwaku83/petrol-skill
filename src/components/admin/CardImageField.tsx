"use client";

import { useState, type DragEvent } from "react";

export function CardThumb({ src, compact = false }: { src: string; compact?: boolean }) {
  return (
    <div
      aria-hidden
      className={`bg-sand bg-cover bg-center ${compact ? "h-12 w-[4.4rem] shrink-0" : "aspect-[16/11] w-full"}`}
      style={imageStyle(src)}
    />
  );
}

export function CardImageField({
  value,
  onChange,
  hint = "This photo sits at the top of the card.",
}: {
  value: string;
  onChange: (image: string) => void;
  hint?: string;
}) {
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  async function take(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setMessage("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage("Use an image under 8 MB.");
      return;
    }
    try {
      onChange(await compressCardImage(file));
      setMessage("");
    } catch {
      setMessage("That image could not be read. Try another file.");
    }
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    void take(event.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-navy">Card image</p>
      <label
        className={`relative block cursor-pointer overflow-hidden border bg-[#F5F5F5] ${
          dragging ? "border-orange" : "border-dashed border-navy/20"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void take(file);
          }}
        />
        <span className="relative block aspect-[16/11]">
          {value ? (
            <span aria-hidden className="absolute inset-0 bg-cover bg-center" style={imageStyle(value)} />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">Upload</span>
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-navy">
                Card image
              </span>
              <span className="max-w-xs text-xs leading-relaxed text-muted">
                JPG, PNG, or WebP. Drop a file here, or click to choose one.
              </span>
            </span>
          )}
          {value ? (
            <span className="absolute inset-x-0 bottom-0 bg-navy/80 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white">
              Replace card image
            </span>
          ) : null}
        </span>
      </label>
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setMessage("");
          }}
          className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-orange"
        >
          Remove image
        </button>
      ) : null}
      {message ? (
        <p role="alert" className="mt-2 text-sm text-navy">
          {message}
        </p>
      ) : (
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>
      )}
    </div>
  );
}

function imageStyle(src: string) {
  if (!src) return undefined;
  return { backgroundImage: `url("${src.replace(/["\\\n\r]/g, "")}")` };
}

function compressCardImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const source = new Image();
      source.onload = () => {
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / source.width);
        const width = Math.max(1, Math.round(source.width * scale));
        const height = Math.max(1, Math.round(source.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("canvas"));
          return;
        }
        context.fillStyle = "#f5f5f5";
        context.fillRect(0, 0, width, height);
        context.drawImage(source, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      source.onerror = () => reject(new Error("image"));
      source.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
