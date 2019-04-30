const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// Eleventy config
module.exports = function(eleventyConfig) {
  // ---
  // Aliases
  // ---
  eleventyConfig.addLayoutAlias('base', 'layouts/base.liquid');
  eleventyConfig.addLayoutAlias('default', 'layouts/default.liquid');
  eleventyConfig.addLayoutAlias('index', 'layouts/index.liquid');
  eleventyConfig.addLayoutAlias('typography', 'layouts/typography.liquid');

  // ---
  // Collections
  // ---
  // Articles > sorted by date

  // eleventyConfig.addCollection('articles', collection => {
  //   return collection.getFilteredByGlob('src/_articles/*.md').sort(function(a, b) {
  //     return b.date - a.date;
  //   });
  // });
  // // Cases > sorted by id
  // eleventyConfig.addCollection('cases', collection => {
  //   return collection.getFilteredByGlob('src/_cases/*.md').sort((a, b) => {
  //     return a.data.display_order - b.data.display_order;
  //   });;
  // });

  // ---
  // Plugins
  // ---
  eleventyConfig.addPlugin(syntaxHighlight);


  // ---
  // Copy files to the compiled site folder
  // ---
  eleventyConfig.addPassthroughCopy('src/assets/img');
  eleventyConfig.addPassthroughCopy('src/robots.txt');
  eleventyConfig.addPassthroughCopy('src/favicon.png');
  eleventyConfig.addPassthroughCopy('src/favicon.ico');
  eleventyConfig.addPassthroughCopy('src/apple-touch-icon-precomposed.png');

  // ---
  // Filters
  // ---
  // {{ variable | jsonify }}
  eleventyConfig.addFilter('jsonify', function (variable) {
    return JSON.stringify(variable);
  });

  // {{ array | where: key,value }}
  eleventyConfig.addFilter('where', function (array, key, value) {
    return array.filter(item => {
      const keys = key.split('.');
      const reducedKey = keys.reduce((object, key) => {
        return object[key];
      }, item);

      return (reducedKey === value ? item : false);
    });
  });

  // ---
  // Liquid config
  // ---
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true
  });

  // ---
  // Config
  // ---
  return {
    dir: {
      input: "./src",   // Source
      output: "./_site" // Destination
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "liquid",
    dataTemplateEngine: "liquid"
  };
};
