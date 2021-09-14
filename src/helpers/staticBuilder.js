/* eslint-disable no-use-before-define */
/* eslint-disable no-case-declarations */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
import React from 'react';
import { Link } from 'react-router-dom';
import arrayHelper from './array';
import Accordion from '../components/Accordion';
import Table from '../components/Table/Table';
import LinkExternal from '../components/LinkExternal';
import Bulma from '../components/Bulma';
import classnames from './classnames';

export const richTextBuilder = (elements, prefixKey = '') =>
  elements.map(({ type, ...props }, key) => {
    switch (type) {
      case 'break_line':
        return <br key={`${prefixKey}-${key}`} />;
      case 'bold':
        return <b key={`${prefixKey}-${key}`}>{props.content}</b>;
      case 'code':
        return (
          <code key={`${prefixKey}-${key}`} className={props.classNames}>
            {props.content}
          </code>
        );
      case 'italic':
        return <i key={`${prefixKey}-${key}`}>{props.content}</i>;
      case 'link_anchor':
        return (
          <a
            key={`${prefixKey}-${key}`}
            href={`#${props.selector}`}
            className="internal-link"
          >
            {props.text}
          </a>
        );
      case 'link_internal':
        return (
          <Link
            key={`${prefixKey}-${key}`}
            to={props.path}
            className="internal-link"
          >
            {props.text}
          </Link>
        );
      case 'link_external':
        return (
          <a
            key={`${prefixKey}-${key}`}
            href={props.path}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
          >
            {props.text}
          </a>
        );
      case 'link_mail':
        return (
          <a
            key={`${prefixKey}-${key}`}
            className="mail-link"
            href={`mailto:${props.email}`}
          >
            {props.text}
          </a>
        );
      case 'link_phone_number':
        return (
          <a key={`${prefixKey}-${key}`} href={`tel:${props.phoneNumber}`}>
            {props.text}
          </a>
        );
      case 'pre_code':
        return (
          <pre key={`${prefixKey}-${key}`}>
            <code className={props.classNames}>{props.content}</code>
          </pre>
        );
      case 'rich_text':
        return richTextBuilder(props.content, `${prefixKey}-${key}`);
      case 'text':
        return props.content;
      case 'underline':
        return <u key={`${prefixKey}-${key}`}>{props.content}</u>;
      default:
        return null;
    }
  });

const gridBuilder = ({ cols, content, fillRow }) => (
  <>
    {arrayHelper
      .chunked(content, cols, {
        fillChunk: fillRow,
        defaultItemFactory: () => ({ children: [] }),
      })
      .map((tiles) => (
        <Bulma.Tile kind="ancestor">
          {tiles.map(({ classNames, children }) => (
            <Bulma.Tile kind="parent">
              <Bulma.Tile kind={'child'} className={classnames(classNames)}>
                {staticBuilder(children)}
              </Bulma.Tile>
            </Bulma.Bulma.Tile>
          ))}
        </Bulma.Tile>
      ))}
  </>
);

