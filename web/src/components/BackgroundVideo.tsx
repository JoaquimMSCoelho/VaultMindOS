export default function BackgroundVideo() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden">
       {/* 1. O VÍDEO 
          Link direto de um vídeo Tech do Pexels (Pessoas trabalhando/Coding)
       */}
       <video
         autoPlay
         loop
         muted
         playsInline
         className="absolute top-0 left-0 w-full h-full object-cover opacity-40" // Opacidade 40% para não brigar com o texto
       >
         <source 
           src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4" 
           type="video/mp4" 
         />
       </video>

       {/* 2. O OVERLAY (A Película Protetora)
          Um gradiente azul escuro para garantir que o texto branco fique legível
          e para dar o tom "Cyberpunk/Enterprise" do VaultMind.
       */}
       <div className="absolute top-0 left-0 w-full h-full bg-[#050A14]/90 backdrop-blur-[2px]"></div>
    </div>
  )
}
