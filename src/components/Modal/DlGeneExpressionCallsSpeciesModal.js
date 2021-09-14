import React from 'react';
import { Link } from 'react-router-dom';
import PATHS from '../../routes/paths';
import i18n from '../../i18n';
import LINK_ANCHOR from '../../routes/linkAnchor';
import Bulma from '../Bulma';

const DlGeneExpressionCallsSpeciesModal = ({ selectedSpecies }) => (
  <Bulma.Modal.Content as="div" className="box">
    <Bulma.Media>
      <Bulma.Media.Item className="my-auto">
        <p className="title">
          {selectedSpecies
            ? `${selectedSpecies.scientificName} (${selectedSpecies.name})`
            : null}
        </p>
      </Bulma.Media.Item>
      <Bulma.Media.Item align="right">
        <div>
          <figure className="image is-128x128 rounded-border">
            {selectedSpecies && (
              <Bulma.Image
                src={selectedSpecies.src}
                alt={selectedSpecies.scientificName}
              />
            )}
          </figure>
        </div>
      </Bulma.Media.Item>
    </Bulma.Media>
    <div className="mt-3">
      <div>
        <p className="has-text-weight-semibold is-size-5">
          {i18n.t('download.gene-exp-calls.presence-absence-exp')}
          <Link
            className="is-size-6 internal-link ml-2"
            to={`${PATHS.SUPPORT.GENE_EXPRESSION_CALLS}#${LINK_ANCHOR.GENE_EXPRESSION_CALLS.SINGLE_EXPR_ID}`}
          >
            {i18n.t('global.see-documentation')}
          </Link>
        </p>
        <div>
          <div>
            <p className="has-text-weight-semibold mt-3">
              {i18n.t('download.gene-exp-calls.anat-entities-only')}
            </p>
            <div className="field has-addons">
              <p className="control">
                <button className="button" type="button">
                  <span>{i18n.t('global.simple-file')}</span>
                </button>
              </p>
              <p className="control">
                <button className="button" type="button">
                  <span>{i18n.t('global.advanced-file')}</span>
                </button>
              </p>
            </div>
          </div>
          <div>
            <p className="has-text-weight-semibold mt-3">
              {i18n.t('download.gene-exp-calls.anat-entities-and-dev')}
            </p>
            <div className="field has-addons">
              <p className="control">
                <button className="button" type="button">
                  <span>{i18n.t('global.simple-file')}</span>
                </button>
              </p>
              <p className="control">
                <button className="button" type="button">
                  <span>{i18n.t('global.advanced-file')}</span>
                </button>
              </p>
            </div>
          </div>
          <p className="mt-2 is-italic">
            {i18n.t('download.gene-exp-calls.advanced-file-description')}
          </p>
        </div>
      </div>
      <div>
        <p className="has-text-weight-semibold is-size-5 mt-2">
          {i18n.t('download.gene-exp-calls.over-under-exp')}
          <Link
            className="is-size-6 internal-link ml-2"
            to={`${PATHS.SUPPORT.GENE_EXPRESSION_CALLS}#${LINK_ANCHOR.GENE_EXPRESSION_CALLS.SINGLE_DIFF_ID}`}
          >
            {i18n.t('global.see-documentation')}
          </Link>
        </p>
        <p>{i18n.t('download.gene-exp-calls.improvement-in-progress')}</p>
      </div>
    </div>
  </Bulma.Modal.Content>
);

export default DlGeneExpressionCallsSpeciesModal;
