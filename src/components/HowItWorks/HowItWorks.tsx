import type { ComponentType } from 'react';
import { useInView } from '../../hooks/useInView';
import { HeartIcon, PeopleIcon, SearchIcon } from '../icons';
import type { IconProps } from '../icons';
import styles from './HowItWorks.module.scss';

type StepTone = 'blue' | 'indigo' | 'accent';

interface Step {
  id: string;
  Icon: ComponentType<IconProps>;
  title: string;
  body: string;
  tone: StepTone;
  /** Discover carries the glowing dot where the flow line touches its circle. */
  hasLineDot: boolean;
}

const STEPS: readonly Step[] = [
  {
    id: 'discover',
    Icon: SearchIcon,
    title: 'Discover',
    body: 'Find bazaars, events, and brands that inspire you.',
    tone: 'blue',
    hasLineDot: true,
  },
  {
    id: 'connect',
    Icon: PeopleIcon,
    title: 'Connect',
    body: 'Reach out, follow, and build real relationships.',
    tone: 'indigo',
    hasLineDot: false,
  },
  {
    id: 'belong',
    Icon: HeartIcon,
    title: 'Belong',
    body: 'Be part of a community that celebrates creativity and culture.',
    tone: 'accent',
    hasLineDot: false,
  },
];

/* Traced from the design: the river arrives from the personas section and
   terminates on the Belong circle. */
const FLOW_PATH = 'M 700 -60 C 730 -14, 760 18, 812 44 C 866 70, 900 62, 936 78';

const TONE_CLASS: Record<StepTone, string> = {
  blue: styles.circleBlue,
  indigo: styles.circleIndigo,
  accent: styles.circleAccent,
};

export default function HowItWorks() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.25 });

  const pathClass = [styles.flowPath, inView ? styles.flowPathDrawn : ''].join(' ');
  const glowClass = [styles.flowGlow, inView ? styles.flowPathDrawn : ''].join(' ');

  return (
    <section className={styles.section} id="explore" ref={ref} aria-labelledby="how-eyebrow">
      <span className={styles.ghost} aria-hidden="true">
        03
      </span>

      <svg
        className={styles.flow}
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="howLineGradient"
            gradientUnits="userSpaceOnUse"
            x1="700"
            y1="0"
            x2="960"
            y2="130"
          >
            <stop offset="0%" className={styles.stopAccentSoft} />
            <stop offset="100%" className={styles.stopAccent} />
          </linearGradient>
          <filter id="howLineGlow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <path
          className={glowClass}
          d={FLOW_PATH}
          fill="none"
          stroke="url(#howLineGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#howLineGlow)"
          opacity="0.55"
        />
        <path
          className={pathClass}
          d={FLOW_PATH}
          fill="none"
          stroke="url(#howLineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className={styles.inner}>
        <p className={styles.eyebrow} id="how-eyebrow">
          <span aria-hidden="true">—</span> How Riven works
        </p>

        <ul className={styles.steps}>
          {STEPS.map(({ id, Icon, title, body, tone, hasLineDot }) => (
            <li className={styles.step} key={id}>
              <span className={[styles.circle, TONE_CLASS[tone]].join(' ')} aria-hidden="true">
                <Icon size={24} />
                {hasLineDot && <span className={styles.lineDot} />}
              </span>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepBody}>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <svg
        className={styles.wave}
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M 0 18 C 320 44, 700 78, 1000 104 C 1180 120, 1320 130, 1440 134"
          fill="none"
          stroke="rgba(150, 185, 255, 0.3)"
          strokeWidth="1"
        />
        <path
          d="M 0 40 C 300 62, 660 96, 980 122 C 1170 138, 1320 146, 1440 150"
          fill="none"
          stroke="rgba(255, 138, 82, 0.14)"
          strokeWidth="1"
        />
      </svg>
    </section>
  );
}
