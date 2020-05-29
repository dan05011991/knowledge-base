
'use strict';

const path              = require('path');
const fs                = require('fs-extra');
const utils             = require('./utils');
const _s                = require('underscore.string');
const marked            = require('marked');
const contentProcessors = require('../functions/contentProcessors');
const roleHandler       = require('../functions/roles');

async function handler (filePath, userRoles, config) {
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));

  try {
    const file = await fs.readFile(filePath);
    const meta = contentProcessors.processMeta(file.toString('utf-8'));

    if(!roleHandler.isAllowedContent(meta.group, userRoles, config)) {
      return null;
    }

    let slug = utils.getSlug(filePath, contentDir);

    if (slug.indexOf('index.md') > -1) {
      slug = slug.replace('index.md', '');
    }
    slug = slug.replace('.md', '').trim();

    const content = contentProcessors.processVars(
      contentProcessors.stripMeta(file.toString('utf-8')),
      config
    );

    const body = marked(content);
    const title = meta.title ? meta.title : contentProcessors.slugToTitle(slug);

    const excerpt = _s.prune(_s.stripTags(_s.unescapeHTML(body)), (config.excerpt_length || 400));

    return { slug, title, body, excerpt };

  } catch (e) {
    if (config.debug) {
      console.log('ERROR', e);
    }
    return null;
  }
}

exports.default = handler;
module.exports = exports.default;