const staticBuilder = (json, prefixKey = '') =>
  json.map(({ type, ...props }, key) => {
    switch (type) {
      case 'accordion':
        const elements = props.children.map(({ title, body }) => {
          let formattedBody = null;
          if (typeof body === 'string') formattedBody = body;
          if (Array.isArray(body))
            formattedBody = staticBuilder(body, `${prefixKey}-${key}`);
          return {
            title,
            body: formattedBody,
          };
        });
        return <Accordion key={`${prefixKey}-${key}`} elements={elements} />;
      case 'break_line':
        return (
          <>
            <br key={`${prefixKey}-${key}`} />
          </>
        );
      case 'bold':
        return (
          <p key={`${prefixKey}-${key}`} id={props.id}>
            <b>{props.content}</b>
          </p>
        );
      case 'card':
        const Component = () => (
          <div
            key={`${prefixKey}-${key}`}
            className={`card custom-card ${props.classNames || ''}`}
          >
            {props.image && (
              <div className="card-image">
                <figure
                  className={`image ${
                    props.imageClass ? props.imageClass : 'is-128x128'
                  }`}
                >
                  <img alt={props.image.alt} {...props.image} />
                </figure>
              </div>
            )}

            <div className="card-content">
              <p className="card-title">{props.title}</p>
              {props.description && (
                <p className="card-description">{props.description}</p>
              )}
              {props.richDescription && (
                <p className="card-description">
                  {richTextBuilder(props.richDescription)}
                </p>
              )}
            </div>
          </div>
        );
        if (props.linkType === 'internal')
          return (
            <Link to={props.link}>
              <Component />
            </Link>
          );
        if (props.linkType === 'external')
          return (
            <a href={props.link} target="_blank" rel="noopener noreferrer">
              <Component />
            </a>
          );
        return <Component />;
      case 'columns':
        return (
          <div
            key={`${prefixKey}-${key}`}
            className={`columns ${props.classNames || ''}`}
          >
            {props.content.map((col, colKey) => (
              <div
                key={`${prefixKey}-${key}-${colKey}`}
                className={`column ${col.size ? `is-${col.size}` : ''} ${
                  col.classNames || ''
                }`}
              >
                {staticBuilder(col.content, `${prefixKey}-${key}-${colKey}`)}
              </div>
            ))}
          </div>
        );
      case 'grid':
        return <div key={`${prefixKey}-${key}`}>{gridBuilder(props)}</div>;
      case 'link_anchor':
        return (
          <p key={`${prefixKey}-${key}`}>
            <a
              href={`#${props.selector}`}
              className={`internal-link ${props.classNames || ''}`}
            >
              {props.text}
            </a>
          </p>
        );
      case 'link_external':
        return (
          <LinkExternal
            key={`${prefixKey}-${key}`}
            to={props.path}
            text={props.text}
          />
        );
      case 'link_image':
        return (
          <a
            key={`${prefixKey}-${key}`}
            href={props.path}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={props.src} alt={props.alt} style={props.style} />
          </a>
        );
      case 'link_internal':
        return (
          <Link
            key={`${prefixKey}-${key}`}
            to={props.path}
            className="internal-link"
          >
            {props.text}
          </Link>
        );
      case 'notification':
        return (
          <div
            className={`notification ${props.classNames || ''}`}
            key={`${prefixKey}-${key}`}
          >
            {props.content}
          </div>
        );
      case 'ordered_list':
        return (
          <ol key={`${prefixKey}-${key}`} className="ordered">
            {props.children.map((element) => (
              <li>{staticBuilder([element])}</li>
            ))}
          </ol>
        );
      case 'pre_code':
        return (
          <pre key={`${prefixKey}-${key}`}>
            <code className={props.classNames}>{props.content}</code>
          </pre>
        );
      case 'rich_text':
        return (
          <p
            id={props.id}
            className={props.classNames}
            key={`${prefixKey}-${key}`}
          >
            {richTextBuilder(props.content, `${prefixKey}-${key}`)}
          </p>
        );
      case 'section':
        return (
          <div id={props.id} key={`${prefixKey}-${key}`}>
            <p className="title is-6 gradient-underline">{props.title}</p>
            <div className="static-section">
              {staticBuilder(props.children)}
            </div>
          </div>
        );
      case 'separator':
        return <div className="separator" key={`${prefixKey}-${key}`} />;
      case 'sub_title':
        return (
          <p
            id={props.id}
            className={`title is-6 ${props.classNames || ''}`}
            key={`${prefixKey}-${key}`}
          >
            {props.content}
          </p>
        );
      case 'table':
        return <Table key={`${prefixKey}-${key}`} {...props} />;
      case 'text':
        return (
          <p
            id={props.id}
            className={props.classNames}
            key={`${prefixKey}-${key}`}
          >
            {props.content}
          </p>
        );
      case 'title':
        return (
          <div
            className="content has-text-centered"
            key={`${prefixKey}-${key}`}
          >
            <p className={`title is-5 ${props.classNames || ''}`}>
              {props.content}
            </p>
          </div>
        );
      case 'unordered_list':
        return (
          <ul className="unordered" key={`${prefixKey}-${key}`}>
            {props.children.map((element, eKey) => (
              <li key={`${prefixKey}-${key}-${eKey}`}>
                {staticBuilder([element], `ul-${prefixKey}-${key}-${eKey}`)}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  });

export default staticBuilder;
