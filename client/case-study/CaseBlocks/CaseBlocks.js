/**
 * CaseBlocks — renders a project's narrative blocks as bento panels (SPEC §5, CONTRACT §4).
 * Async server component; returns a list of panels (render it inside the page's `.container.bento`).
 *
 * export default async function CaseBlocks({ slug, locale, startNumber })
 *   slug         project slug
 *   locale       "en" | "ar"
 *   startNumber  number of the first numbered eyebrow; default: 02 when the TL;DR panel shows, else 01
 *
 * Block types (projects.items.<slug>.blocks):
 *   text {id,title,body[]}            prose; the first paragraph is the lead
 *   list {id,title,intro,items[]}     intro + gold-marked points (two columns when long)
 *   cards {id,title,items[{title,body}]}               Services-style cards with gold icon tiles
 *   steps {id,title,items[{title,body}]}               timeline like the Experience panel
 *   decisions {id,title,items[{title,problem,decision,tradeoff,figure?}]}   Problem → Decision → Trade-off
 *   figure {figure}                   one screenshot with caption (unnumbered panel)
 *   gallery {id,title,figures[]}      thumbnails + <dialog> viewer (CaseGallery)
 *   metrics {id,title,items[{value,label}],body[]}    stat tiles styled like the hero stats glass card
 *   quote {text,cite}                 pull quote (unnumbered panel)
 * Unknown types and empty values render nothing. Titled blocks get "NN LABEL" eyebrows where LABEL is the
 * localized section name for the block id (case.sections.*) and the block title is the panel's <h2>.
 * Text-only blocks use a two-column layout on wide screens (heading | reading column ≤ 68ch).
 */
import { getTranslations } from 'next-intl/server';
import Panel from '../../ui/Panel/Panel';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Icon, { ICON_NAMES } from '../../ui/Icon/Icon';
import Reveal from '../../ui/Reveal/Reveal';
import cx from '../../ui/cx';
import CaseFigure from '../CaseFigure/CaseFigure';
import CaseGallery from '../CaseGallery/CaseGallery';
import { getCase, isArabicText } from '../caseContent';
import styles from './CaseBlocks.module.scss';

const KNOWN_ICONS = new Set(ICON_NAMES);
const CARD_ICON_BY_BLOCK = { users: 'user', roles: 'users', audience: 'users', features: 'layers', modules: 'layers' };
const METRIC_ICONS = ['gauge', 'chart', 'zap', 'layers'];
const SPLIT = new Set(['text', 'list', 'metrics']);

// Decision figures: half of a card inside the panel (card padding 24px).
const DECISION_FIGURE_SIZES =
  '(min-width: 1392px) 540px, (min-width: 1024px) calc((92vw - 180px) / 2), (min-width: 640px) calc(92vw - 100px), calc(100vw - 116px)';

const pad2 = (n) => String(n).padStart(2, '0');
const pickIcon = (name, fallback) => (name && KNOWN_ICONS.has(name) ? name : fallback);

/** Columns for a card grid: 1–4 cards side by side; 5, 6 and 9 in rows of three; otherwise rows of four. */
const cardColumns = (count) => (count <= 4 ? count : [5, 6, 9].includes(count) ? 3 : 4);

function BlockHeader({ block, headingId }) {
  if (!block.label) return null;
  if (block.heading) {
    return (
      <div className={styles.header}>
        <Eyebrow id={`${block.anchor}-label`} number={block.number} label={block.label} />
        <h2 id={headingId} className={styles.heading}>
          {block.heading}
        </h2>
      </div>
    );
  }
  return (
    <div className={styles.header}>
      <Eyebrow as="h2" id={headingId} number={block.number} label={block.label} />
    </div>
  );
}

function Prose({ paragraphs, lead = true }) {
  return paragraphs.map((paragraph, index) => (
    <p key={index} className={cx(styles.paragraph, lead && index === 0 && styles.lead)}>
      {paragraph}
    </p>
  ));
}

