
'use strict';

function remove_image_content_directory (config, pageList) {
  var i;
  for (i = 0; i < pageList.length; i++) {
    if (pageList[i].slug === config.image_url.replace(/\//g, '')) {
      pageList.splice(i, 1);
    }
  }
  // Filter out the directories with no files in them
  return pageList.filter(x => {
    if(x.is_directory) {
      return x.files.length > 0;
    }
    return true;
  });
}

// Exports
module.exports = remove_image_content_directory;
