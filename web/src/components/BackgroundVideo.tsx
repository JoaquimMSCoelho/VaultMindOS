export default function BackgroundVideo() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden bg-[#050A14]">
       {/* VÍDEO: Terra Girando (Tech Global) */}
       <video
         autoPlay
         loop
         muted
         playsInline
         className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
       >
         <source 
           src="https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4" 
           type="video/mp4" 
         />
       </video>

       {/* CAMADA DE PROTEÇÃO (CRUCIAL):
           Azul Quase Preto com 85% de opacidade.
           Isso garante que o fundo seja 'atmosférico' e não atrapalhe a leitura.
       */}
       <div className="absolute top-0 left-0 w-full h-full bg-[#050A14]/85 backdrop-blur-[2px]"></div>
       
       {/* Vignette: Bordas mais escuras para focar a visão no centro */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80"></div>
    </div>
  )
}
