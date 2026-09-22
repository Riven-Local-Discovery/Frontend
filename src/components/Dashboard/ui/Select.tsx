import { useEffect, useId, useRef, useState, type ComponentType } from 'react';
import { CheckIcon, ChevronDownIcon, type IconProps } from '../../icons';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  /** Drawn inside the trigger, left of the value. */
  icon?: ComponentType<IconProps>;
  /** The accessible name — there is no visible label on the pill variant. */
  label: string;
  /**
   * `pill` for filter bars and toolbars, `field` for dashboard forms,
   * `auth` for the dark sign-up screens, which use the global tokens rather
   * than the dashboard's light palette.
   */
  variant?: 'pill' | 'field' | 'auth';
  /** Shown, muted, while nothing is selected. */
  placeholder?: string;
  /** Paints the field red, for a failed validation rule. */
  invalid?: boolean;
  /** Lets a form's <label htmlFor> point at the trigger. */
  id?: string;
  /** Id of the element describing this field, usually its error message. */
  describedBy?: string;
}

/**
 * A listbox that replaces the native <select>.
 *
 * A native select's popup is drawn by the operating system: it ignores every
 * token in this file, so on Windows it renders as a grey system menu in the
 * middle of a warm, rounded dashboard. The trigger could be styled; the list
 * could not. This draws both.
 *
 * Keyboard behaviour follows the ARIA listbox pattern — focus stays on the
 * trigger and `aria-activedescendant` points at the highlighted option,
 * which is what lets arrow keys move through the list without the focus
 * ring jumping around the page.
 */
export default function Select({
  value,
  onChange,
  options,
  icon: Icon,
  label,
  variant = 'pill',
  placeholder,
  invalid = false,
  id,
  describedBy,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* useId emits colons, which aren't valid inside an id reference. */
  const baseId = `select-${useId().replace(/:/g, '')}`;
  const optionId = (index: number) => `${baseId}-opt-${index}`;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  /* Opening always starts on the current value, not wherever the highlight
     was left last time. */
  const openList = () => {
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  /* Keep the highlighted option in view when arrow keys walk past the edge
     of a list that's taller than its panel. */
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`#${CSS.escape(optionId(highlight))}`)
      ?.scrollIntoView({ block: 'nearest' });
  });

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openList();
        else setHighlight((current) => Math.min(current + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openList();
        else setHighlight((current) => Math.max(current - 1, 0));
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setHighlight(0);
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setHighlight(options.length - 1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) commit(highlight);
        else openList();
        break;
      case 'Escape':
        if (open) {
          /* Stop here so this doesn't also close the dialog the select is
             sitting in. */
          event.stopPropagation();
          setOpen(false);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${variant === 'pill' ? '' : styles.blockRoot}`}
    >
      <button
        id={id}
        type="button"
        className={`${styles.trigger} ${styles[variant]} ${invalid ? styles.invalid : ''} ${
          open ? styles.triggerOpen : ''
        }`}
        role="combobox"
        aria-controls={`${baseId}-list`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        {Icon && <Icon className={styles.leadIcon} size={variant === 'auth' ? 18 : 16} />}
        <span className={`${styles.value} ${selected ? '' : styles.placeholder}`}>
          {selected?.label ?? placeholder ?? label}
        </span>
        <ChevronDownIcon
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          size={14}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${baseId}-list`}
          className={`${styles.panel} ${variant === 'auth' ? styles.authPanel : ''}`}
          role="listbox"
          aria-label={label}
          aria-activedescendant={optionId(highlight)}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                className={`${styles.option} ${
                  index === highlight ? styles.optionActive : ''
                } ${isSelected ? styles.optionSelected : ''}`}
                /* mousedown, not click: the outside-click listener fires on
                   mousedown and would close the list first. */
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(index);
                }}
                onMouseEnter={() => setHighlight(index)}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                {isSelected && <CheckIcon className={styles.tick} size={13} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
