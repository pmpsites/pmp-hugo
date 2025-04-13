import React from "react";
import CMS from "netlify-cms";
// SEE EXAMPLE at https://decapcms.org/docs/custom-widgets/#registereditorcomponent
// Editor Component HTML5 Video 
CMS.registerEditorComponent({
    // Internal id of the component
    id: "html5-video",
    // Visible label
    label: "HTML5 Video",
    // Fields the user need to fill out when adding an instance of the component
    fields: [
      {
        name: 'poster',
        label: 'Poster Image',
        widget: 'file'
      },
      {
        name: 'video',
        label: 'Video URL',
        widget: 'file'
      }
    ],
    // Regex pattern used to search for instances of this block in the markdown document.
    // Patterns are run in a multiline environment (against the entire markdown document),
    // and so generally should make use of the multiline flag (`m`). If you need to capture
    // newlines in your capturing groups, you can either use something like
    // `([\S\s]*)`, or you can additionally enable the "dot all" flag (`s`),
    // which will cause `(.*)` to match newlines as well.
    //
    // Additionally, it's recommended that you use non-greedy capturing groups (e.g.
    // `(.*?)` vs `(.*)`), especially if matching against newline characters.
    //pattern: /^<details>$\s*?<summary>(.*?)<\/summary>\n\n(.*?)\n^<\/details>$/ms,
    pattern: /^<video width=\"100%\" poster=\"(.*?)\" controls><source src=\"(.*?)\" type=\"video\/mp4\">Your browser does not support the video tag.<\/video>$/ms,
    // Given a RegExp Match object
    // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match#return_value),
    // return an object with one property for each field defined in `fields`.
    //
    // This is used to populate the custom widget in the markdown editor in the CMS.
    fromBlock: function(match) {
      return {
        poster: match[1],
        video: match[2]
      };
    },
    // Given an object with one property for each field defined in `fields`,
    // return the string you wish to be inserted into your markdown.
    //
    // This is used to serialize the data from the custom widget to the
    // markdown document
    toBlock: function(data) {
      return `<video width="100%" poster="${data.poster}" controls><source src="${data.video}" type="video/mp4">Your browser does not support the video tag.</video>`;
    },
    // Preview output for this component. Can either be a string or a React component
    // (component gives better render performance)
    toPreview: function(data) {
      return `<video width="100%" poster="${data.poster}" controls><source src="${data.video}" type="video/mp4">Your browser does not support the video tag.</video>`;
    }
  });
 



import HomePreview from "./cms-preview-templates/home.js";
import PostPreview from "./cms-preview-templates/post.js";
import ContactPreview from "./cms-preview-templates/contact.js";
import EnergyPreview from "./cms-preview-templates/energy.js";
import LandPreview from "./cms-preview-templates/land.js";
import InfrastructurePreview from "./cms-preview-templates/infrastructure.js";
import LocationPreview from "./cms-preview-templates/location.js";
import WorkforcePreview from "./cms-preview-templates/workforce.js";
import HistoryPreview from "./cms-preview-templates/history.js";
//import AboutPreview from "./cms-preview-templates/about.js";


CMS.registerPreviewStyle("https://www.wiltoninternational.com/css/styles.css");
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("contact", ContactPreview);
CMS.registerPreviewTemplate("energy", EnergyPreview);
CMS.registerPreviewTemplate("land", LandPreview);
CMS.registerPreviewTemplate("infrastructure", InfrastructurePreview);
CMS.registerPreviewTemplate("location", LocationPreview);
CMS.registerPreviewTemplate("workforce", WorkforcePreview);
CMS.registerPreviewTemplate("history", HistoryPreview);
//CMS.registerPreviewTemplate("about", AboutPreview);