function TextBody({ block }) {
  return (
    <div className={styles.prose}>
      <Prose paragraphs={block.body} />
    </div>
  );
}

function ListBody({ block }) {
  return (
    <div className={styles.prose}>
      {block.intro ? <p className={cx(styles.paragraph, styles.lead)}>{block.intro}</p> : null}
      {block.items.length ? (
        <ul role="list" className={cx(styles.points, block.items.length > 4 && styles.pointsWide)}>
          {block.items.map((item, index) => (
            <li key={index} className={styles.point}>
              <span className={styles.pointMark} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CardsBody({ block }) {
  const fallback = CARD_ICON_BY_BLOCK[block.id] ?? 'sparkle';
  return (
    <ul role="list" className={styles.cards} style={{ '--cols': cardColumns(block.items.length) }}>
      {block.items.map((item, index) => (
        <Reveal as="li" key={index} delay={index * 60} className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.tile}>
              <Icon name={pickIcon(item.icon, fallback)} size={22} />
            </span>
            {item.title ? <h3 className={styles.cardTitle}>{item.title}</h3> : null}
          </div>
          {item.body ? <p className={styles.cardBody}>{item.body}</p> : null}
        </Reveal>
      ))}
    </ul>
  );
}

function StepsBody({ block }) {
  const count = block.items.length;
  const row = count >= 2 && count <= 5;
  return (
    <ol role="list" className={cx(styles.steps, row && styles.stepsRow)} style={{ '--cols': count }}>
      {block.items.map((item, index) => (
        <Reveal as="li" key={index} delay={index * 60} className={styles.step}>
          <span className={styles.stepDot} aria-hidden="true" />
          <span className={styles.stepNumber} aria-hidden="true">
            {pad2(index + 1)}
          </span>
          {item.title ? <h3 className={styles.stepTitle}>{item.title}</h3> : null}
          {item.body ? <p className={styles.stepBody}>{item.body}</p> : null}
        </Reveal>
      ))}
    </ol>
  );
}

function DecisionsBody({ block, slug, locale, labels }) {
  return (
    <ol role="list" className={styles.decisions}>
      {block.items.map((item, index) => {
        const flow = [
          { id: 'problem', text: item.problem },
          { id: 'decision', text: item.decision },
          { id: 'tradeoff', text: item.tradeoff },
        ].filter((step) => step.text && labels[step.id]);
        return (
          <Reveal as="li" key={index} delay={index * 60} className={cx(styles.decision, item.figure && styles.withFigure)}>
            <div className={styles.decisionText}>
              <div className={styles.decisionHead}>
                <span className={styles.decisionNumber} aria-hidden="true">
                  {pad2(index + 1)}
                </span>
                {item.title ? <h3 className={styles.decisionTitle}>{item.title}</h3> : null}
              </div>
              <dl className={cx(styles.flow, !item.figure && flow.length > 1 && styles.flowRow)}>
                {flow.map((step) => (
                  <div key={step.id} className={cx(styles.flowStep, styles[`flow-${step.id}`])}>
                    <dt className={styles.flowLabel}>{labels[step.id]}</dt>
                    <dd className={styles.flowText}>{step.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {item.figure ? (
              <CaseFigure
                slug={slug}
                locale={locale}
                figure={item.figure}
                layout="aside"
                sizes={DECISION_FIGURE_SIZES}
                className={styles.decisionFigure}
              />
            ) : null}
          </Reveal>
        );
      })}
    </ol>
  );
}

function MetricsBody({ block }) {
  const count = block.items.length;
  return (
    <div className={styles.prose}>
      {count ? (
        <ul role="list" className={styles.stats} style={{ '--cols': Math.min(count, 3) }}>
          {block.items.map((item, index) => (
            <li key={index} className={styles.stat}>
              <div className={styles.statHead}>
                <span className={styles.statTile}>
                  <Icon name={pickIcon(item.icon, METRIC_ICONS[index % METRIC_ICONS.length])} size={16} />
                </span>
                <bdi dir={isArabicText(item.value) ? undefined : 'ltr'} className={styles.statValue}>
                  {item.value}
                </bdi>
              </div>
              {item.label ? <p className={styles.statLabel}>{item.label}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {block.body.length ? (
        <div className={cx(count && styles.statsNote)}>
          <Prose paragraphs={block.body} lead={!count} />
        </div>
      ) : null}
    </div>
  );
}

function QuoteBody({ block }) {
  return (
    <figure className={styles.quote}>
      <Icon name="quote" size={30} className={styles.quoteMark} />
      <blockquote className={styles.quoteText}>
        <p>{block.text}</p>
      </blockquote>
      {block.cite ? <figcaption className={styles.quoteCite}>{block.cite}</figcaption> : null}
    </figure>
  );
}

export default async function CaseBlocks({ slug, locale, startNumber }) {
  const data = await getCase(slug, locale);
  if (!data?.blocks.length) return null;
  const t = await getTranslations({ locale, namespace: 'case' });
  const labels = Object.fromEntries(
    ['problem', 'decision', 'tradeoff'].map((id) => [id, t.has(`decision.${id}`) ? t(`decision.${id}`) : ''])
  );

  // An explicit startNumber re-numbers the eyebrows in order; otherwise the computed numbers stand.
  let counter = Number.isInteger(startNumber) ? startNumber : null;
  const blocks = data.blocks.map((block) => {
    if (counter === null || !block.number) return block;
    const number = pad2(counter);
    counter += 1;
    return { ...block, number };
  });

  return blocks.map((block) => {
    const headingId = block.label ? `${block.anchor}-title` : undefined;
    // The section is named by its eyebrow and its heading ("Context — Six roles, one patient journey"), so
    // two blocks with the same title still get distinct landmark names.
    const labelledBy = block.heading ? `${block.anchor}-label ${headingId}` : headingId;

    if (block.type === 'figure') {
      return (
        <Reveal key={block.anchor} className={styles.cell}>
          <Panel as="div" id={block.anchor} className={styles.figurePanel}>
            <CaseFigure slug={slug} locale={locale} figure={block.figure} />
          </Panel>
        </Reveal>
      );
    }

    if (block.type === 'quote') {
      return (
        <Reveal key={block.anchor} className={styles.cell}>
          <Panel as="div" id={block.anchor} glow className={styles.quotePanel}>
            <QuoteBody block={block} />
          </Panel>
        </Reveal>
      );
    }

    const split = SPLIT.has(block.type);
    let body = null;
    if (block.type === 'text') body = <TextBody block={block} />;
    else if (block.type === 'list') body = <ListBody block={block} />;
    else if (block.type === 'cards') body = <CardsBody block={block} />;
    else if (block.type === 'steps') body = <StepsBody block={block} />;
    else if (block.type === 'decisions') body = <DecisionsBody block={block} slug={slug} locale={locale} labels={labels} />;
    else if (block.type === 'metrics') body = <MetricsBody block={block} />;
    else if (block.type === 'gallery') {
      body = <CaseGallery slug={slug} figures={block.figures} locale={locale} title={block.heading || block.label || data.title} />;
    }
    if (!body) return null;

    const panel = (
      <Panel
        id={block.anchor}
        labelledBy={labelledBy}
        className={cx(split && block.label && styles.split, block.heading && styles.hasHeading)}
      >
        <BlockHeader block={block} headingId={headingId} />
        <div className={cx(styles.content, !block.label && styles.contentBare)}>{body}</div>
      </Panel>
    );

    // Grids reveal card by card; everything else fades up as one panel.
    const staggered = block.type === 'cards' || block.type === 'steps' || block.type === 'decisions';
    return staggered ? (
      <div key={block.anchor} className={styles.cell}>
        {panel}
      </div>
    ) : (
      <Reveal key={block.anchor} className={styles.cell}>
        {panel}
      </Reveal>
    );
  });
}
