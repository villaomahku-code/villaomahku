import React from "react";

export default function MistEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-screen">
      {/* Layer 1 - Bergerak lebih cepat */}
      <div
        className="animate-mist-1 absolute -inset-[50%]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      {/* Layer 2 - Bergerak berlawanan arah */}
      <div
        className="animate-mist-2 absolute -inset-[50%]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%)",
        }}
      />
      {/* Layer 3 - Kabut besar & sangat lambat */}
      <div
        className="animate-mist-3 absolute -inset-[100%]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 40%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)",
        }}
      />
    </div>
  );
}