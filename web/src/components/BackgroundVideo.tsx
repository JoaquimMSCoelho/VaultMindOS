export default function BackgroundVideo() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden bg-slate-200">
       {/* 1. O VÍDEO (Daylight / Bright Office) 
           Opacidade 100% (sem escurecer)
       */}
       <video
         autoPlay
         loop
         muted
         playsInline
         className="absolute top-0 left-0 w-full h-full object-cover"
       >
         {/* Vídeo: Ambiente de escritório moderno, claro, luz do dia e vidro */}
         <source 
           src="https://videos.pexels.com/video-files/3252475/3252475-hd_1920_1080_25fps.mp4" 
           type="video/mp4" 
         />
       </video>

       {/* 2. O OVERLAY (Suave e Azulado) 
           Em vez de preto, usamos um Cyan Escuro com pouca opacidade (30%).
           Isso 'esfria' a luz do sol do vídeo para combinar com o VaultMind,
           mas mantém o fundo claro o suficiente para os cards pretos se destacarem.
       */}
       <div className="absolute top-0 left-0 w-full h-full bg-cyan-900/30 backdrop-blur-[2px]"></div>
    </div>
  )
}
