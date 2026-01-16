// Flight Data Constants
export const FLIGHT_DATA = {
  flightNumber: 'GAB-23',
  route: {
    origin: 'CBA',
    originFull: 'Córdoba',
    destination: 'ALC',
    destinationFull: 'Alicante'
  },
  seat: '23A',
  gate: 'G23',
  passenger: 'Coty',
  operator: 'Gabriel',
  airline: 'Pipino Air',
  miles: 23,
  date: new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  time: new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
} as const;

// Assets URLs
export const ASSETS = {
  logo: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768402955/logo_pipino_bsdrh9.png',
  cotyPhoto: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768318063/IMG_5962_ysxoyc.jpg',
  prizes: [
    'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768255401/IMG_5907_oklxoz.png',
    'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768569151/premio_2_vjgu6t.jpg'
  ],
  dutyFreeProducts: [
    {
      id: 'argentina',
      label: 'Argentina',
      image: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768402955/2500753-1200-1200_ct8t9n.webp'
    },
    {
      id: 'river',
      label: 'River',
      image: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768402954/2247630-1200-1200_rzffx2.webp'
    },
    {
      id: 'cables',
      label: 'Kit de Cables',
      image: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768402955/D_NQ_NP_2X_822899-MLA89741422581_082025-F_acsjbm.webp'
    },
    {
      id: 'perfume',
      label: 'Perfume',
      image: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768443261/IMG_5968_dv3tff.jpg'
    },
    {
      id: 'iman',
      label: 'Imán',
      image: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768443261/IMG_5969_thuoxh.jpg'
    }
  ],
  parallaxVideo: 'https://res.cloudinary.com/dswpi1pb9/video/upload/v1768444325/Necesito_un_parallax_202601142330_dw7vw_zgukvg.mp4',
  flightAudio: 'https://res.cloudinary.com/dswpi1pb9/video/upload/v1768449461/Aeroplane_qjim7e.mp3',
  voucher: 'https://res.cloudinary.com/dswpi1pb9/image/upload/v1768569545/IMG_5971_zcyp5p.jpg',
  spotifyEmbed: 'https://open.spotify.com/embed/playlist/3T4IrOEIvAppKIHchwZDBO?utm_source=generator',
  spotifyLink: 'https://open.spotify.com/playlist/3T4IrOEIvAppKIHchwZDBO',
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=GAB-23|23A|G23|ALC'
} as const;

// Padlock codes (based on 19/04/81)
export const PADLOCK_CODES = {
  suitcase1: '190', // Day + first digit of month
  suitcase2: '481'  // Last digit of month + year
} as const;
