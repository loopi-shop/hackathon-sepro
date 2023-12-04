import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChartLine,
  faWallet,
  faAddressBook,
  faPlusSquare,
  faStore
} from '@fortawesome/free-solid-svg-icons';
import {
  faDiscord,
  faTelegram,
  faXTwitter,
  faInstagram,
  faLinkedin,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { RoleEnum } from '../../contexts/auth-context';

export const items = [
  {
    title: 'Início',
    path: '/',
    icon: <FontAwesomeIcon icon={faHome} />
  },
  {
    title: 'Clientes',
    path: '/clientes',
    roles: [RoleEnum.ADMIN],
    icon: <FontAwesomeIcon icon={faAddressBook} />
  },
  {
    title: 'Títulos',
    path: '/titulo',
    icon: <FontAwesomeIcon icon={faChartLine} />
  },
  {
    title: 'Cadastrar Título',
    path: '/titulo/criar',
    roles: [RoleEnum.ADMIN],
    icon: <FontAwesomeIcon icon={faPlusSquare} />
  },
  {
    title: 'Minha carteira',
    path: '/carteira',
    icon: <FontAwesomeIcon icon={faWallet} />
  },
  {
    title: 'Mercado secundário',
    path: '/mercado-secundario',
    roles: [RoleEnum.COMMON],
    icon: <FontAwesomeIcon icon={faStore} />
  }
];

export const social = [
  { href: 'https://discord.gg/loopipay', icon: <FontAwesomeIcon icon={faDiscord} size="lg" /> },
  { href: 'https://t.me/loopipay', icon: <FontAwesomeIcon icon={faTelegram} size="lg" /> },
  { href: 'https://twitter.com/loopipay', icon: <FontAwesomeIcon icon={faXTwitter} size="lg" /> },
  {
    href: 'https://instagram.com/loopipay',
    icon: <FontAwesomeIcon icon={faInstagram} size="lg" />
  },
  {
    href: 'https://www.youtube.com/channel/UCoTiWle-Oht_4LDfSYeapSg',
    icon: <FontAwesomeIcon icon={faYoutube} size="lg" />
  },
  {
    href: 'https://www.linkedin.com/company/loopiapp',
    icon: <FontAwesomeIcon icon={faLinkedin} size="lg" />
  }
];
