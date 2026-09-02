import shopperImage from '../../assets/img/persona-shopper-night-market.jpg';
import vendorImage from '../../assets/img/persona-vendor-brass-workshop.jpg';
import organizerImage from '../../assets/img/persona-organizer-festoon-crowd.jpg';
import { useInView } from '../../hooks/useInView';
import { ArrowRightIcon } from '../icons';
import styles from './Personas.module.scss';

interface Persona {
  id: string;
  number: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  /** Row 02 places the photo first and the card second. */
  reversed: boolean;
}

const PERSONAS: readonly Persona[] = [
  {
    id: 'shopper',
    number: '01',
    title: 'Shopper',
    body: 'Discover unique bazaars, events, and independent fashion across Egypt.',
    image: shopperImage,
    alt: 'A woman browsing a rack of colourful garments at a lantern-lit night market',
    reversed: false,
  },
  {
    id: 'vendor',
    number: '02',
    title: 'Vendor',
    body: 'Showcase your brand, reach new customers, and grow your community.',
    image: vendorImage,
    alt: 'A craftsman working at a warm-lit brass and copper workshop stall',
    reversed: true,
  },
  {
    id: 'organizer',
    number: '03',
    title: 'Organizer',
    body: 'List your bazaar or event and connect with the right audience to bring your vision to life.',
    image: organizerImage,
    alt: 'A night crowd gathered under strings of warm festoon lights',
    reversed: false,
  },
];

/* Traced from the design reference: one continuous river that enters from the
   hero, S-curves down the left, bulges right to the 02 node, drops to the 03
   node and leaves at the bottom right towards "How Riven works". */
const FLOW_PATH =
  'M 512 -30 C 470 18, 398 18, 396 48 C 393 78, 410 86, 406 106 ' +
  'C 401 128, 372 128, 341 143 C 300 163, 252 152, 252 183 ' +
  'C 252 206, 268 213, 288 227 C 322 251, 360 263, 408 277 ' +
  'C 470 293, 520 289, 570 293 C 641 299, 716 301, 740 335 ' +
  'C 753 353, 728 369, 732 389 C 737 408, 790 401, 838 415 ' +
  'C 790 429, 742 435, 736 457 C 730 485, 706 493, 692 515 ' +
  'C 677 537, 654 541, 630 553 C 600 569, 564 620, 558 681 ' +
  'C 553 717, 610 727, 653 739 C 691 749, 726 773, 744 807 ' +
  'C 761 838, 790 858, 812 884';

/* Short connector that links the main river to the 01 node. */
const FLOW_STUB = 'M 348 145 C 380 152, 420 155, 455 157';

interface PersonaRowProps {
  persona: Persona;
  reversed: boolean;
}

function PersonaRow({ persona, reversed }: PersonaRowProps) {
  const card = (
    <div className={styles.card} key="card">
      <span className={styles.number}>{persona.number}</span>
      <h3 className={styles.cardTitle}>{persona.title}</h3>
      <p className={styles.cardBody}>{persona.body}</p>
      <a className={styles.learn} href={`#${persona.id}`}>
        Learn more
        <ArrowRightIcon className={styles.learnArrow} size={14} />
      </a>
    </div>
  );

  const photo = (
    <figure className={styles.photo} key="photo">
      <img className={styles.photoImg} src={persona.image} alt={persona.alt} />
      <span className={styles.photoVeil} aria-hidden="true" />
    </figure>
  );

  return <article className={styles.row}>{reversed ? [photo, card] : [card, photo]}</article>;
}

export default function Personas() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.08 });

  const pathClass = [styles.flowPath, inView ? styles.flowPathDrawn : ''].join(' ');
  const glowClass = [styles.flowGlow, inView ? styles.flowPathDrawn : ''].join(' ');
  const stubClass = [styles.flowStub, inView ? styles.flowPathDrawn : ''].join(' ');
  const nodesClass = [styles.nodes, inView ? styles.nodesVisible : ''].join(' ');

  return (
    <section className={styles.section} id="communities" ref={ref} aria-labelledby="personas-eyebrow">
      <svg
        className={styles.flow}
        viewBox="0 0 1440 860"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="personaLineGradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="860"
          >
            <stop offset="0%" className={styles.stopBlue} />
            <stop offset="24%" className={styles.stopPurple} />
            <stop offset="50%" className={styles.stopAccent} />
            <stop offset="100%" className={styles.stopAccent} />
          </linearGradient>
          <filter id="personaLineGlow" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <path
          className={glowClass}
          d={FLOW_PATH}
          fill="none"
          stroke="url(#personaLineGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#personaLineGlow)"
          opacity="0.55"
        />
        <path
          className={pathClass}
          d={FLOW_PATH}
          fill="none"
          stroke="url(#personaLineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className={stubClass}
          d={FLOW_STUB}
          fill="none"
          stroke="url(#personaLineGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        <g className={nodesClass}>
          <g className={styles.nodeBlue}>
            <circle cx="461" cy="157" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <circle cx="461" cy="157" r="12" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
            <circle cx="461" cy="157" r="6" fill="#ffffff" />
          </g>
          <g className={styles.nodeAccent}>
            <circle cx="838" cy="415" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <circle cx="838" cy="415" r="12" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
            <circle cx="838" cy="415" r="6" fill="#ffd9c7" />
          </g>
          <g className={styles.nodeAccent}>
            <circle cx="558" cy="681" r="20" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
            <circle cx="558" cy="681" r="12" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
            <circle cx="558" cy="681" r="6" fill="#ffd9c7" />
          </g>
        </g>
      </svg>

      <div className={styles.inner}>
        <p className={styles.eyebrow} id="personas-eyebrow">
          <span aria-hidden="true">—</span> A space for everyone
        </p>

        <div className={styles.rows}>
          {PERSONAS.map((persona) => (
            <PersonaRow key={persona.id} persona={persona} reversed={persona.reversed} />
          ))}
        </div>
      </div>
    </section>
  );
}
